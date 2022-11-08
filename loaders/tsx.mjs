import { transform } from 'esbuild';

import parseFileExt from './parseFileExt.mjs';


const needles = new Set([
  'jsx',
  'svg',
  'mts',
  'ts',
  'tsx',
]);

export async function load(url, ctx, next) {
  if (!needles.has(parseFileExt(url).ext)) return next(url); // not j|tsx

  const format = 'module';
  const nextResult = await next(url, { format });
  const rawSource = '' + nextResult.source; // byte array → string

  // We're stuck with old skool transform til we can update to react@18
  // https://github.com/facebook/react/issues/20235
  const reactShim = "import * as React from 'react';";
  const shimmedSource = [reactShim, rawSource].join('\n');

  const { code: source, warnings } = await transform(shimmedSource, {
		format: 'esm',
		loader: 'jsx',
		sourcemap: 'inline',
		target: 'esnext',
	})
    .catch(({ errors }) => {
      for (const {
        location: { column, line, lineText },
        text,
      } of errors) {
        console.error(`TranspileError: ${text}\n    at ${url}:${line}:${column}\n    at: ${lineText}\n`);
      }

      return {};
    });

  if (warnings?.length) console.warn(...warnings);

  return {
    format,
    source,
  };
}
