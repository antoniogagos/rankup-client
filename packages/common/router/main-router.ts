/// <reference types="urlpattern-polyfill" />
import { BaseRouteConfig, RouteConfig, Router as LitRouter } from '@lit-labs/router';
import type { ReactiveControllerHost } from 'lit';

import RouterStyles from './router-pages-css.js';
import { enterPageCallback } from './utils.js';

if (!('URLPattern' in globalThis)) await import('urlpattern-polyfill');

export { RouterStyles };

/**
 * This router should only be used at top level pages
 */
export function Router(
	host: ReactiveControllerHost & HTMLElement,
	routes: RouteConfig[],
	opts?: {
		containerSelector?: string;
		fallback?: BaseRouteConfig;
	},
) {
	const { containerSelector, ...litRouterOpts } = opts ?? {};
	return new LitRouter(
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
