export interface Route {
	/**
	 * Path that will render our component
	 */
	path: string;

	/**
	 * Accessible or not for unauthenticated users
	 */
	publicPage: boolean;

	/**
	 * It'll prepend a localization string (/lang-code/) at the beginning of the path
	 * i.e. /en/my-path from /my-path
	 * @default true
	 */
	localize?: boolean;

	/**
	 * Redirect to some other path
	 */
	redirect?: string;

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

	/**
	 * Name of the web component to be rendered in this route
	 * @default - same package folder name
	 */
	componentName?: string;

	/**
	 * Path to the component file. It must be RELATIVE to the package, not the whole repo
	 * @default `./{packageName}/{componentName}.ts`
	 */
	componentPath?: string;
}

export interface RankupJSON {
	/** define pages in public-app or auth-app */
	routes?: Route[];
}

export type RedirectConditions =
	| 'AUTHENTICATED'
	/**
	 * This should only be necessary if we want to redirect to a different page than the home page,
	 * since setting "publicPage: false" will auto-redirect
	 */
	| 'NOT_AUTHENTICATED';
