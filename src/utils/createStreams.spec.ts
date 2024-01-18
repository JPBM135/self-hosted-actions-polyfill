import * as core from '@actions/core';
import { describe, it, expect, vitest } from 'vitest';
import { createStreams } from './createStreams.js';

vitest.mock(
  '@actions/core',
  () =>
    ({
      error: vitest.fn(),
      debug: vitest.fn(),
    }) as any,
);

describe('createStreams', () => {
  it('should return streams that log to core.debug and core.error', () => {
    const { outStream, errStream } = createStreams();

    outStream.write('test');
    errStream.write('test');

    expect(core.debug).toHaveBeenCalledWith('test');
    expect(core.error).toHaveBeenCalledWith('test');
  });
});
