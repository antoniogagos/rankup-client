import { getRequestFilePath } from '@web/dev-server-core';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'postcss';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssImport from 'postcss-import';
import { existsSync, readFileSync, realpathSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

const COMPILE_CSS = process.argv.includes('--compile-css');

const commonjsPlugin = fromRollup(commonjs);
const jsonPlugin = fromRollup(json);

function stripColorScaleVars() {
	return {
		postcssPlugin: 'strip-color-scale-vars',
		Declaration(decl) {
			if (decl.prop.startsWith('--color-scale-')) {
				decl.remove();
			}
		},
	};
}
stripColorScaleVars.postcss = true;

const WORKSPACE_PACKAGE_NAME = 'rk-app';

function isPathInside(childPath, parentPath) {
	const relative = path.relative(parentPath, childPath);
	if (relative === '') {
		return true;
	}
	return !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function isWorkspaceRoot(dirPath) {
	const pkgPath = path.join(dirPath, 'package.json');
	if (!existsSync(pkgPath)) {
		return false;
	}
	try {
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
		if (pkg?.name !== WORKSPACE_PACKAGE_NAME) {
			return false;
		}
		const hasWorkspaces = Array.isArray(pkg?.workspaces) && pkg.workspaces.includes('apps/*');
		const hasTsconfigBase = existsSync(path.join(dirPath, 'tsconfig-base.json'));
		return hasWorkspaces && hasTsconfigBase;
	} catch {
		return false;
	}
}

function resolveRepoRoot(appRoot) {
	let current = realpathSync(appRoot);
	while (true) {
		if (isWorkspaceRoot(current)) {
			return current;
		}
		const parent = path.dirname(current);
		if (parent === current) {
			return appRoot;
		}
		current = parent;
	}
}

function getRootDepth(appRoot, repoRoot) {
	const relative = path.relative(appRoot, repoRoot);
	if (!relative) {
		return 0;
	}
	return relative.split(path.sep).filter(part => part === '..').length;
}

export function createWebDevServerConfig(appRoot) {
	const APP_ROOT = realpathSync(appRoot);
	const REPO_ROOT = resolveRepoRoot(APP_ROOT);
	const OUTSIDE_ROOT_PREFIX = '/__wds-outside-root__';
	if (!isPathInside(APP_ROOT, REPO_ROOT)) {
		throw new Error(`[wds] App root must be inside repo root. appRoot=${APP_ROOT} repoRoot=${REPO_ROOT}`);
	}
	const ROOT_DEPTH = getRootDepth(APP_ROOT, REPO_ROOT);
	const ROOT_PREFIX_PATH = `${OUTSIDE_ROOT_PREFIX}/${ROOT_DEPTH}`;
	const TS_CONFIG = path.join(REPO_ROOT, 'tsconfig-base.json');

	function resolveDiskPathInRoot(rootDir, urlPath) {
		const resolvedPath = path.resolve(rootDir, `.${urlPath}`);
		if (!isPathInside(resolvedPath, rootDir)) {
			return null;
		}
		return resolvedPath;
	}

	function compileCssPlugin() {
		let rootDir = APP_ROOT;
		const processor = postcss([postcssImport(), postcssCustomProperties({ preserve: false }), stripColorScaleVars()]);

		return {
			name: 'compile-css',
			serverStart({ config }) {
				rootDir = config.rootDir ?? rootDir;
			},
			async serve(context) {
				if (!COMPILE_CSS) {
					return;
				}
				if (!context.path.endsWith('.css')) {
					return;
				}
				const filePath = getRequestFilePath(context.url, rootDir);
				if (!existsSync(filePath)) {
					return;
				}
				const css = await readFile(filePath, 'utf8');
				const result = await processor.process(css, { from: filePath });
				return { body: result.css, type: 'css' };
			},
		};
	}

	function cssModuleSheetsPlugin() {
		let rootDir = APP_ROOT;
		return {
			name: 'css-module-sheets',
			serverStart({ config }) {
				rootDir = config.rootDir ?? rootDir;
			},
			async serve(context) {
				if (!context.path.endsWith('.css')) {
					return;
				}
				const fetchDest = String(context.request.headers['sec-fetch-dest'] ?? '').toLowerCase();
				const accept = String(context.request.headers.accept ?? '').toLowerCase();
				const isScriptRequest = fetchDest === 'script' || accept.includes('application/javascript') || accept.includes('text/javascript');
				if (!isScriptRequest) {
					return;
				}
				const filePath = getRequestFilePath(context.url, rootDir);
				if (!existsSync(filePath)) {
					return;
				}
				const css = await readFile(filePath, 'utf8');
				return { body: `const sheet=new CSSStyleSheet();sheet.replaceSync(${JSON.stringify(css)});export default sheet;`, type: 'js' };
			},
		};
	}

	async function readJsonFile(filePath) {
		if (!existsSync(filePath)) {
			return null;
		}
		const raw = await readFile(filePath, 'utf8');
		return JSON.parse(raw);
	}

	async function resolveEnvConfig() {
		const envFile = path.join(APP_ROOT, 'env.json');
		const envExampleFile = path.join(REPO_ROOT, 'packages/platform/env.json.example');
		const envConfig = await readJsonFile(envFile);
		if (envConfig) {
			return envConfig;
		}
		return (await readJsonFile(envExampleFile)) ?? {};
	}

	function injectRuntimeEnvPlugin() {
		return {
			name: 'inject-runtime-env',
			async transform(context) {
				if (!context.response.is('html')) {
					return;
				}
				const envConfig = await resolveEnvConfig();
				const nodeEnv = process.env.NODE_ENV ?? 'development';
				const snippet = `<script>window.__APP_ENV__=${JSON.stringify(envConfig)};window.process=window.process||{};window.process.env=window.process.env||{};window.process.env.NODE_ENV=${JSON.stringify(nodeEnv)};</script>`;
				const body = String(context.body);
				if (body.includes('window.__APP_ENV__')) {
					return;
				}
				if (body.includes('</head>')) {
					return body.replace('</head>', `${snippet}</head>`);
				}
				return `${snippet}${body}`;
			},
		};
	}

	/** @type {import('@web/dev-server').DevServerConfig} */
	const config = {
		rootDir: APP_ROOT,
		preserveSymlinks: false,
		nodeResolve: {
			rootDir: REPO_ROOT,
			browser: true,
			preferBuiltins: false,
			exportConditions: ['browser', 'module', 'main'],
			dedupe: ['lit'],
			moduleDirectories: ['node_modules'],
			jail: REPO_ROOT,
		},
		mimeTypes: {
			'**/*.ts': 'js',
			'**/*.json': 'js',
			'**/*.wasm': 'application/wasm',
		},
		plugins: [
			esbuildPlugin({
				tsconfig: TS_CONFIG,
				ts: true,
				json: false,
				loaders: { '.ts': 'ts' },
			}),
			commonjsPlugin(),
			jsonPlugin(),
			cssModuleSheetsPlugin(),
			compileCssPlugin(),
			injectRuntimeEnvPlugin(),
		],
		middleware: [
			function isolationHeaders(context, next) {
				context.response.set('Cross-Origin-Opener-Policy', 'same-origin');
				context.response.set('Cross-Origin-Embedder-Policy', 'require-corp');
				return next();
			},
			function blockOutsideRepo(context, next) {
				const match = /^\/__wds-outside-root__\/(\d+)(\/|$)/.exec(context.path);
				if (!match) {
					return next();
				}
				const depth = Number(match[1]);
				if (!Number.isFinite(depth) || depth < 0) {
					context.response.status = 400;
					context.body = 'Invalid outside-root depth.';
					return;
				}
				if (depth > ROOT_DEPTH) {
					context.response.status = 404;
					context.body = 'Outside-root request blocked.';
					return;
				}
				return next();
			},
			function rewriteOutsideRoot(context, next) {
				const [pathOnly, query = ''] = context.url.split('?');
				if (pathOnly.startsWith('/assets/')) {
					context.url = `${ROOT_PREFIX_PATH}${pathOnly}${query ? `?${query}` : ''}`;
					return next();
				}
				if (pathOnly.startsWith('/docs/')) {
					context.url = `${ROOT_PREFIX_PATH}${pathOnly}${query ? `?${query}` : ''}`;
					return next();
				}
				if (pathOnly.startsWith('/node_modules/')) {
					const localDiskPath = resolveDiskPathInRoot(APP_ROOT, pathOnly);
					if (localDiskPath && existsSync(localDiskPath)) {
						return next();
					}
					const repoDiskPath = resolveDiskPathInRoot(REPO_ROOT, pathOnly);
					if (repoDiskPath && existsSync(repoDiskPath)) {
						context.url = `${ROOT_PREFIX_PATH}${pathOnly}${query ? `?${query}` : ''}`;
						return next();
					}
					return next();
				}
				return next();
			},
			function spaFallback(context, next) {
				const [pathOnly] = context.url.split('?');
				const accept = String(context.request.headers.accept ?? '');
				const wantsHtml = accept.includes('text/html');
				if (!wantsHtml) {
					return next();
				}
				if (pathOnly.startsWith('/__wds-') || pathOnly.startsWith('/assets/') || pathOnly.startsWith('/docs/')) {
					return next();
				}
				if (path.extname(pathOnly)) {
					return next();
				}
				context.url = '/index.html';
				return next();
			},
		],
	};

	return config;
}

export default createWebDevServerConfig(process.cwd());
