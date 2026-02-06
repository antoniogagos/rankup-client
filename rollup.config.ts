import { compileLitTemplates } from '@lit-labs/compiler';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { rollupPluginHTML } from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import autoprefixer from 'autoprefixer';
import { createRequire } from 'module';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import SVGO from 'svgo';
import { readFile } from 'fs/promises';

const require = createRequire(import.meta.url);
const postcssLib = require('postcss');
const DIST_DIR = 'dist';
const TS_CONFIG = 'tsconfig.rollup.json';

/** @returns {import('rollup').Plugin} */
function cssModuleSheets() {
	const processor = postcssLib([autoprefixer()]);

	return {
		name: 'css-module-sheets',
		async load(id) {
			if (!id.endsWith('.css')) {
				return null;
			}
			const css = await readFile(id, 'utf8');
			const result = await processor.process(css, { from: id });
			const payload = JSON.stringify(result.css);
			return `const sheet = new CSSStyleSheet();sheet.replaceSync(${payload});export default sheet;`;
		},
	};
}

/** @type {import('rollup').RollupOptions} */
const config = {
	input: ['apps/**/*.html'],
	output: {
		entryFileNames: '[hash].js',
		chunkFileNames: '[hash].js',
		assetFileNames: '[hash][extname]',
		format: 'esm',
		dir: DIST_DIR,
		sourcemap: false,
	},
	preserveEntrySignatures: false,
	preserveSymlinks: true,
	plugins: [
		cssModuleSheets(),
		typescript({
			tsconfig: TS_CONFIG,
			transformers: {
				before: [compileLitTemplates()],
			},
		}),
		json(),
		replace({
			'Reflect.decorate': 'undefined',
			preventAssignment: true,
		}),
		rollupPluginHTML({
			minify: true,
		}),
		nodeResolve({
			browser: true,
			extensions: ['.js', '.ts', '.json'],
		}),
		commonjs(),
		terser({
			ecma: 2020,
			module: true,
		}),
		postcss({
			plugins: [autoprefixer()],
			sourceMap: false,
			extract: true,
			minimize: true,
		}),
		importMetaAssets({
			transform: (assetBuffer, assetPath) =>
				assetPath.endsWith('.svg')
					? SVGO.optimize(assetBuffer.toString(), {
							multipass: true,
							floatPrecision: true,
						}).data
					: assetBuffer,
		}),
		babel({
			generatorOpts: { sourceMaps: false },
			babelHelpers: 'bundled',
			assumptions: {
				setPublicClassFields: true,
			},
			presets: [
				[
					require.resolve('@babel/preset-env'),
					{
						targets: ['last 6 Chrome major versions', 'last 3 Firefox major versions', 'last 3 Edge major versions', 'last 3 Safari major versions'],
						modules: false,
						bugfixes: true,
						shippedProposals: true,
					},
				],
			],
			plugins: [
				[
					require.resolve('babel-plugin-template-html-minifier'),
					{
						modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
						failOnError: false,
						strictCSS: true,
						htmlMinifier: {
							collapseWhitespace: true,
							conservativeCollapse: true,
							removeComments: true,
							caseSensitive: true,
							minifyCSS: false,
						},
					},
				],
			],
		}),
		copy({
			targets: [
				{
					src: ['assets/**/*'],
					dest: `${DIST_DIR}/assets`,
				},
				{
					src: ['packages/samba/styles/light-theme.css', 'packages/samba/styles/dark-theme.css'],
					dest: DIST_DIR,
				},
			],
		}),
	],
};

export default config;
