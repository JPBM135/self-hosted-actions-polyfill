import type { Buffer } from 'node:buffer';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { execCatch } from '../utils/execCatch.js';

export async function polyfillYarn() {
  const isYarnInstalled =
    (await exec.exec('yarn', ['--version'], { ignoreReturnCode: true, failOnStdErr: false }).catch(execCatch)) === 0;

  if (isYarnInstalled) {
    core.info('Yarn already installed.');
    return;
  }

  core.info('Installing Yarn...');

  const commands = ['curl -o- -L https://yarnpkg.com/install.sh | bash'];

  for (const command of commands) {
    core.debug(`Running command: ${command}`);
    const response = await exec
      .exec(command, undefined, {
        ignoreReturnCode: true,
        failOnStdErr: false,
        listeners: {
          stdout: (data: Buffer) => {
            core.debug(data.toString());
          },
          stderr: (data: Buffer) => {
            core.debug(data.toString());
          },
        },
      })
      .catch(execCatch);

    if (response !== 0) {
      core.setFailed(`Command failed: ${command}`);
      return;
    }
  }

  core.debug('Adding Yarn to PATH...');

  core.addPath('/usr/local/share/.config/yarn/global/node_modules/.bin');

  core.info('Yarn installed.');
}
