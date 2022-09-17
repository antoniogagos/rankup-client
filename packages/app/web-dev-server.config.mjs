import { readdirSync } from 'fs';
import Path from 'path';
// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

const MONOREPO_FOLDER = '../../packages';
const MONOREPO_PACKAGES = getMonorepoPackages();
const MONOREPO_PACKAGE_URL_REG = new RegExp(`^\/(${MONOREPO_PACKAGES.join('|')})\/.*`);
// Use Hot Module replacement by adding --hmr to the start command
const hmr = process.argv.includes('--hmr');
// Adding this prefix to an URL, web-dev-server will be able to req at the root level
const REQ_ROOT_PREFIX = '/__wds-outside-root__/1';

/** @type {import('@web/dev-server').DevServerConfig} */
export default {
	appIndex: 'packages/app/index.html',
	rootDir: './',
	watch: !hmr,
	nodeResolve: {
		browser: true,
		// modulesOnly: true,
		// exportConditions: ['import'],
		dedupe: ['lit', '@lit'],
	},
	preserveSymlinks: true,
	middleware: [
		function rewriteImports(context, next) {
			if (MONOREPO_PACKAGE_URL_REG.test(context.url)) {
				context.url = `${REQ_ROOT_PREFIX}${context.url}`;
			} else console.log(context.url);
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
