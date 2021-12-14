export interface AppRouterPage extends HTMLElement {
  onPageEntryTransitionStart?(): void;
  onPageExitTransitionStart?(): void;
}

export interface PageItem {
  elementName: string;
  path: string;
  redirect?: string;
  name?: string;
  src?: string;
  animation?: string;
  animationIn?: string;
  animationOut?: string;
  nextExitAnimation?: string | false;
  nextEntryAnimation?: string | false;
  overlay?: boolean;
  recycle?: boolean;
  attributes?: {
    name: string;
    value: string;
  }[];
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

export type PageCallbacksFn = Function & {
  __path: string;
  __routerIdx: number;
};

export type PageCallbacksList = PageCallbacksFn[];
