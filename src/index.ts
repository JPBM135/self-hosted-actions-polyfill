import os from 'node:os';
import process from 'node:process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { POLYFILLS } from './constants.js';
import type { PolyfillKey } from './types/polyfills.js';
import { createStreams } from './utils/createStreams.js';
import { parseModulesToInstall } from './utils/parseModulesToInstall.js';
import { validateInputs, validatePolyfillNeeds } from './utils/validate.js';

export async function main() {
  const IGNORE = core.getInput('ignored', { required: false, trimWhitespace: true })?.split(',').filter(Boolean) ?? [];
  const INCLUDE = core.getInput('include', { required: false, trimWhitespace: true })?.split(',').filter(Boolean) ?? [];
  const SKIP_DEFAULTS = core.getInput('skip-defaults')
    ? core.getBooleanInput('skip-defaults', {
        required: false,
        trimWhitespace: true,
      })
    : false;
  const RUN_IN_BAND = core.getInput('run-in-band') ? core.getBooleanInput('run-in-band') : false;

  try {
    core.debug(`Inputs: ${JSON.stringify({ IGNORE, INCLUDE, SKIP_DEFAULTS, RUN_IN_BAND }, null, 2)}`);

    const platform = os.platform();
    const promises: Promise<void>[] = [];

    if (platform !== 'linux') {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    core.debug('Validating inputs...');
    validateInputs({ ignore: IGNORE, include: INCLUDE, skipDefaults: SKIP_DEFAULTS });

    core.debug('Installing dependencies...');
    const updateCode = await exec.exec('sudo', ['apt-get', 'update', '-y'], {
      ...createStreams(),
    });

    if (updateCode !== 0) {
      throw new Error(`Apt update failed with exit code ${updateCode}.`);
    }

    const modulesToInstall = parseModulesToInstall({ ignore: IGNORE, include: INCLUDE, skipDefaults: SKIP_DEFAULTS });

    validatePolyfillNeeds(modulesToInstall);

    let aptModulesToInstall = modulesToInstall.filter(([, polyfill]) => polyfill.aptPackage);
    const nonAptModulesToInstall = modulesToInstall.filter(([, polyfill]) => polyfill.command);

    const needs = nonAptModulesToInstall.reduce<PolyfillKey[]>((acc, [, cur]) => {
      if (!cur.needs?.length) return acc;

      return [...acc, ...(cur.needs as PolyfillKey[])];
    }, []);

    if (!RUN_IN_BAND && needs.length > 0) {
      core.info(`Installing ${needs.length} polyfills needed by other polyfills beforehand...`);

      const code = await exec.exec(
        'sudo',
        ['apt-get', 'install', '-y', '--no-install-recommends', ...needs.map((need) => POLYFILLS[need].aptPackage!)],
        {
          ...createStreams(),
        },
      );

      if (code !== 0) {
        throw new Error(`Apt failed with exit code ${code}.`);
      }

      core.debug(`Removing apt packages that are no longer needed: ${needs.join(', ')}`);
      const needsSet = new Set(needs);
      aptModulesToInstall = aptModulesToInstall.filter(([name]) => !needsSet.has(name));

      core.info('Successfully installed polyfills needed by other polyfills.');
    }

    if (aptModulesToInstall.length > 0) {
      const installAptPackages = async () => {
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
            ...createStreams(),
          },
        );

        if (code !== 0) {
          throw new Error(`Apt failed with exit code ${code}.`);
        }

        core.info('Successfully installed apt packages.');
      };

      if (RUN_IN_BAND) {
        await installAptPackages();
      } else {
        promises.push(installAptPackages());
      }
    }

    for (const [polyfill, polyfillOptions] of nonAptModulesToInstall) {
      const installCommandPolyfill = async () => {
        core.info(`Installing ${polyfill} polyfill...`);
        const prefixedCommand: [string, string, string] = ['/bin/bash', '-c', polyfillOptions.command!];

        const code = await exec.exec(prefixedCommand[0], [prefixedCommand[1], prefixedCommand[2]], {
          ...createStreams(),
        });

        if (polyfillOptions.path) {
          const escapedPath = polyfillOptions.path.replaceAll('"', '\\"');

          await exec.exec('/bin/bash', ['-c', `echo "${escapedPath}" >> $GITHUB_PATH`], {
            ...createStreams(),
          });

          core.info(`Added ${polyfill} polyfill to PATH.`);
        }

        if (code !== 0) {
          throw new Error(`Polyfill ${polyfill} failed with exit code ${code}.`);
        }

        core.info(`Successfully installed ${polyfill} polyfill.`);
      };

      if (RUN_IN_BAND) {
        await installCommandPolyfill();
      } else {
        promises.push(installCommandPolyfill());
      }
    }

    if (!RUN_IN_BAND) {
      await Promise.all(promises);
    }

    core.info('Cleaning up...');

    await exec.exec('sudo', ['apt-get', 'autoremove', '-y'], {
      ...createStreams(),
    });

    core.info('Successfully cleaned up.');

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
