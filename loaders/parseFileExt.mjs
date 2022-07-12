import path from 'node:path';

export default function parseFileExt(resolvedUrl) {
	const url = new URL(resolvedUrl);

	return path.extname(url.pathname).slice(1);
}
