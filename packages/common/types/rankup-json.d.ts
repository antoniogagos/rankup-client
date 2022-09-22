export interface RankupJSON {
	/** define pages in public-app or auth-app */
	routes?: Route[];
}

export interface Route {
	/** Path that will render our component */
	path: string;

	/** If true, the path will be added to the public-app */
	publicPage: boolean;

	/**
	 * Name of the web component to be rendered in this route
	 * It defaults to the same package folder name
	 */
	componentName?: string;

	/**
	 * Path to the component file. It must be RELATIVE to the package, not the whole repo
	 * It defaults to `./{package}/{componentName}.ts`
	 */
	componentPath?: string;
}
