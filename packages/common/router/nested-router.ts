/// <reference types="urlpattern-polyfill" />
import { BaseRouteConfig, RouteConfig, Routes as LitRoutes } from '@lit-labs/router';
import type { ReactiveControllerHost } from 'lit';

import RouterStyles from './router-pages-css.js';
import { enterPageCallback } from './utils.js';

if (!('URLPattern' in globalThis)) await import('urlpattern-polyfill');

export { RouterStyles };

export function Router(
	host: ReactiveControllerHost & HTMLElement,
	routes: RouteConfig[],
	opts?: {
		containerSelector?: string;
		fallback?: BaseRouteConfig;
	},
) {
	const { containerSelector, ...litRouterOpts } = opts ?? {};
	return new LitRoutes(
		host,
		routes.map(route => ({
			...route,
			async enter(params) {
				await enterPageCallback.call(host, containerSelector);
				return (await route.enter?.(params)) ?? true;
			},
		})),
		litRouterOpts,
	);
}
