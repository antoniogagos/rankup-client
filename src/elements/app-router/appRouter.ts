import { LitElement } from 'lit';
import Page from 'page';
import { lazyLoad } from '../../lib/lit-directives/lazy-load-directive.js';
import type { AllEventsMap, EventsMap } from './events.types';
import type {
  AnimationItem,
  Route,
  AppRouterPage,
  PageItem,
  PageCallbacksFn,
  PageCallbacksList,
} from './types';

let _totalRoutersInstalled = 0;
const ModuleUrl = import.meta.url;

export class AppRouter extends HTMLElement {
  static navigate(path: string) {
    Page(path);
  }

  /**
   * Note that with multiple instances of the router, the current page value
   * will automatically be the most specific, since routes will be create in
   * order. Also, each app-route will have it's own corresponding "page" value
   */
  static currentPage: PageItem | null = null;

  static currentRoute: Route | null = null;

  exitPage: PageItem | null = null;

  route: Route | null = null;

  get pages() {
    return this._pages;
  }

  get page() {
    return this._page;
  }

  set page(value) {
    if (this.page !== value) {
      const old = this.page;
      this.page = value;
      this.render();
      this.dispatch('page-changed', {
        page: value,
        oldPage: old,
        route: this.route,
        entryAnimation: this.entryAnimation,
      });
    }
  }

  get pageElement() {
    const { page } = this;
    return page ? this.getPageElement(page) : null;
  }

  get visible() {
    return this._visible;
  }

  set visible(value) {
    if (typeof value === 'boolean' && value !== this.visible) {
      if (value) {
        this.installRoutes();
        Page();
      } else {
        this.uninstallRoutes();
      }
      this.visible = value;
    }
  }

  /** prefix to all req */
  get base() {
    return this.getAttribute('base');
  }

  /** redirect when no route matches */
  get home() {
    return this.getAttribute('home');
  }

  /** redirect / to this path */
  get fallback() {
    return this.getAttribute('fallback');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = '<slot></slot>';
    this.updateRoutes();
    // this.hideAllPages();
    this.prefetchPagesWhenIdle();
  }

  animations: AnimationItem[] = [];

  overlayContainer: HTMLElement | null = null;

  private _page: PageItem | null = null;

  private _pages: PageItem[] = [];

  private _visible = false;

  private entryAnimation: Promise<Animation> | null = null;

  private userPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private visibilityObserver: IntersectionObserver | null = null;

  private get _overlayContainer() {
    return this.overlayContainer ?? document.querySelector('#overlayContainer') ?? document.body;
  }

  connectedCallback() {
    this.style.setProperty('display', 'block');
    this.removeNonRecyclablePages();
    this.observeVisibility();
    // TODO some other way to get anims?
    // this.animations = this.getRootNode().host?.constructor.animations;
    this.addEventListener('page-change', AppRouter.onPageChange);
    if (this.page) {
      this.dispatch('page-changed', {
        page: this.page,
        oldPage: null,
        route: this.route,
      });
    }
  }

  disconnectedCallback() {
    this.uninstallRoutes();
    this.unobserveVisibility();
    this.removeEventListener('page-change', AppRouter.onPageChange);
  }

  /**
   * Note that this has to be done in the connectedCallback, not before.
   * Otherwise we'll mess up with the render fn
   */
  private removeNonRecyclablePages() {
    [...this.children].forEach(child => {
      // if ((child.style.display === 'none') &&
      //     (child.hasAttribute('overlay') || child.hasAttribute('no-recycle'))) {
      // if (child.style.display === 'none') {
      if (child.hasAttribute('recycle')) {
        child.remove();
      } else {
        child.toggleAttribute('hidden', true);
      }
      // }
    });
  }

  private observeVisibility() {
    if ('IntersectionObserver' in window) {
      this.visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          this._visible = entry.isIntersecting;
        },
        { rootMargin: '0px' },
      );
      /**
       * If we set app-router with display: contents then we can't use it to detect visibility
       * We need to detect visibility so we can enable/disable the router
       *
      let elem = this;
      let display = window.getComputedStyle(this).display;
      while (display === 'contents' && elem) {
        elem = elem.parentElement || elem.getRootNode().host || elem.getRootNode();
        display = window.getComputedStyle(elem).display;
      }
      */
      this.visibilityObserver.observe(this);
    }
  }

  private unobserveVisibility() {
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = null;
  }

  static onPageChange(evt: EventsMap['page-change']) {
    evt.stopPropagation();
    if (evt.detail.path !== window.history.state.path) {
      // TODO optional params + serialize?
      Page(evt.detail.path);
    }
  }

  private async animatePageIn(
    page: PageItem,
    pageElem: AppRouterPage,
    animation: string | AnimationItem,
  ) {
    /** @type {Animation} */
    let anim;
    this.style.setProperty('overflow', 'hidden');
    this.style.setProperty('pointer-events', 'none', 'important');
    try {
      let entryAnim = typeof animation === 'string' ? this.findAnimation(animation) : animation;
      entryAnim ??= this.getPageAnimation(page)[0];
      anim = pageElem.animate(entryAnim.keyframeSet, entryAnim.keyframeOptions);
      this.entryAnimation = anim.finished;
      await this.entryAnimation;
    } finally {
      this.entryAnimation = null;
      this.style.removeProperty('overflow');
      this.style.removeProperty('pointer-events');
    }
  }

  private animatePageOut(
    page: PageItem,
    pageElem: AppRouterPage,
    animation: AnimationItem | string,
  ): Animation {
    let exitAnim = typeof animation === 'string' ? this.findAnimation(animation) : animation;
    exitAnim ??= this.getPageAnimation(page)[1];
    return pageElem.animate(exitAnim.keyframeSet, exitAnim.keyframeOptions);
  }

  static commonStart(strings: string[]) {
    const A = strings.concat().sort();
    const a1 = A[0];
    const a2 = A[A.length - 1];
    const L = a1.length;
    let i = 0;
    while (i < L && a1.charAt(i) === a2.charAt(i)) i += 1;
    return a1.substring(0, i);
  }

  private createPageElem(page: PageItem): AppRouterPage {
    const pageElem = document.createElement(page.elementName);
    const container = page.overlay ? this._overlayContainer : this;
    AppRouter.togglePageVisibility(pageElem, false);
    // console.log('cratePage', pageElem);
    // pageElem.className = page.className;
    // pageElem.route = this.route;
    page.attributes.forEach(({ name, value }) => pageElem.setAttribute(name, value));
    if (page.overlay) {
      Object.assign(pageElem.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      });
    }
    container.appendChild(pageElem);
    return pageElem;
  }

  private findAnimation(id: string): AnimationItem | null {
    if (typeof id === 'string') {
      return this.animations?.find(
        anim =>
          anim.id === id ||
          // keyframeOptions can be a number by the spec - the duration
          (anim.keyframeOptions as KeyframeAnimationOptions)?.id === id,
      );
    }
    return null;
  }

  private getPageAnimation(page: PageItem): [AnimationItem | null, AnimationItem | null] {
    const animationIn = page.animationIn ?? page.animation ?? null;
    const animationOut = page.animationOut ?? page.animation ?? null;
    return this.getAnimationInOutArray(animationIn, animationOut);
  }

  private updateRoutes() {
    const pages: PageItem[] = [];
    [...this.children].forEach(child => {
      const path = child.getAttribute('path');
      if (!path) {
        console.error('Router.NoPathFound', child);
        return;
      }
      const isRedirect = child.localName === 'app-router-redirect';
      const redirect = (isRedirect && child.getAttribute('redirect')) || null;
      const src = child.getAttribute('src'); // optional lazy load
      const animation = child.getAttribute('animation') ?? null; // optional
      const animationIn = child.getAttribute('animation-in') ?? null; // optional
      const animationOut = child.getAttribute('animation-out') ?? null; // optional
      const overlay = child.hasAttribute('overlay') ?? false; // optional
      const name = child.getAttribute('name'); // optional for id
      const recycle = overlay ? false : !child.hasAttribute('no-recycle');
      const attributes = [...child.attributes].map(({ name: attrName, value }) => ({
        name: attrName,
        value,
      }));
      pages.push({
        redirect,
        elementName: child.localName,
        attributes,
        name,
        path,
        fullPath: (this.base + path).replace(/\/\/+/, '/'),
        src,
        animation,
        animationIn,
        animationOut,
        overlay,
        recycle,
      } as PageItem);
    });
    this._pages = pages;
  }

  private getAnimationInOutArray(
    animationIn: AnimationItem | string,
    animationOut?: AnimationItem | string,
  ): [AnimationItem | null, AnimationItem | null] {
    const animIn = typeof animationIn === 'string' ? this.findAnimation(animationIn) : animationIn;
    let animOut =
      typeof animationOut === 'string' ? this.findAnimation(animationOut) : animationOut;
    animOut ??= animIn;
    if (animIn && animIn === animOut) {
      animOut = { ...animIn };
      animOut.keyframeOptions ??= {};
      animOut.keyframeOptions = {
        ...(typeof animOut.keyframeOptions === 'number'
          ? { duration: animOut.keyframeOptions }
          : animOut.keyframeOptions),
        ...{ direction: 'reverse' },
      };
    }
    return [animIn, animOut];
  }

  private getPageElement(page: PageItem): AppRouterPage | null {
    return (page.overlay ? this._overlayContainer : this).querySelector(page.elementName);
  }

  // #hideAllPages() {
  //   [...this.children].map(
  //     child => AppRouter.togglePageVisibility(child, false)
  //   );
  // }

  private installRoutes() {
    const pageCallbacks: PageCallbacksList = (Page as any).callbacks;
    const totalRoutesBefore = pageCallbacks.length;
    if (this.base) {
      if (_totalRoutersInstalled === 0) {
        Page.base(this.base);
      } else {
        console.warn(
          "app-router 'base' attribute only works in the main router and it's global for all routers",
        );
      }
    }
    if (this.home) {
      AppRouter.addRoute({ path: '/', redirect: this.home });
    }
    this.pages?.forEach(page => {
      AppRouter.addRoute({
        path: page.path,
        // if defined, "callback" next prop won't be used
        redirect: page.redirect,
        callback: (ctx: PageJS.Context, next: () => void) => this.switchPage(page, ctx),
      });
    });
    if (this.fallback) {
      AppRouter.addRoute({ path: '*', redirect: this.fallback });
    }
    if (pageCallbacks.length > totalRoutesBefore) {
      _totalRoutersInstalled += 1;
    }
  }

  static addRedirect(path: string, redirect: string): void {
    Page(path, (ctx: PageJS.Context): void => {
      // Custom redirect middleware for adding support to redirects with params
      let to = redirect;
      Object.keys(ctx.params).forEach(key => {
        to = to.replace(new RegExp(`(\\/|^)(:${key})(\\/|$)`), `$1${ctx.params[key]}$3`);
      });
      if (Page.current !== to) {
        Page.replace(to);
      }
    });
  }

  static addRoute({
    path,
    callback,
    redirect,
  }: {
    path: string;
    redirect?: string;
    callback?: any;
  }) {
    const routerIdx = _totalRoutersInstalled;
    const pageCallbacks: PageCallbacksList = (Page as any).callbacks;
    if (AppRouter.getRouterCallback(path)) {
      console.warn(`Route ${path} duplicated`);
    } else {
      if (redirect) {
        AppRouter.addRedirect(path, redirect);
      } else {
        // TODO don't leverage Page for matching paths, create a middleware
        // so that we can add more stuff. Mainly params/multiple-path
        Page(path, callback);
      }
      const pageCb = pageCallbacks[pageCallbacks.length - 1];
      /**
       * Pagejs doesn't have anything for nested routes.
       * We can support them by moving nested routes to the top of the
       * callbacks chain.
       * That is because routes are considered in order, and nested routes are
       * more specific than upper routes.
       */
      const prepend = routerIdx > 0;
      if (prepend) {
        let idx = pageCallbacks.findIndex(
          // insert before any previous router but after any middleware
          // (middlewares won't have a "__routerIdx" prop)
          cb => cb !== pageCb && cb.__routerIdx != null && cb.__routerIdx <= routerIdx,
        );
        if (idx === -1) idx = 0;
        const lastCb = pageCallbacks.pop();
        if (lastCb) {
          pageCallbacks.splice(idx, 0, lastCb);
        }
      }
      pageCb.__path = path;
      pageCb.__routerIdx = routerIdx;
    }
  }

  static getRouterCallback(path: string): PageCallbacksFn | undefined {
    const pageCallbacks: PageCallbacksList = (Page as any).callbacks;
    return pageCallbacks.find(cb => cb.__path === path);
  }

  private uninstallRoutes() {
    const pageCallbacks: PageCallbacksList = (Page as any).callbacks;
    let uninstalled = false;
    this.pages?.forEach(page => {
      const cb = AppRouter.getRouterCallback(page.path);
      if (cb) {
        uninstalled = true;
        pageCallbacks.splice(pageCallbacks.indexOf(cb), 1);
      }
    });
    if (uninstalled) {
      _totalRoutersInstalled -= 1;
    }
  }

  private pageHasAnimation(page: PageItem): boolean {
    const anim = this.getPageAnimation(page);
    return !!(anim[0] || anim[1]);
  }

  static pathRelativeToThisModule(path: string) {
    if (path.charAt(0) === '/') {
      const docBase = window.location.origin;
      const modulePath = ModuleUrl.replace(docBase, '');
      const commonStart = AppRouter.commonStart([modulePath, path]);
      const back = path.slice(0, commonStart.length).split('/').length - 1;
      const nav = new Array(back).fill('../').join('') || './';
      // console.log({path, docBase, modulePath, moduleUrl, commonStart});
      return nav + path.slice(1);
    }
    return path;
  }

  private prefetchPagesWhenIdle() {
    this.pages?.forEach(page => {
      if (page.src) {
        const src = !page.src.endsWith('.js') ? `${page.src}.js` : page.src;
        const link = document.createElement('link');
        link.setAttribute('rel', 'modulepreload');
        link.setAttribute('as', 'script');
        link.setAttribute('href', src);
        document.head.appendChild(link);
      }
    });
  }

  private shouldAnimateEntry(entryPage: PageItem, exitPage?: PageItem): boolean {
    if (this.userPrefersReducedMotion) {
      return false;
    }
    const entryAnimationPreventedByExitPage =
      exitPage?.nextEntryAnimation === false || exitPage?.overlay === true;
    return !!(exitPage && this.pageHasAnimation(entryPage) && !entryAnimationPreventedByExitPage);
  }

  private shouldAnimateExit(entryPage: PageItem, exitPage?: PageItem): boolean {
    if (this.userPrefersReducedMotion) {
      return false;
    }
    const exitPageHasAnimation: boolean = !!(exitPage && this.pageHasAnimation(exitPage));
    const exitPageAnimationPreventedByEntryPage =
      entryPage?.nextExitAnimation === false || entryPage?.overlay === true;
    return exitPageHasAnimation && !exitPageAnimationPreventedByEntryPage;
  }

  private switchPage(page: PageItem, ctx: any) {
    const query: { [x: string]: string } = {};
    new URLSearchParams(ctx.querystring).forEach((value, key) => {
      try {
        query[key] = JSON.parse(value);
      } catch (e) {
        query[key] = value;
      }
    });
    ctx.query = query;
    AppRouter.currentPage = page;
    AppRouter.currentRoute = ctx;
    this.exitPage = this.page;
    this.route = ctx;
    this.page = page;
    // Refresh the page containing this app-router instance. In case it uses
    // currentPage/Route. Needed because that's an element that changes routes
    // after it's rendered. If it didn't it could read AppRouter.currentPage and
    // be sure it isn't changed
    const shadowRootNode: ShadowRoot = this.getRootNode?.() as ShadowRoot;
    if (shadowRootNode) {
      const litParentElement: LitElement = shadowRootNode.host as LitElement;
      litParentElement?.requestUpdate?.();
    }
  }

  static togglePageVisibility(pageElem: AppRouterPage, visible: boolean) {
    // pageElem.style.display = visible ? '' : 'none';
    pageElem.toggleAttribute('hidden', !visible);
  }

  private renderEntry(page: PageItem, pageElem: AppRouterPage) {
    AppRouter.togglePageVisibility(pageElem, true);
    pageElem.onPageEntryTransitionStart?.();
    if (this.shouldAnimateEntry(page, this.exitPage)) {
      const nextEntryAnimation = this.exitPage?.nextEntryAnimation;
      const anim = nextEntryAnimation
        ? this.getAnimationInOutArray(nextEntryAnimation)[1] // take the out
        : null;
      this.animatePageIn(page, pageElem, anim);
    }
  }

  private async renderExit(page: PageItem, pageElem: AppRouterPage) {
    pageElem.onPageExitTransitionStart?.();
    let animFinish = null;
    if (this.shouldAnimateExit(this.page, this.exitPage)) {
      const { nextExitAnimation } = this.page;
      const anim = nextExitAnimation
        ? this.findAnimation(nextExitAnimation) || nextExitAnimation
        : null;
      animFinish = this.animatePageOut(page, pageElem, anim).finished;
    }
    await this.entryAnimation;
    await animFinish;
    if (page.recycle) {
      AppRouter.togglePageVisibility(pageElem, false);
    }
    pageElem.remove();
  }

  private renderPage(page: PageItem, params?: object) {
    const isEntryPage = !this.page || page === this.page;
    const isExitPage = this.exitPage === page;
    const pageElem = this.getPageElement(page) || this.createPageElem(page);
    if (typeof params === 'object') {
      Object.assign(pageElem, params);
    }
    if (isEntryPage) {
      this.renderEntry(page, pageElem);
    } else if (isExitPage) {
      this.renderExit(page, pageElem);
    }
    const needLazyLoad = !!page.src;
    if (needLazyLoad && page.src) {
      let path = page.src;
      if (!path.endsWith('.js')) {
        path += '.js';
      }
      const importPath =
        path.charAt(0) === '/' || path.charAt(0) === '.'
          ? path
          : AppRouter.pathRelativeToThisModule(path);
      // const relativePath = AppRouter.pathRelativeToThisModule(path);
      return lazyLoad(import(importPath), pageElem);
    }
    return pageElem;
  }

  private render(params?: object) {
    const entryPage = this.page;
    if (entryPage) {
      const { exitPage } = this;
      this.renderPage(entryPage, params);
      if (exitPage) {
        this.renderPage(exitPage, params);
      }
    }
  }

  // ---- Typed listeners

  private dispatch<EventName extends keyof EventsMap>(
    eventName: EventName,
    detail: EventsMap[EventName]['detail'],
  ) {
    const params = { bubbles: true, composed: true, detail };
    const evt = new CustomEvent(eventName, params);
    this.dispatchEvent(evt);
  }

  public addEventListener<T extends keyof AllEventsMap>(
    type: T,
    listener: (this: AppRouter, ev: AllEventsMap[T]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  public addEventListener(
    type: string,
    listener: (this: AppRouter, ev: Event) => any,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, listener, options);
  }

  public removeEventListener<T extends keyof AllEventsMap>(
    type: T,
    listener: (this: AppRouter, ev: AllEventsMap[T]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  public removeEventListener(
    type: string,
    listener: (this: AppRouter, ev: Event) => any,
    options?: boolean | EventListenerOptions,
  ): void {
    super.addEventListener(type, listener, options);
  }
}
