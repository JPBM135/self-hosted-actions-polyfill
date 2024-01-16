import process from 'node:process';
import * as core from '@actions/core';
import { polyfillYarn } from './polyfills/yarn.js';

const POLYFILLS = {
  yarn: polyfillYarn,
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

  for (const [polyfill, polyfillFunction] of Object.entries(POLYFILLS)) {
    if (ignoredModules.includes(polyfill)) {
      core.info(`Skipping ${polyfill} polyfill...`);
      continue;
    }

    core.info(`Running ${polyfill} polyfill...`);
    await polyfillFunction();
  }
} catch (error) {
  core.debug(String(error));

  if ((error as Error).message) {
    core.setFailed((error as Error).message);
  }

  core.setFailed('An unexpected error occurred. Please contact the package maintainer if the problem persists.');
}
