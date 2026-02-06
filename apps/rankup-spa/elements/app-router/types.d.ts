export interface AppRouterPage extends HTMLElement {
	onPageEntryTransitionStart?(): void;
	onPageExitTransitionStart?(): void;
}

export interface PageItem {
	elementName: string;
	path: string;
	fullPath: string;
	redirect?: string | null;
	name?: string | null;
	src?: string | null;
	animation?: string | null;
	animationIn?: string | null;
	animationOut?: string | null;
	nextExitAnimation?: string | false | null;
	nextEntryAnimation?: string | false | null;
	overlay?: boolean | null;
	recycle?: boolean | null;
	attributes?:
		| {
				name: string;
				value: string;
		  }[]
		| null;
}

export interface AnimationItem {
	id?: string;
	keyframeSet: Keyframe[] | PropertyIndexedKeyframes;
	keyframeOptions: number | KeyframeAnimationOptions;
}

export interface Route {
	canonicalPath: string;
	hash: string;
	init: boolean;
	page: PageJS.Static;
	params: {
		[x: string]: string;
	};
	path: string;
	pathname: string;
	query: {
		[x: string]: string;
	};
	querystring: string;
	routePath: string;
	state: {
		[x: string]: string;
	};
	title: string;
}

export type PageCallbacksFn = (() => void) & {
	__path: string;
};

export type PageCallbacksList = PageCallbacksFn[];
