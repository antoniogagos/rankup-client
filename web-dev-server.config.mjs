import Path from 'path';
// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

/**
 * Adding this prefix to an URL, web-dev-server will be able to req at the root level
 */
const REQ_ROOT_PREFIX = '/__wds-outside-root__/0';
const importMap = {
  imports: {
    'samba/': `${REQ_ROOT_PREFIX}/samba/`,
    'modules/': `${REQ_ROOT_PREFIX}/modules/`,
  },
};
const monorepoPkgs = Object.keys(importMap.imports).map(name => name.slice(0, -1));

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  // open: false,
  watch: !hmr,
  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
    dedupe: ['lit', '@lit'],
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  appIndex: 'index.html',

  plugins: [
    {
      name: 'resolveImport',
      resolveImport: resolveImportPlugin,
    },
  ],

  // middlewares: [
  //   // Redirect all request from /app/* (without an extension) to app.html
  //   function rewriteIndex(context, next) {
  //     if (context.url === '/' || context.url.match(/(?<=\/).*(?<!\.\w+)$/)) {
  //       context.url = '/index.html';
  //     }
  //     return next();
  //   },
  // ],

  // See documentation for all available options
});

/** @param {string} url */
function parseURL(url) {
  const urlObj = new URL('http://' + Path.join('localhost', url));
  const page = urlObj.pathname.split('/').filter(Boolean).shift() || 'index';
  const filename = urlObj.pathname.split('/').pop();
  const hasExtension = Boolean(filename.includes('.'));
  return {
    urlObj,
    page,
    filename,
    hasExtension,
  };
}

/**
 * @param {Object} p0
 * @param {*} p0.source url of the import statement
 * @param {*} p0.context context where the import (source param) is found
 */
function resolveImportPlugin({ source, context }) {
  if (monorepoPkgs.includes(parseURL(source).page)) {
    // when resolving dynamic imports we might found request outside our root folder
    // (hadronw-web), therefore we must prepend the prefix to allow request 1 folder above
    //
    // Also, it looks like the importMapsPlugin adds the query param wds-import-map
    // We have to add it too so that we don't fetch the same twice
    return Path.join(REQ_ROOT_PREFIX, source); // + '?wds-import-map=0';
  }
}
