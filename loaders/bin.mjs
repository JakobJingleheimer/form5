import fs from 'node:fs/promises';
import path from 'node:path';

import parseFileExt from './parseFileExt.mjs';


export async function load(url, context, nextLoad) {
	if (parseFileExt(url) !== '') return nextLoad(url); // not extensionless bin

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

	return nextLoad(url.href, {
		...context,
		format,
	});
}
