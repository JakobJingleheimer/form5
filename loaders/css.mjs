import parseFileExt from './parseFileExt.mjs';


export async function load(url, context, nextLoad) {
	if (parseFileExt(url) !== 'css') return nextLoad(url); // not css

	return {
		format: 'json',
		shortCircuit: true,
		source: '{}',
	}
}
