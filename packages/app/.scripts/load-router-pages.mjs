#!/usr/bin/env node

/**
 * @file Writes into "public-app/env.json" or "auth-app/env.json" the routes defined at packages
 *
 * To define routes (normally a single /{package}/* route), a package needs to define the at a rankup.json file
 * @see {@link /common/types/rankup-json.d.ts} for details about the "rankup.json" file
 */

import fs from 'fs';
import Path from 'path';
import AllLocales from '@rankup/common/i18n/locales.json' assert { type: 'json' };
import { PACKAGE_NAMES, getRankupFile } from '../../../.scripts/packages.mjs';
import { relativeFromFileURL } from '../../../.scripts/path.mjs';

/** @typedef {import('@rankup/common/types/rankup-json').RankupJSON} RankupJSON */
/** @typedef {import('@rankup/common/types/rankup-json').Route} Route */

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

/** @returns {Route[]} */
function getRoutes() {
	/** @type {Route[]} */
	const routes = [];
	const rankupFiles = new Map(
		PACKAGE_NAMES.map(pkgName => [pkgName, /** @type {RankupJSON} */ (getRankupFile(pkgName))]),
	);
	rankupFiles.forEach((rankupFile, pkgName) => {
		if (rankupFile?.routes) {
			for (const route of rankupFile?.routes) {
				const path =
					route.path.startsWith('/') || route.path === '*' ? route.path : '/' + route.path;
				const componentName = getRouteComponentName(route) ?? pkgName;
				let componentPath = Path.join(
					'/node_modules/@rankup/',
					pkgName,
					route.componentPath ?? componentName + '.ts',
				);
				/** @type {Route} */
				const routeInfo = {
					...route,
					publicPage: !!route.publicPage,
					path,
					componentName,
					componentPath,
				};
				ensureIsValidRouteInfo(routeInfo, rankupFiles, pkgName);
				const found = routes.find(route => route.path === routeInfo.path);
				if (found) {
					console.error('Found 2 packages with same route', { routeInfo, found });
					throw new Error('Found 2 packages with same route');
				}
				routes.push(routeInfo);
			}
		}
	});
	ensureHomePathExists(routes);
	// Redirects locales to root
	for (const locale of AllLocales) {
		routes.unshift({
			path: `/${locale}/`,
			publicPage: true,
			redirect: '/',
		});
		routes.unshift({
			path: `/${locale}`,
			publicPage: true,
			redirect: '/',
		});
	}
	return routes;
}

/**
 * @param {Route} routeInfo
 * @param {Map<string, RankupJSON>} rankupFiles
 * @param {string} pkgName
 */
function ensureIsValidRouteInfo(routeInfo, rankupFiles, pkgName) {
	const { redirect, componentPath } = routeInfo;
	const baseErrorMsg = `Invalid route info found at "${pkgName}" rankup.json`;
	if (typeof redirect === 'string' && redirect.length > 0) {
		const redirectPathExists = [...rankupFiles].some(([pkgName, rankupFile]) =>
			rankupFile?.routes?.find(route => arePathsEqual(route.path, redirect)),
		);
		if (!redirectPathExists) {
			throw new Error(
				`${baseErrorMsg}: Redirect path provided but is wasn't found at any other route ${redirect}\n`,
			);
		}
	} else if (componentPath) {
		const pathToComponent = relativeFromFileURL(
			import.meta.url,
			...['../../', componentPath.replace(/^\/node_modules\/@rankup\//, '')],
		);
		const componentFileExists = fs.existsSync(pathToComponent);
		if (!componentFileExists) {
			logError(`\n${baseErrorMsg}: Component file not found at ${pathToComponent}\n`);
			throw new Error();
		}
	} else {
		// shouldn't happen - we need either redirect or path to component
		logError(`${baseErrorMsg}: Redirect or component path must be present`);
		throw new Error();
	}
	if (typeof routeInfo.publicPage !== 'boolean') {
		logError(`${baseErrorMsg}: The attribute "publicPage" must be a boolean`);
		throw new Error();
	}
}

/**
 * @param {Route[]} routes
 */
function ensureHomePathExists(routes) {
	const notFound = !routes.some(route => route.path === '/');
	if (notFound) {
		throw new Error('Home page not found. There must be one route with the exact path = "/"');
	}
}

/**
 * @param {Route} route
 */
function getRouteComponentName(route) {
	if (route.componentName) {
		return route.componentName;
	}
	if (route.componentPath) {
		return Path.basename(route.componentPath).replace(/\.(ts|js)$/, '');
	}
}

/**
 * @param  {...string} paths
 * @returns {boolean}
 */
function arePathsEqual(...paths) {
	const firstPath = addStartingSlash(paths[0]);
	return paths.every(path => addStartingSlash(path) === firstPath);
}

/**
 * @param {string} path
 * @returns {string}
 */
function addStartingSlash(path) {
	return path.startsWith('/') ? path : '/' + path;
}

/**
 * @param {string} msg
 */
function logError(msg) {
	// red + msg + reset
	console.error('\x1b[31m', msg, '\x1b[0m');
}
