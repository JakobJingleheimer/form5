import fs from 'node:fs/promises';
import path from 'node:path';

import { transform } from 'esbuild';


export async function load(resolvedUrl, context, defaultLoad) {
	const url = new URL(resolvedUrl);
	const ext = path.extname(url.pathname).slice(1);

	const handler = loadHandlers[ext];

	if (handler) return handler(url, context, defaultLoad);

	return defaultLoad(resolvedUrl, context);
}

const loadHandlers = {
	'': loadBin,
	'css': loadCss,
	'jsx': loadJsx,
};

async function loadBin(url, context, defaultLoad) {
	const dirs = path
		.dirname(url.pathname)
		.split(path.sep);
	const parentDir = dirs.at(-1);
	const grandparentDir = dirs.at(-3);

	let format;

	if (parentDir === 'bin' && grandparentDir === 'node_modules') {
		const libPkgUrl = new URL('../package.json', url)
		const { type = 'commonjs' } = await fs.readFile(libPkgUrl).then(JSON.parse);

		format = type;
	}

	return defaultLoad(url.href, {
		...context,
		format,
	});
}

async function loadCss() {
	return {
		format: 'module',
		source: 'export default {}',
	}
}

async function loadJsx(url, context, defaultLoad) {
	const format = 'module';
	const reactShim = "import * as React from 'react';";
	const rawSource = '' + (await defaultLoad(url.href, { format })).source;
	const shimmedSource = [reactShim, rawSource].join('\n');
	const { code: source } = await transform(shimmedSource, {
		format: 'esm',
		loader: 'jsx',
		sourcemap: 'inline',
		target: 'esnext',
	});

	return {
		format,
		source,
	};
}
