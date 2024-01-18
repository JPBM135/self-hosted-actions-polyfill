import { platform } from 'node:os';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest';
import { POLYFILLS } from './constants.js';
import type { PolyfillKey, PolyfillLib } from './types/polyfills.js';
import { main } from './index.js';

vitest.mock('node:os');
vitest.mock('@actions/core');
vitest.mock('@actions/exec');

describe('Self-Hosted Actions Polyfill', () => {
  beforeEach(() => {
    vitest.mocked(core).debug.mockImplementation(() => {});
    vitest.mocked(core).info.mockImplementation(() => {});
    vitest.mocked(core).warning.mockImplementation(() => {});
  });

  afterEach(() => {
    vitest.restoreAllMocks();
  });

  it('should run without errors with all parameters default', async () => {
    vitest.mocked(platform).mockReturnValue('linux');

    vitest.mocked(core).getInput.mockReturnValue('');
    vitest.mocked(core).getBooleanInput.mockReturnValue(false);
    vitest.mocked(core).addPath.mockImplementation(() => {});
    vitest.mocked(core).setFailed.mockImplementation(() => {});

    vitest.mocked(exec).exec.mockResolvedValue(0);

    await main();

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(exec.exec).toHaveBeenCalledTimes(8);

    expect(exec.exec).toHaveBeenCalledWith('sudo', ['apt-get', 'update', '-y'], expect.anything());

    const defaultPolyfills = Object.values(POLYFILLS).filter((polyfill) => polyfill.default && polyfill.aptPackage);
    const needs = Object.values(POLYFILLS).reduce<PolyfillLib[]>(
      (acc, polyfill) => [...acc, ...(polyfill.needs || []).map((pkg) => POLYFILLS[pkg as PolyfillKey])],
      [],
    );

    expect(exec.exec).toHaveBeenCalledWith(
      'sudo',
      ['apt-get', 'install', '-y', '--no-install-recommends', ...needs.map((polyfill) => polyfill.aptPackage!)],
      expect.anything(),
    );

    const polyfillsToInstall = defaultPolyfills.filter(
      (polyfill) => !needs.some((pkg) => pkg.aptPackage === polyfill.aptPackage),
    );

    expect(exec.exec).toHaveBeenCalledWith(
      'sudo',
      [
        'apt-get',
        'install',
        '-y',
        '--no-install-recommends',
        ...polyfillsToInstall.map((polyfill) => polyfill.aptPackage!),
      ],
      expect.anything(),
    );

    expect(exec.exec).toHaveBeenCalledWith('/bin/bash', ['-c', POLYFILLS.yarn?.command], expect.anything());

    expect(exec.exec).toHaveBeenCalledWith(
      '/bin/bash',
      ['-c', `echo "${POLYFILLS.yarn.path}" >> $GITHUB_PATH`],
      expect.anything(),
    );

    expect(exec.exec).toHaveBeenCalledWith('/bin/bash', ['-c', POLYFILLS.docker?.command], expect.anything());

    expect(exec.exec).toHaveBeenCalledWith('/bin/bash', ['-c', POLYFILLS['aws-cli']?.command], expect.anything());

    expect(exec.exec).toHaveBeenLastCalledWith('sudo', ['apt-get', 'autoremove', '-y'], expect.anything());
  });

  it('should run without errors if the run-in-band is true', async () => {
    vitest.mocked(platform).mockReturnValue('linux');

    vitest.mocked(core).getInput.mockImplementation((name: string): string => {
      if (name === 'run-in-band') {
        return 'true';
      }

      return '';
    });
    vitest.mocked(core).getBooleanInput.mockImplementation((name: string): boolean => {
      return name === 'run-in-band';
    });
    vitest.mocked(core).addPath.mockImplementation(() => {});
    vitest.mocked(core).setFailed.mockImplementation(() => {});

    vitest.mocked(exec).exec.mockResolvedValue(0);

    await main();

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(exec.exec).toHaveBeenCalledTimes(7);

    expect(exec.exec).toHaveBeenCalledWith('sudo', ['apt-get', 'update', '-y'], expect.anything());

    const defaultPolyfills = Object.values(POLYFILLS).filter((polyfill) => polyfill.default && polyfill.aptPackage);

    expect(exec.exec).toHaveBeenCalledWith(
      'sudo',
      [
        'apt-get',
        'install',
        '-y',
        '--no-install-recommends',
        ...defaultPolyfills.map((polyfill) => polyfill.aptPackage!),
      ],
      expect.anything(),
    );

    expect(exec.exec).toHaveBeenCalledWith('/bin/bash', ['-c', POLYFILLS.yarn?.command], expect.anything());

    expect(exec.exec).toHaveBeenCalledWith(
      '/bin/bash',
      ['-c', `echo "${POLYFILLS.yarn.path}" >> $GITHUB_PATH`],
      expect.anything(),
    );

    expect(exec.exec).toHaveBeenCalledWith('/bin/bash', ['-c', POLYFILLS.docker?.command], expect.anything());

    expect(exec.exec).toHaveBeenCalledWith('/bin/bash', ['-c', POLYFILLS['aws-cli']?.command], expect.anything());

    expect(exec.exec).toHaveBeenLastCalledWith('sudo', ['apt-get', 'autoremove', '-y'], expect.anything());
  });

  it('should run without errors if the skip-defaults is true and includes as curl', async () => {
    vitest.mocked(platform).mockReturnValue('linux');

    vitest.mocked(core).getInput.mockImplementation((name: string): string => {
      if (name === 'skip-defaults') {
        return 'true';
      }

      if (name === 'includes') {
        return 'curl';
      }

      return '';
    });
    vitest.mocked(core).getBooleanInput.mockImplementation((name: string): boolean => {
      return name === 'skip-defaults';
    });
    vitest.mocked(core).addPath.mockImplementation(() => {});
    vitest.mocked(core).setFailed.mockImplementation(() => {});

    vitest.mocked(exec).exec.mockResolvedValue(0);

    await main();

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(exec.exec).toHaveBeenCalledTimes(3);

    expect(exec.exec).toHaveBeenCalledWith('sudo', ['apt-get', 'update', '-y'], expect.anything());

    expect(exec.exec).toHaveBeenCalledWith(
      'sudo',
      ['apt-get', 'install', '-y', '--no-install-recommends', POLYFILLS.curl.aptPackage!],
      expect.anything(),
    );

    expect(exec.exec).toHaveBeenLastCalledWith('sudo', ['apt-get', 'autoremove', '-y'], expect.anything());
  });

  it('should throw an error if the platform is not supported', async () => {
    vitest.mocked(platform).mockReturnValue('darwin');

    vitest.mocked(core).getInput.mockReturnValue('');
    vitest.mocked(core).getBooleanInput.mockReturnValue(false);
    vitest.mocked(core).addPath.mockImplementation(() => {});
    vitest.mocked(core).setFailed.mockImplementation(() => {});

    vitest.mocked(exec).exec.mockResolvedValue(0);

    await main();

    expect(core.setFailed).toHaveBeenCalledWith('Unsupported platform: darwin');
  });

  it('should throw an error if apt-get update fails', async () => {
    vitest.mocked(platform).mockReturnValue('linux');

    vitest.mocked(core).getInput.mockReturnValue('');
    vitest.mocked(core).getBooleanInput.mockReturnValue(false);
    vitest.mocked(core).addPath.mockImplementation(() => {});
    vitest.mocked(core).setFailed.mockImplementation(() => {});

    vitest.mocked(exec).exec.mockResolvedValue(1);

    await main();

    expect(core.setFailed).toHaveBeenCalledWith('Apt update failed with exit code 1.');
  });
});
