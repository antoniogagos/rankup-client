import alias from '@rollup/plugin-alias';
import { fromRollup } from '@web/dev-server-rollup';
import { readdirSync } from 'fs';

const MONOREPO_FOLDER = '../../packages';
const MONOREPO_PACKAGES = getMonorepoPackages();
// const MONOREPO_PACKAGE_URL_REG = new RegExp(`^\/(${MONOREPO_PACKAGES.join('|')})\/.*`);
// Use Hot Module replacement by adding --hmr to the start command
const hmr = process.argv.includes('--hmr');
// Requests to web-dev-server that starts with this will navigate to the
// upper N (3 in this case) folder, starting from where the web-dev-server is running
const ROOT_PREFIX_PATH = '/__wds-outside-root__/3';

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
	appIndex: 'packages/app/index.html',
	rootDir: './dist',
	watch: !hmr,
	// nodeResolve: { dedupe: ['lit', '@lit'], },
	nodeResolve: true,
	preserveSymlinks: true,
	plugins: [
		/**
		 * "nodeResolve" is not resolving our monorepo packages bare imports:
		 *   i.e. `import 'samba/...'`
		 *   so we're using this plugin to resolve it ourselves.
		 *
		 * Longer explanation:
		 *   - With TS Project References we are already telling the ts compiler that those imports
		 *     are in their respective folder and that's working well
		 *   - However, when it comes to serve files in local, nodeResolve has to do the job of resolving
		 *     bare modules imports.
		 *   - We have symlinks in node_modules: node_modules/samba => packages/samba/ but that even if
		 *     nodeResolve would resolve it, we need assets on the dist folder.
		 */
		fromRollup(alias)({
			entries: MONOREPO_PACKAGES.map(packageName => ({
				find: new RegExp(`^${packageName}`),
				replacement: `${ROOT_PREFIX_PATH}/node_modules/${packageName}/dist`,
			})),
		}),
	],
	middleware: [
		/**
		 * We already handle ESmodule imports via "nodeResolve" and our plugin, but requests from HTML
		 * files need rewriting, because web-dev-server doesn't allow requests in an upper folder where it's
		 * initialized without a specific prefix (ROOT_PREFIX_PATH)
		 */
		function rewriteImports(context, next) {
			if (context.url.startsWith('/node_modules/')) {
				context.url = `${ROOT_PREFIX_PATH}` + context.url;
			}
			return next();
		},
	],
	// middleware: [
	//   // Redirect all request from /app/* (without an extension) to app.html
	//   function rewriteIndex(context, next) {
	//     if (context.url === '/' || context.url.match(/(?<=\/).*(?<!\.\w+)$/)) {
	//       context.url = '/index.html';
	//     }
	//     return next();
	//   },
	// ],
};

function getMonorepoPackages() {
	return readdirSync(MONOREPO_FOLDER, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
}

// /** @param {string} url */
// function parseURL(url) {
//   const urlObj = new URL('http://' + Path.join('localhost', url));
//   const page = urlObj.pathname.split('/').filter(Boolean).shift() || 'index';
//   const filename = urlObj.pathname.split('/').pop() ?? '';
//   const hasExtension = Boolean(filename.includes('.'));
//   return {
//     urlObj,
//     page,
//     filename,
//     hasExtension,
//   };
// }

// /**
//  * @param {Object} p0
//  * @param {*} p0.source url of the import statement
//  * @param {*} p0.context context where the import (source param) is found
//  * @returns {string | undefined}
//  */
// function resolveImportPlugin({ source, context }) {
//   if (monorepoPkgs.includes(parseURL(source).page)) {
//     console.log('redirect', Path.join(REQ_ROOT_PREFIX, source), '::from::', source);
//     // when resolving dynamic imports we might found request outside our root folder
//     // therefore we must prepend the prefix to allow request 1 folder above
//     //
//     // Also, it looks like the importMapsPlugin adds the query param wds-import-map
//     // We have to add it too so that we don't fetch the same twice
//     return Path.join(REQ_ROOT_PREFIX, source); // + '?wds-import-map=0';
//   }
// }
