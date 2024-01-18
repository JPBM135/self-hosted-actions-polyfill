import { describe, it, expect, vitest } from 'vitest';
import { POLYFILLS } from '../constants.js';
import type { PolyfillKey, PolyfillLib } from '../types/polyfills.js';
import { parseModulesToInstall } from './parseModulesToInstall.js';

vitest.mock(
  '@actions/core',
  () =>
    ({
      debug: vitest.fn(),
      info: vitest.fn(),
    }) as any,
);

function sortPolyfills(polyfills: [PolyfillKey | string, PolyfillLib][]): [PolyfillKey, PolyfillLib][] {
  return polyfills.sort((a, b) => a[0].localeCompare(b[0])) as [PolyfillKey, PolyfillLib][];
}

describe('parseModulesToInstall', () => {
  it('should return all default polyfills if skipDefaults is false and include is empty', () => {
    const expectedPolyfills = Object.entries(POLYFILLS).filter(([, polyfill]) => polyfill.default);

    const output = parseModulesToInstall({ ignore: [], include: [], skipDefaults: false });

    expect(sortPolyfills(output)).toEqual(sortPolyfills(expectedPolyfills));
  });

  it('should return the included polyfills and all default polyfills if skipDefaults is false', () => {
    const expectedPolyfills = Object.entries(POLYFILLS).filter(
      ([, polyfill]) => polyfill.default || polyfill.aptPackage === POLYFILLS.python3?.aptPackage,
    );

    const output = parseModulesToInstall({ ignore: [], include: ['python3'], skipDefaults: false });

    expect(sortPolyfills(output)).toEqual(sortPolyfills(expectedPolyfills));
  });

  it('should return only the included polyfills if skipDefaults is true', () => {
    expect(parseModulesToInstall({ ignore: [], include: ['curl'], skipDefaults: true })).toEqual([
      ['curl', POLYFILLS.curl],
    ]);
  });

  it('should return only the polyfills that are not ignored if skipDefaults is false', () => {
    const expectedPolyfills = Object.entries(POLYFILLS).filter(
      ([, polyfill]) => polyfill.default && polyfill.aptPackage !== POLYFILLS.curl?.aptPackage,
    );

    const output = parseModulesToInstall({ ignore: ['curl'], include: [], skipDefaults: false });

    expect(sortPolyfills(output)).toEqual(sortPolyfills(expectedPolyfills));
  });

  it('should return no polyfills if all polyfills are ignored and skipDefaults is true', () => {
    expect(parseModulesToInstall({ ignore: ['curl'], include: [], skipDefaults: true })).toEqual([]);
  });

  it('should return only the polyfills that are not ignored or included if skipDefaults is false', () => {
    const expectedPolyfills = Object.entries(POLYFILLS).filter(
      ([, polyfill]) =>
        (polyfill.default || polyfill.aptPackage === POLYFILLS.python3?.aptPackage) &&
        polyfill.aptPackage !== POLYFILLS.curl?.aptPackage,
    );

    const output = parseModulesToInstall({ ignore: ['curl'], include: ['python3'], skipDefaults: false });

    expect(sortPolyfills(output)).toEqual(sortPolyfills(expectedPolyfills));
  });

  it('should return only the polyfills that are not ignored or included if skipDefaults is true', () => {
    expect(parseModulesToInstall({ ignore: ['sudo'], include: ['curl'], skipDefaults: true })).toEqual([
      ['curl', POLYFILLS.curl],
    ]);
  });
});
