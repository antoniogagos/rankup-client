/* eslint-disable max-classes-per-file */
import 'urlpattern-polyfill';

import { Router as LitRouter, Routes as LitRoutes } from '@lit-labs/router';
import type { ReactiveControllerHost } from 'lit';

import AllLocales from '../i18n/locales.json' assert { type: 'json' };
import { languageCodeFromPath, localizePath } from '../i18n/localize.js';
import type { ComponentRoute, RedirectRoute, Route } from './types';

type Params = { [key: string]: string | undefined };

type Host = ReactiveControllerHost & HTMLElement;

type ExtendedLitRouter = new (
	host: Host,
	routes: Array<Route>,
	options?: { containerSelector?: string },
) => LitRoutes & {
	link(pathnameOrName?: string | undefined, params?: Params): string;
	redirect(path: string, params?: Params): boolean;
};

export type EventsMap = {
	/**
	 * Dispatched from the pages container (element matching containerSelector or  host's shadowRoot)
	 * Before the render function is called.
	 */
	'router-page-changed': CustomEvent<{ route: Route; host: Host }>;
	/**
	 * Fired after a redirect has been performed
	 */
	'router-redirect': Event;
};

export default (superClass: typeof LitRoutes): ExtendedLitRouter =>
	class extends superClass {
		private _containerSelector: string;

		protected isMainRouter = false;

		constructor(
			private host: Host,
			public routes: Array<Route>,
			options?: { containerSelector?: string },
		) {
			// fallback not supported ATM, it's the same as '/*'
			super(host, routes, { ...options, fallback: undefined });
			this._containerSelector = options?.containerSelector ?? '#routerContainer';
			this._updateRoutes(routes);
		}

		/**
		 * @param pathnameOrName "name" attribute of the destination Route - it can also be a path
		 * @param params if the destination path has variables (:foo) or catch all (*), replace those with  variables in the obj, including '*'
		 */
		link(pathnameOrName?: string | undefined, params?: Params): string {
			const route = pathnameOrName ? this._findRoute(pathnameOrName) : null;
			if (!route && pathnameOrName && pathnameOrName.charAt(0) !== '/') {
				// should we warn? how can we know that the passed param is intended to be a name instead of path?
				// maybe it's convenient to have 2 methods: linkFromName and linkFromPath
				console.warn(`(router.link) route with name "${pathnameOrName}" not found`);
			}
			const _path = route?.path ?? pathnameOrName;
			const res = super.link(_path ? this._replaceParams(_path, params) : undefined);
			if (this.isMainRouter) {
				return localizePath(res);
			}
			return res;
		}

		/**
		 * @param path can be the "name" attribute of a route
		 * @param params params for the path named params (/bar/:foo/somewhere)
		 * @returns boolean indicating that redirect was NOT performed - so that it can be used
		 * in the "enter" callback to prevent redirection
		 */
		redirect(path: string, params?: Params): boolean {
			const url = pathToURL(path);
			let _path = path;
			const route = this._findRoute(url.pathname);
			if (route) {
				_path = route.path;
				// add search params to the resolved path
				if (url.search) {
					_path += `?${url.searchParams.toString()}`;
				}
			} else {
				// prepend lang code
				// must come from the main router (it's the one that adds the base path)
				const isMainRouter = this instanceof LitRouter;
				const isAlreadyLocalized = AllLocales.includes(languageCodeFromPath(path)!);
				if (isMainRouter && !isAlreadyLocalized) {
					_path = localizePath(_path);
				}
			}
			if (params) {
				_path = this._replaceParams(_path, params);
			}
			if (isCurrentUrl(_path)) {
				return true;
			}
			this.goto(route?.path ?? _path.replace(/\?.*/, '').slice(4));
			window.history.replaceState({}, '', _path);
			window.dispatchEvent(new Event('router-redirect'));
			return false;
		}

		private _updateRoutes(routes: Array<Route>) {
			for (const route of routes) {
				route.enter = this._enterCallback.bind(this, route, route.enter);
				route.render = this._renderCallback.bind(this, route, route.render);
			}
		}

		private _replaceParams(path: string, params?: Params): string {
			if (!params) return path;
			const res = path.replaceAll(
				/:[^\/]*/g,
				(searchValue: string) => params[searchValue.replace(/^:/, '')] ?? '',
			);
			// treat * as a parameter too, to allow replacing * on "/my-route/*" via params
			if (typeof params?.['*'] === 'string') {
				return res.replace(/\*$/, params['*']);
			}
			return res;
		}

		private _findRoute(pathnameOrName: string) {
			const localized = localizePath(pathnameOrName);
			return this.routes.find(
				r => r.name === pathnameOrName || r.path === pathnameOrName || r.path === localized,
			);
		}

		private _computeRedirect(route: RedirectRoute, params?: Params): string {
			const destination = this._findRoute(route.redirect);
			if (destination) {
				return this._replaceParams(destination.path, params);
			}
			return this._replaceParams(route.redirect, params);
		}

		/**
		 * All routes runs this enter callback first, to handle RedirectRoute's, fetching componentPath,
		 * animating, and dispatching page-change events
		 */
		private async _enterCallback(
			route: Route,
			origEnter: Route['enter'],
			params: Params,
		): Promise<boolean> {
			if (isRedirectRoute(route)) {
				const redirect = this._computeRedirect(route, params);
				this.goto(redirect);
				window.history.replaceState({}, '', redirect);
				return false;
			}
			if (typeof origEnter === 'function') {
				const success = await origEnter(params);
				if (success === false) {
					return false;
				}
			}
			const { componentPath, componentName } = route as ComponentRoute;
			if (componentPath) {
				await import(componentPath);
			}
			// Animations are defined by the entry page - this is because the page change animation make
			// sense as a whole, we can't let pages define their entry and exit animations independently)
			if (route.animation && !this._isCurrentlyRenderedComponent(componentName)) {
				await this._animateCurrentPageExit(route.animation);
			}
			return true;
		}

		private _dispatchRoutePageChanged(route: Route): void {
			this._pagesContainer.dispatchEvent(
				new CustomEvent('router-page-changed', {
					detail: { route, host: this.host },
					composed: true,
					bubbles: true,
				}),
			);
		}

		/**
		 * Our router supports fetching + rendering a component from the componentPath & componentName
		 */
		private _renderCallback(route: Route, origRender: Route['render'], params: Params) {
			if (typeof origRender === 'function') {
				// TODO: we don't really know if route changed because render can be called multiple times.
				// Lit router has a _currentRoute prop, but it's private
				this._dispatchRoutePageChanged(route);
				return origRender(params);
			}
			const _route = route as ComponentRoute;
			if (!_route.componentName) {
				console.error('Invalid route', route);
				throw new TypeError('Invalid route');
			}
			const currentElem = this._currentRenderedComponent;
			const isSameAsCurrentElem = currentElem?.localName === _route.componentName;
			if (isSameAsCurrentElem) {
				// render can be called a few times (the router call the currentRoute.render fn on every
				// update) - so we need to avoid recreating the element since we do it manually
				return currentElem;
			}
			const component = document.createElement(_route.componentName);
			component.classList.add('page');
			if (route.animation) {
				const previousPageExists = currentElem && currentElem.localName !== _route.componentName;
				if (previousPageExists) {
					component.toggleAttribute('entry-animation', true);
					component.setAttribute('animation', `${route.animation}Entry`);
				}
			}
			this._dispatchRoutePageChanged(route);
			return component;
		}

		async _whenRouterAnimationEnds(element: HTMLElement): Promise<void> {
			const animationsExist = element.getAnimations().length > 0;
			if (animationsExist) {
				await new Promise<void>(resolve => {
					element.addEventListener(
						'animationend',
						(evt: AnimationEvent) => {
							if (evt.animationName.startsWith('Router')) {
								resolve();
							}
						},
						{ once: true },
					);
				});
			}
		}

		/**
		 * There is a limitation with the Lit Router implementation regarding animations:
		 * the router only renders one element at a time, so we have to first animate out the in
		 */
		private async _animateCurrentPageExit(animation: string): Promise<void> {
			const component = this._pagesContainer.querySelector('.page') as HTMLElement;
			if (component) {
				component.toggleAttribute('entry-animation', false);
				component.toggleAttribute('exit-animation', true);
				component.setAttribute('animation', `${animation}Exit`);
				await this._whenRouterAnimationEnds(component);
			}
		}

		private _isCurrentlyRenderedComponent(componentName: string): boolean {
			return this._currentRenderedComponent?.localName === componentName;
		}

		private get _pagesContainer(): HTMLElement | ShadowRoot {
			return (
				(this.host.shadowRoot!.querySelector(this._containerSelector) as HTMLElement) ??
				this.host.shadowRoot!
			);
		}

		private get _currentRenderedComponent(): HTMLElement | undefined {
			return this._pagesContainer.querySelector('.page') as HTMLElement | undefined;
		}
	};

function isCurrentUrl(path: string): boolean {
	const { location } = window;
	return new URL(path, location.origin).toString() === location.toString();
}

function isRedirectRoute(route: Route): route is RedirectRoute {
	return !!(route as RedirectRoute).redirect?.length;
}

function pathToURL(path: string): URL {
	// let url: URL;
	try {
		// We expect path to be a path and not a full URL, but this will prevent this from failing
		// and extract only the path
		return new URL(path);
	} catch {
		return new URL(`local:${path}`);
	}
	// return {
	// 	path: url.pathname,
	// 	searchParams: url.searchParams ? Object.fromEntries(url.searchParams) : undefined,
	// };
}

declare global {
	interface WindowEventMap {
		'router-redirect': Event;
	}
}
