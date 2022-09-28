import type { PathRouteConfig } from '@lit-labs/router';

export type Route = RedirectRoute | ComponentRoute | RenderRoute;

export interface BaseRoute extends PathRouteConfig {
	/**
	 * Unique identification for this route.
	 * We generate links using this name, not the path.
	 */
	name?: string;

	/**
	 * Path that will render our component
	 */
	path: string;

	/**
	 * It'll prepend a localization string (/lang-code/) at the beginning of the path
	 * i.e. /en/my-path from /my-path
	 * @default true
	 */
	localize?: boolean;

	/**
	 * Name of the CSS Animation (defined at router-page-css)
	 * @default slide
	 */
	animation?: string;
}

export interface RenderRoute extends BaseRoute {
	render: (params: { [key: string]: string | undefined }) => unknown;
}

export interface ComponentRoute extends BaseRoute {
	/**
	 * Name of the web component to be rendered in this route.
	 */
	componentName: string;

	/**
	 * Path to the component file.
	 * For routes defined at routes.ts, it must be RELATIVE to the package, not the whole repo.
	 */
	componentPath?: string;

	/**
	 * Accessible or not for unauthenticated users
	 */
	publicPage: boolean;

	/**
	 * Displays the main app header on this route
	 * @default false
	 */
	displayHeader?: boolean;

	/**
	 * Displays the main app header on this route
	 * @default false
	 */
	displayFooter?: boolean;
}

export interface RedirectRoute extends BaseRoute {
	/**
	 * Redirect to some other path
	 * Can be the route name (preferred) or the route path.
	 *
	 * Supports named params when the path has it:
	 *
	 * @example
	 *    name: "first-name"
	 *    path: ":id/first-path"
	 *
	 *    path: ":id"
	 *    redirect: "first-name" // the redirect will use the ":id" to compute the redirect to "first-name
	 *
	 *    // using path instead of route-names will also resolve params
	 *    path: ":id"
	 *    redirect: ":id/first-path" // will also use ":id" to compute the redirect
	 */
	redirect: string;
}
