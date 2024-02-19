import { build } from 'esbuild';


build({
	bundle: true,
	conditions: [
		'development',
	],
	define: {
		'process.env.NODE_ENV': '"development"',
	},
	entryPoints: [
		'./docs/app.jsx',
	],
	format: 'esm',
	jsx: 'automatic',
	loader: {
		'.module.css': 'local-css',
	},
	logLevel: 'debug',
	outdir: './docs/build',
	platform: 'neutral',
	sourcemap: true,
	target: 'esnext',
})
.catch(() => process.exit(1));
