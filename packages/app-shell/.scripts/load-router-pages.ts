#!/usr/bin/env node

import fs from 'fs';
import { PACKAGE_NAMES } from '../../../.scripts/packages';
import { relativeFromFileURL } from '../../../.scripts/path';

const imports = getImports();

const routesStr = `/* eslint-disable simple-import-sort/imports */
${imports.statements.join('\n')}
import { localizeRoutes, resolveRoutesPath } from '@rankup/common/router/helpers.js';

export default localizeRoutes(
  resolveRoutesPath({
${imports.packages
	.map(pkgName => `\t\t'${pkgName}': ${imports.importNameByPackage.get(pkgName)}`)
	.join(',\n')}
  })
);
`;

fs.writeFileSync(relativeFromFileURL(__filename, '../global-routes.ts'), routesStr, { flag: 'w' });

function computeImportName(pkgName: string): string {
	return `${pkgName.replace(/-(\w)/g, function (searchValue: string, replaceValue: string) {
		return replaceValue.toUpperCase();
	})}Routes`.replace(/[^0-9a-zA-Z]/g, '');
}

function getImports(): {
	statements: string[];
	packages: string[];
	importNameByPackage: Map<string, string>;
} {
	const pkgs = PACKAGE_NAMES.filter(pkgName => routeFileExistsAtPackage(pkgName));
	const packages: string[] = [];
	const importNameByPackage: Map<string, string> = new Map();
	const statements = pkgs.map(pkgName => {
		const importName = computeImportName(pkgName);
		packages.push(pkgName);
		importNameByPackage.set(pkgName, importName);
		return `import { Routes as ${importName} } from '@rankup/${pkgName}/routes.js';`;
	});
	return { statements, packages, importNameByPackage };
}

function routeFileExistsAtPackage(packageName: string): boolean {
	const path = relativeFromFileURL(__filename, ...['../../', packageName, 'routes.ts']);
	return fs.existsSync(path);
}
