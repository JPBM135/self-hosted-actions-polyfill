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

  const commands = [
    'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -',
    'echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list',
    'sudo apt update',
    'sudo apt install yarn',
  ];

  for (const command of commands) {
    core.debug(`Running command: ${command}`);
    const response = await exec
      .exec(command, undefined, { ignoreReturnCode: true, failOnStdErr: false })
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
