import { POLYFILLS } from '../constants.js';
import { ValidationError } from '../structures/ValidationError.js';
import type { PolyfillKey, PolyfillLib } from '../types/polyfills.js';

export function validateInputs({
  ignore,
  include,
  skipDefaults,
}: {
  ignore: string[];
  include: string[];
  skipDefaults: boolean;
}): void {
  if (skipDefaults && include.length === 0) {
    throw new ValidationError('Cannot skip defaults without including any polyfills.');
  }

  if (ignore.length >= Object.keys(POLYFILLS).length) {
    throw new ValidationError('Cannot ignore all polyfills.');
  }

  validatePackageNames(ignore, 'ignored');
  validatePackageNames(include, 'include');
}

export function validatePackageNames(packages: string[], source: string): void {
  const unknownPolyfills = packages.filter((packageName) => !POLYFILLS[packageName as PolyfillKey]);

  if (unknownPolyfills.length > 0) {
    throw new ValidationError(`Unknown polyfills on ${source}: ${unknownPolyfills.join(', ')}`);
  }
}

export function validatePolyfillNeeds(modulesToInstall: [PolyfillKey, PolyfillLib][]): void {
  const polyfillNeeds = modulesToInstall.reduce<
    {
      need: string;
      requiredBy: PolyfillKey;
    }[]
  >((acc, [polyfill, polyfillOptions]) => {
    if (!polyfillOptions.needs?.length) return acc;

    const polyfillNeeds = polyfillOptions.needs.map((polyfillNeed) => ({
      need: polyfillNeed,
      requiredBy: polyfill,
    }));

    return [...acc, ...polyfillNeeds];
  }, []);

  const modulesToInstallMap = new Map(modulesToInstall);

  const missingModules = polyfillNeeds.filter((polyfill) => !modulesToInstallMap.has(polyfill.need as PolyfillKey));

  if (missingModules.length > 0) {
    throw new ValidationError(
      `Missing polyfills needed by other polyfills: ${missingModules.map(({ need, requiredBy }) => `${need} (Required by: ${requiredBy})`).join(', ')}`,
    );
  }
}
