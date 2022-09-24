/* /// <reference types="urlpattern-polyfill" /> */
import {
	BaseRouteConfig,
	PathRouteConfig as LitPathRouteConfig,
	Router as LitRouter,
	Routes as LitRoutes,
} from '@lit-labs/router';
import type { ReactiveControllerHost } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { Route } from 'types/rankup-json.js';

import AllLocales from '../i18n/locales.json' assert { type: 'json' };
import { languageCodeFromPath, localizePath } from '../i18n/localize.js';
import RouterStyles from './router-pages-css.js';

// if (!('URLPattern' in globalThis)) await import('urlpattern-polyfill');

export { RouterStyles };

export type PathRouteConfig = LitPathRouteConfig & Route;

export type QueryParams = { [key: string]: string | undefined };

type Host = ReactiveControllerHost & HTMLElement;

type Options = {
	/** defaults to ".router-container" */
	containerSelector?: string;
	fallback?: BaseRouteConfig;
};

/**
 * @returns boolean indicating that redirect was NOT performed - so that it can be used
 * in the "enter" callback to prevent redirection
 */
export function redirect(
	router: LitRouter | LitRoutes,
	path: string,
	searchParams?: QueryParams,
): boolean {
	const parsed = parsePath(path);
	// edge case: called with both "path" having search params, and searchParams parameter
	const _searchParams = { ...parsed.searchParams, ...searchParams };
	let _path = parsed.path.replace(/\?.*/, '');
	// auto localize if it comes only from the main router, as it's the one that
	// adds the base path, and if it's not already localize
	const isMainRouter = router instanceof LitRouter;
	const isAlreadyLocalized = AllLocales.includes(languageCodeFromPath(path)!);
	const mustLocalize = isMainRouter && !isAlreadyLocalized;
	if (mustLocalize) {
		const route = (router.routes as PathRouteConfig[]).find(r => r.path === path);
		if (route?.localize !== false) {
			_path = localizePath(_path);
		}
	}
	if (Object.keys(_searchParams).length > 0) {
		_path += `?${new URLSearchParams(_searchParams as Record<string, string>).toString()}`;
	}
	if (isCurrentUrl(_path)) {
		return true;
	}
	router.goto(_path.replace(/\?.*/, ''));
	window.history.pushState({}, '', _path);
	window.dispatchEvent(new Event('router-redirect'));
	return false;
}

/**
 * This router should only be used at top level pages
 */
export function MainRouter(host: Host, routes: PathRouteConfig[], opts?: Options): LitRouter {
	return createRouterInstance(LitRouter, host, routes, opts);
}

export function Router(host: Host, routes: PathRouteConfig[], opts?: Options): LitRoutes {
	const _fixedRoutes = routes.map(route => ({
		...route,
		// NOTE: paths for nested rules can't start on '/'
		path: route.path.startsWith('/') ? route.path.slice(1) : route.path,
	}));
	return createRouterInstance(LitRoutes, host, _fixedRoutes, opts);
}

function createRouterInstance<T extends Host, K extends typeof LitRoutes | typeof LitRouter>(
	RouterClazz: K,
	host: T,
	routes: PathRouteConfig[],
	opts?: {
		containerSelector?: string;
		fallback?: BaseRouteConfig;
	},
): InstanceType<K> {
	const { containerSelector = '.router-container', ...litRouterOpts } = opts ?? {};
	const router = new RouterClazz(
		host,
		routes.map(route => ({
			...route,
			async enter(params) {
				if (route.redirect) {
					router.goto(route.redirect);
					window.history.replaceState({}, '', route.redirect);
					return false;
				}
				const shouldRenderRoute = route.enter ? !!(await route.enter(params)) : true;
				if (!shouldRenderRoute) {
					return false;
				}
				if (route.componentPath) {
					await import(route.componentPath);
				}
				if (!isCurrentRenderedComponent.call(host, containerSelector, route.componentName!)) {
					// TODO optional animation
					await animatePageChange.call(host, containerSelector);
				}
				return shouldRenderRoute;
			},
			render:
				route.render ||
				(() =>
					unsafeHTML(
						`<${route.componentName} class="page" animation="slide"></${route.componentName}`,
					)),
		})),
		litRouterOpts,
	);
	return router as InstanceType<K>;
}

function isCurrentRenderedComponent(
	this: HTMLElement,
	containerSelector: string,
	componentName: string,
): boolean {
	return getCurrentRenderedComponent.call(this, containerSelector)?.localName === componentName;
}

function getCurrentRenderedComponent(
	this: HTMLElement,
	containerSelector: string,
): HTMLElement | undefined {
	const container = this.shadowRoot!.querySelector(containerSelector) ?? this.shadowRoot!;
	return container.querySelector('.page') as HTMLElement | undefined;
}

async function animatePageChange(this: HTMLElement, containerSelector: string): Promise<boolean> {
	// the router only renders one element at a time so we have to wait a bit to animate out on all pages
	const container = this.shadowRoot!.querySelector(containerSelector) ?? this.shadowRoot!;
	const component = container.querySelector('.page') as HTMLElement;
	if (component) {
		component.setAttribute('animation', 'exit');
		await Promise.race([
			new Promise<void>(resolve => {
				component.addEventListener('animationend', (evt: AnimationEvent) => {
					if (evt.animationName.startsWith('Router')) {
						resolve();
					}
				});
			}),
			// shouldn't happen
			new Promise(resolve => {
				setTimeout(resolve, 1000);
			}),
		]);
	}
	return true;
}

function isCurrentUrl(path: string): boolean {
	const { location } = window;
	return new URL(path, location.origin).toString() === location.toString();
}

function parsePath(path: string): { path: string; searchParams?: QueryParams } {
	let url: URL;
	try {
		// We expect path to be a path and not a full URL, but this will prevent this from failing
		// and extract only the path
		url = new URL(path);
	} catch {
		url = new URL(`local:${path}`);
	}
	return {
		path: url.pathname,
		searchParams: url.searchParams ? Object.fromEntries(url.searchParams) : undefined,
	};
}
