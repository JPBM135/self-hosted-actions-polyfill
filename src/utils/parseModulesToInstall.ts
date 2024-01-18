import * as core from '@actions/core';
import { POLYFILLS } from '../constants.js';
import type { PolyfillKey, PolyfillLib } from '../types/polyfills.js';

export function parseModulesToInstall({
  ignore,
  include,
  skipDefaults,
}: {
  ignore: string[];
  include: string[];
  skipDefaults: boolean;
}): [PolyfillKey, PolyfillLib][] {
  const ALL_POLYFILLS = Object.entries(POLYFILLS) as [PolyfillKey, PolyfillLib][];

  const ignoreSet = new Set(ignore);
  core.info(`Ignored modules: ${Array.from(ignoreSet).join(', ')}`);
  const includeSet = new Set(include);
  core.info(`Included modules: ${Array.from(includeSet).join(', ')}`);
  core.info(`Skip defaults: ${skipDefaults}`);

  const modulesToInstall: [PolyfillKey, PolyfillLib][] = [];

  for (const [polyfill, polyfillOptions] of ALL_POLYFILLS) {
    if (ignoreSet.has(polyfill)) {
      core.debug(`Skipping ${polyfill} polyfill because it is ignored.`);
      continue;
    }

    if (includeSet.has(polyfill)) {
      core.debug(`Including ${polyfill} polyfill because it is included.`);
      modulesToInstall.push([polyfill, polyfillOptions]);
      continue;
    }

    if (skipDefaults || !polyfillOptions.default) {
      core.debug(
        skipDefaults
          ? `Skipping ${polyfill} polyfill because it is not included and skipDefaults is true.`
          : `Skipping ${polyfill} polyfill because it is not a default polyfill.`,
      );
      continue;
    }

    core.debug(`Including ${polyfill} polyfill because it is a default polyfill.`);
    modulesToInstall.push([polyfill, polyfillOptions]);
  }

  core.debug(`Modules to install: ${modulesToInstall.map(([polyfill]) => polyfill).join(', ')}`);
  return modulesToInstall;
}
