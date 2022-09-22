#!/usr/bin/env node

/**
 * @file Writes into "public-app/env.json" or "auth-app/env.json" the routes defined at packages
 *
 * To define routes (normally a single /{package}/* route), a package needs to define the at a rankup.json file
 * @see {@link /common/types/rankup-json.d.ts} for details about the "rankup.json" file
 */

import fs from 'fs';
import Path from 'path';
import { PACKAGE_NAMES, getRankupFile } from '../../../.scripts/packages.mjs';
import { relativeFromFileURL } from '../../../.scripts/path.mjs';

/** @typedef {import('common/types/rankup-json').RankupJSON} RankupJSON */
/** @typedef {import('common/types/rankup-json').Route} Route */

const envJsonPath = relativeFromFileURL(import.meta.url, '../env.json');
const envJson = getEnvJsonContent(envJsonPath);
const routes = getRoutes();
envJson.Routes = routes;
fs.writeFileSync(envJsonPath, JSON.stringify(envJson, null, 2));

/**
 * @param {string} envJsonPath
 * @return {Record<string, any>}
 */
function getEnvJsonContent(envJsonPath) {
	if (!fs.existsSync(envJsonPath)) {
		throw new Error(
			'env.json file not found in app - copy and fill `env.json.example` from the `app` folder',
		);
	}
	try {
		const content = fs.readFileSync(envJsonPath, { encoding: 'utf-8' });
		const data = JSON.parse(content);
		return data;
	} catch (error) {
		throw new Error('Error parsing env');
	}
}

/** @returns {Required<Route>[]} */
function getRoutes() {
	const routes = [];
	PACKAGE_NAMES.forEach(pkgName => {
		const rankupFile = getRankupFile(pkgName);
		if (rankupFile?.routes) {
			for (const route of rankupFile?.routes) {
				const path = route.path.startsWith('/') ? route.path : '/' + route.path;
				const componentName = route.componentName ?? pkgName;
				let componentPath = Path.join(
					'/node_modules/@rankup/',
					pkgName,
					route.componentPath ?? componentName + '.ts',
				);
				/** @type {Required<Route>} */
				const routeInfo = {
					...route,
					path,
					componentName,
					componentPath,
				};
				if (isValidRouteInfo(routeInfo)) {
					const found = routes.find(route => route.route === routeInfo.path);
					if (found) {
						console.error('Found 2 packages with same base route', { routeInfo, found });
						throw new Error('Found 2 packages with same route');
					}
					routes.push(routeInfo);
				} else {
					throw new Error(`Invalid route info found at rankup.json package: ${pkgName}`);
				}
			}
		}
	});
	return routes;
}

/**
 * @param {Required<Route>} routeInfo
 * @returns {boolean}
 */
function isValidRouteInfo(routeInfo) {
	const pathToComponent = relativeFromFileURL(
		import.meta.url,
		...['../../', routeInfo.componentPath.replace(/^\/node_modules\/@rankup\//, '')],
	);
	const componentFileExists = fs.existsSync(pathToComponent);
	return componentFileExists && typeof routeInfo.publicPage === 'boolean';
}
