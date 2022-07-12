import { transform } from 'esbuild';

import parseFileExt from './parseFileExt.mjs';


export async function load(url, context, nextLoad) {
	if (parseFileExt(url) !== 'jsx') return nextLoad(url); // not css

	const format = 'module';
	const reactShim = "import * as React from 'react';";
	const rawSource = '' + (await nextLoad(url, { format })).source;
	const shimmedSource = [reactShim, rawSource].join('\n');
	const { code: source } = await transform(shimmedSource, {
		format: 'esm',
		loader: 'jsx',
		sourcemap: 'inline',
		target: 'esnext',
	});

	return {
		format,
		shortCircuit: true,
		source,
	};
}
