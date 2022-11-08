import fs from 'node:fs/promises';
import path from 'node:path';

import parseFileExt from './parseFileExt.mjs';

/**
 * Node.js's default loader does not support extensionless files (that's a CJS thing). However, many
 * executable packages like mocha use the original extensionless convention.
 *
 * This hooklet tells node how to handle them.
 */
export async function load(url, ctx, next) {
  if (parseFileExt(url).ext !== '') return next(url); // not extensionless bin

  const parsedUrl = new URL(url);
  const dirs = path.dirname(parsedUrl.pathname).split(path.sep);
  const parentDir = dirs.at(-1);
  const grandparentDir = dirs.at(-3);

  let format;

  if (parentDir === 'bin' && grandparentDir === 'node_modules') {
    const libPkgUrl = new URL('../package.json', parsedUrl);
    const { type = 'commonjs' } = await fs.readFile(libPkgUrl).then(JSON.parse);

    format = type;
  }

  return next(parsedUrl.href, {
    ...ctx,
    format,
  });
}
