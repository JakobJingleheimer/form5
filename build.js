import { build } from 'esbuild';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

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
	inject: [
		'./react-shim.js',
	],
	logLevel: 'debug',
	outdir: './docs/build',
	platform: 'neutral',
	plugins: [
		cssModulesPlugin({
			localsConvention: 'dashesOnly',
		}),
	],
	sourcemap: true,
	target: 'esnext',
})
.catch(() => process.exit(1));
