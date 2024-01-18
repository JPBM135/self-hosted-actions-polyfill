/* eslint-disable promise/prefer-await-to-callbacks */
import { Writable } from 'node:stream';
import * as core from '@actions/core';

export function createStreams() {
  const stdout = new Writable({
    write(chunk, __, callback) {
      core.debug(chunk.toString());
      callback();
    },
  });

  const stderr = new Writable({
    write(chunk, __, callback) {
      core.error(chunk.toString());
      callback();
    },
  });

  return { outStream: stdout, errStream: stderr };
}
