import path from 'path';

import { transform } from 'esbuild';


export async function load(resolvedUrl, context, defaultLoad) {
	const url = new URL(resolvedUrl);
	const ext = path.extname(url.pathname).slice(1);

	const handler = loadHandlers[ext];

	url.ext = ext;

	if (handler) return handler(url, context, defaultLoad);

	return defaultLoad(resolvedUrl, context);
}

const loadHandlers = {
	'': loadBin,
	'css': loadCss,
	'jsx': loadJsx,
};

async function loadBin(url, context, defaultLoad) {
	const parentDir = path
		.dirname(url.pathname)
		.split(path.sep)
		.at(-1);

	const format = (!url.ext && parentDir === 'bin')
		? 'commonjs'
		: undefined;

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
