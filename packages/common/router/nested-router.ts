import { BaseRouteConfig, PathRouteConfig, Routes as LitRoutes } from '@lit-labs/router';
import type { ReactiveControllerHost } from 'lit';

import RouterStyles from './router-pages-css.js';
import { enterPageCallback } from './utils.js';

// if (!('URLPattern' in globalThis)) await import('urlpattern-polyfill');

export { RouterStyles };

export function Router(
	host: ReactiveControllerHost & HTMLElement,
	routes: PathRouteConfig[],
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
			// NOTE: paths for nested rules can't start on '/'
			path: route.path.startsWith('/') ? route.path.slice(1) : route.path,
			async enter(params) {
				const enterPromise = route.enter?.(params);
				await enterPageCallback.call(host, containerSelector);
				return (await enterPromise) ?? true;
			},
		})),
		litRouterOpts,
	);
}
