import { esbuildPlugin } from '@web/dev-server-esbuild';

// const MONOREPO_FOLDER = '../../packages';
// const MONOREPO_PACKAGES = getMonorepoPackages();
// const MONOREPO_PACKAGE_URL_REG = new RegExp(`^\/(${MONOREPO_PACKAGES.join('|')})\/.*`);
// Use Hot Module replacement by adding --hmr to the start command
const hmr = process.argv.includes('--hmr');
// Requests to web-dev-server that starts with this will navigate to the
// upper N folder, starting from where the web-dev-server is running
const ROOT_PREFIX_PATH = '/__wds-outside-root__/2';

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
	appIndex: 'packages/app-shell/index.html',
	rootDir: './',
	watch: !hmr,
	// nodeResolve: { dedupe: ['lit', '@lit'], },
	nodeResolve: true,
	preserveSymlinks: true,
	plugins: [
		esbuildPlugin({
			ts: true,
			json: true,
			target: 'es2020', // without using es2020 decorators fail, because esbuildPlugin doesn't read useDefineForClassFields from tsconfig
		}),
	],
	middleware: [
		/**
		 * We already handle ESmodule imports via "nodeResolve" and our plugin, but requests from HTML
		 * files need rewriting, because web-dev-server doesn't allow requests in an upper folder where it's
		 * initialized without a specific prefix (ROOT_PREFIX_PATH)
		 */
		function rewriteImports(context, next) {
			if (context.url.endsWith('amazon-cognito-identity-js/es/index.js')) {
				// we need to use the min version since the main is only for node
				context.url = context.url.replace('/es/index.js', '/dist/amazon-cognito-identity.min.js');
			} else if (context.url.startsWith('/node_modules/')) {
				context.url = `${ROOT_PREFIX_PATH}` + context.url;
			} else if (context.response.status === 404) {
				if (context.url.match(/(?<=\/).*(?<!\.\w+)$/)) {
					context.url = '/index.html';
				}
			}
			return next();
		},
	],
};

// function getMonorepoPackages() {
// 	return readdirSync(MONOREPO_FOLDER, { withFileTypes: true })
// 		.filter(dirent => dirent.isDirectory())
// 		.map(dirent => dirent.name);
// }

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
