import * as core from '@actions/core';

export function execCatch(error: unknown) {
  if ((error as Error).message) {
    core.debug(String(error));
  }

  return 1;
}
