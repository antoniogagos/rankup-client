export interface RankupJSON {
	/** define pages in public-app or auth-app */
	routes?: Route[];
}

export interface Route {
	/** Path that will render our component */
	baseRoute: string;

	/** If true, the path will be added to the public-app */
	publicPage: boolean;

	/**
	 * Name of the web component to be rendered in baseRoute
	 * It defaults to the same package folder name
	 */
	component?: string;
}
