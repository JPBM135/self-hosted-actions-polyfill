import type { Buffer } from 'node:buffer';
import process from 'node:process';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

const POLYFILLS = {
  yarn: 'sudo apt-get install -y --no-install-recommends yarn',
  curl: 'sudo apt-get install -y --no-install-recommends curl',
  git: 'sudo apt-get install -y --no-install-recommends git',
  jq: 'sudo apt-get install -y --no-install-recommends jq',
};

try {
  const platform = process.platform;

  if (platform !== 'linux') {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const ignoredModules = core
    .getInput('ignored')
    .split(',')
    .map((module) => module.trim());

  if (ignoredModules.length === Object.keys(POLYFILLS).length) {
    throw new Error('All polyfills are ignored. Please check your configuration.');
  }

  core.debug('Installing dependencies...');
  await exec.exec('sudo apt-get update', undefined, {
    listeners: {
      stdout: (data: Buffer) => {
        core.info(data.toString());
      },
      stderr: (data: Buffer) => {
        core.info(data.toString());
      },
    },
  });

  for (const [polyfill, polyfillCommand] of Object.entries(POLYFILLS)) {
    if (ignoredModules.includes(polyfill)) {
      core.info(`Skipping ${polyfill} polyfill...`);
      continue;
    }

    core.info(`Running ${polyfill} polyfill...`);
    const code = await exec.exec(polyfillCommand, undefined, {
      listeners: {
        stdout: (data: Buffer) => {
          core.info(data.toString());
        },
        stderr: (data: Buffer) => {
          core.info(data.toString());
        },
      },
    });

    if (code !== 0) {
      throw new Error(`Polyfill ${polyfill} failed with exit code ${code}.`);
    }
  }
} catch (error) {
  core.debug(String(error));

  if ((error as Error).message) {
    core.setFailed((error as Error).message);
  }

  core.setFailed('An unexpected error occurred. Please contact the package maintainer if the problem persists.');
}
