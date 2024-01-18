import { describe, it, expect, vitest } from 'vitest';
import { POLYFILLS } from '../constants.js';
import { validateInputs, validatePackageNames, validatePolyfillNeeds } from './validate.js';

vitest.mock(
  '@actions/core',
  () =>
    ({
      debug: vitest.fn(),
      info: vitest.fn(),
    }) as any,
);

describe('validateInputs', () => {
  it('should throw an error if skipDefaults is true and include is empty', () => {
    expect(() => validateInputs({ ignore: [], include: [], skipDefaults: true })).toThrow(
      'Cannot skip defaults without including any polyfills.',
    );
  });

  it('should throw an error if ignore is equal to the number of polyfills', () => {
    expect(() => validateInputs({ ignore: Object.keys(POLYFILLS), include: [], skipDefaults: false })).toThrow(
      'Cannot ignore all polyfills.',
    );
  });

  it('should not throw an error if skipDefaults is false and include is empty', () => {
    expect(() => validateInputs({ ignore: [], include: [], skipDefaults: false })).not.toThrow();
  });

  it('should not throw an error if skipDefaults is true and include is not empty', () => {
    expect(() => validateInputs({ ignore: [], include: ['curl'], skipDefaults: true })).not.toThrow();
  });

  it('should throw an error if an ignored polyfill is unknown', () => {
    expect(() => validateInputs({ ignore: ['unknown'], include: [], skipDefaults: false })).toThrow(
      'Unknown polyfills on ignored: unknown',
    );
  });

  it('should throw an error if an included polyfill is unknown', () => {
    expect(() => validateInputs({ ignore: [], include: ['unknown'], skipDefaults: false })).toThrow(
      'Unknown polyfills on include: unknown',
    );
  });
});

describe('validatePackageNames', () => {
  it('should throw an error if a package name is unknown', () => {
    expect(() => validatePackageNames(['unknown'], 'test')).toThrow('Unknown polyfills on test: unknown');
  });

  it('should not throw an error if all package names are known', () => {
    expect(() => validatePackageNames(['curl'], 'test')).not.toThrow();
  });
});

describe('validatePolyfillNeeds', () => {
  it('should throw an error if a polyfill needs another polyfill that is not being installed', () => {
    expect(() => validatePolyfillNeeds([['yarn', POLYFILLS.yarn]])).toThrow(
      'Missing polyfills needed by other polyfills: curl (Required by: yarn)',
    );
  });

  it('should not throw an error if all polyfills that are needed by other polyfills are being installed', () => {
    expect(() =>
      validatePolyfillNeeds([
        ['curl', POLYFILLS.curl],
        ['yarn', POLYFILLS.yarn],
      ]),
    ).not.toThrow();
  });
});
