import os from 'node:os';
import process from 'node:process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { DEFAULT_EXEC_LISTENERS } from './constants.js';
import { parseModulesToInstall } from './utils/parseModulesToInstall.js';
import { validateInputs, validatePolyfillNeeds } from './utils/validate.js';

export async function main() {
  const IGNORE = core.getInput('ignored', { required: false, trimWhitespace: true })?.split(',').filter(Boolean) ?? [];
  const INCLUDES =
    core.getInput('includes', { required: false, trimWhitespace: true })?.split(',').filter(Boolean) ?? [];
  const SKIP_DEFAULTS = core.getInput('skip-defaults')
    ? core.getBooleanInput('skip-defaults', {
        required: false,
        trimWhitespace: true,
      })
    : false;

  try {
    const platform = os.platform();

    if (platform !== 'linux') {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    core.debug('Validating inputs...');
    validateInputs({ ignore: IGNORE, include: INCLUDES, skipDefaults: SKIP_DEFAULTS });

    core.debug('Installing dependencies...');
    const updateCode = await exec.exec('sudo', ['apt-get', 'update', '-y'], {
      listeners: DEFAULT_EXEC_LISTENERS,
    });

    if (updateCode !== 0) {
      throw new Error(`Apt update failed with exit code ${updateCode}.`);
    }

    const modulesToInstall = parseModulesToInstall({ ignore: IGNORE, include: INCLUDES, skipDefaults: SKIP_DEFAULTS });

    validatePolyfillNeeds(modulesToInstall);

    const aptModulesToInstall = modulesToInstall.filter(([, polyfill]) => polyfill.aptPackage);

    if (aptModulesToInstall.length > 0) {
      core.info(`Installing ${aptModulesToInstall.length} apt packages...`);

      const code = await exec.exec(
        'sudo',
        [
          'apt-get',
          'install',
          '-y',
          '--no-install-recommends',
          ...aptModulesToInstall.map(([, polyfill]) => polyfill.aptPackage!),
        ],
        {
          listeners: DEFAULT_EXEC_LISTENERS,
        },
      );

      if (code !== 0) {
        throw new Error(`Apt failed with exit code ${code}.`);
      }

      core.info('Successfully installed apt packages.');
    }

    const nonAptModulesToInstall = modulesToInstall.filter(([, polyfill]) => polyfill.command);

    for (const [polyfill, polyfillOptions] of nonAptModulesToInstall) {
      core.info(`Installing ${polyfill} polyfill...`);
      const prefixedCommand: [string, string, string] = ['/bin/bash', '-c', polyfillOptions.command!];

      const code = await exec.exec(prefixedCommand[0], [prefixedCommand[1], prefixedCommand[2]], {
        listeners: DEFAULT_EXEC_LISTENERS,
      });

      if (polyfillOptions.path) {
        core.addPath(polyfillOptions.path);
        core.info(`Added ${polyfill} polyfill to PATH.`);
      }

      if (code !== 0) {
        throw new Error(`Polyfill ${polyfill} failed with exit code ${code}.`);
      }

      core.info(`Successfully installed ${polyfill} polyfill.`);
    }

    await exec.exec('sudo', ['apt-get', 'autoremove', '-y'], {
      listeners: DEFAULT_EXEC_LISTENERS,
    });

    core.info('Successfully installed all polyfills.');
  } catch (error) {
    core.debug(String(error));

    if ((error as Error).message) {
      core.setFailed((error as Error).message);
    } else {
      core.setFailed('An unexpected error occurred. Please contact the package maintainer if the problem persists.');
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  await main();
}
