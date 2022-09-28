/**
 * @file used by global-routes.ts -- TODO: merge with this functionality at extended-lit-router-mixin
 */

import AllLocales from '../i18n/locales.json' assert { type: 'json' };
import { localizePath } from '../i18n/localize.js';
import type { ComponentRoute, RedirectRoute, Route } from './types';

export function resolveRoutesPath(routes: { [packageName: string]: Route[] }): Route[] {
	const res: Route[] = [];
	for (const [packageName, pkgRoutes] of Object.entries(routes)) {
		for (const route of pkgRoutes) {
			if (!(route as RedirectRoute).redirect) {
				const _route = route as ComponentRoute;
				if (_route.componentPath && !_route.componentPath.startsWith('/node_modules/')) {
					_route.componentPath = `/node_modules/@rankup/${packageName}/${_route.componentPath}`;
				}
			}
			res.push(route);
		}
	}
	return res;
}

/**
 * Modifies the routes - we only need to do this once
 */
export function localizeRoutes(routes: Route[]): Route[] {
	const redirects = new WeakMap<Route, string | undefined>();
	for (const route of routes) {
		redirects.set(
			route,
			(route as RedirectRoute).redirect
				? toAbsolutePath(computeRedirect(route as RedirectRoute, routes))
				: undefined,
		);
	}
	for (const route of routes) {
		(route as RedirectRoute).redirect = redirects.get(route)!;
		route.path = toAbsolutePath(localizeRoutePath(route as ComponentRoute));
	}
	for (const locale of AllLocales) {
		routes.splice(routes.length - 1, 0, {
			path: `/${locale}/`,
			publicPage: true,
			redirect: '/',
		} as Route);
		routes.splice(routes.length - 1, 0, {
			path: `/${locale}`,
			publicPage: true,
			redirect: '/',
		} as Route);
	}
	return routes;
}

function computeRedirect(route: RedirectRoute, routes: readonly Route[]): string {
	const routeRedirected = routes.find(r => r.name === route.redirect || r.path === route.redirect);
	if (routeRedirected) {
		if ((routeRedirected as ComponentRoute)?.localize !== false) {
			return localizePath(routeRedirected.path);
		}
		return routeRedirected.path;
	}
	return route.redirect;
}

function localizeRoutePath(route: ComponentRoute): string {
	const { path } = route;
	if (path === '/' || path === '*') {
		return path;
	}
	return route.localize !== false ? localizePath(path) : path;
}

function toAbsolutePath(path: string) {
	if (path.charAt(0) !== '/') {
		return '/' + path;
	}
	return path;
}
