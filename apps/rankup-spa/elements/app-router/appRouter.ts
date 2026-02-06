import { lazyLoad } from '../../lib/lit-directives/lazy-load-directive.js';
import type { AllEventsMap, EventsMap } from './events.types';
import type { AnimationItem, AppRouterPage, PageCallbacksFn, PageCallbacksList, PageItem } from './types';
import { LitElement } from 'lit';
import Page from 'page/page.mjs';

export type { EventsMap } from './events.types';

const ModuleUrl = import.meta.url;

/**
 * @fires page-changed
 */
export class AppRouter extends HTMLElement {
	/**
	 * Note that with multiple instances of the router, the current page value
	 * will automatically be the most specific, since routes will be create in
	 * order. Also, each app-route will have it's own corresponding "page" value
	 */
	static currentPage: PageItem | null = null;

	static currentRoute: PageJS.Context | null = null;

	exitPage: PageItem | null = null;

	route: PageJS.Context | null = null;

	animations: AnimationItem[] = [];

	overlayContainer: HTMLElement | null = null;

	private _page: PageItem | null = null;

	private _pages: PageItem[] = [];

	private _visible = false;

	private pagejsInstance: PageJS.Static | null = null;

	private entryAnimation: Promise<Animation> | null = null;

	private userPrefersReducedMotion = false;

	private get _overlayContainer() {
		return this.overlayContainer ?? document.querySelector('#overlayContainer') ?? document.body;
	}

	get pages() {
		return this._pages;
	}

	get page() {
		return this._page;
	}

	set page(value) {
		if (this._page !== value) {
			const old = this.page;
			this._page = value;
			this.render();
			this.dispatch('page-changed', {
				page: value,
				oldPage: old,
				route: this.route,
				entryAnimation: this.entryAnimation,
			});
		}
	}

	get pageElement(): AppRouterPage | null {
		const { page } = this;
		return page ? this.getPageElement(page) : null;
	}

	get visible() {
		return this._visible;
	}

	set visible(value) {
		if (typeof value === 'boolean' && value !== this._visible) {
			if (value) {
				this.addEventListener('page-change', this.boundOnPageChanged);
				this.pagejsInstance = Page.create();
				this.installRoutes();
				this.pagejsInstance.start({ popstate: false, click: false });
			} else {
				this.removeEventListener('page-change', this.boundOnPageChanged);
				this.uninstallRoutes();
				this.pagejsInstance?.stop();
				this.pagejsInstance = null;
			}
			this._visible = value;
		}
	}

	/** prefix to all req */
	get base() {
		return this.getAttribute('base') ?? '';
	}

	/** redirect when no route matches */
	get home() {
		return this.getAttribute('home');
	}

	/** redirect / to this path */
	get fallback() {
		return this.getAttribute('fallback');
	}

	get attrPrefix() {
		const prefix = this.getAttribute('attributes-prefix');
		return prefix ? `${prefix}-` : '';
	}

	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.innerHTML = '<slot></slot>';
	}

	connectedCallback() {
		this.updateRoutes();
		// this.hideAllPages();
		this.prefetchPagesWhenIdle();
		registerRouter(this);
		this.userPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Note: with display contents we can't compute isVisible with IObs unless there is content
		// (at start). Can we assume visibility when connected? TESTING
		//
		// this.style.setProperty('display', 'block');
		this.removeNonRecyclablePages();
		// this.observeVisibility();
		this.visible = true;
		if (this.page) {
			this.dispatch('page-changed', {
				page: this.page,
				oldPage: null,
				route: this.route,
			});
		}
	}

	disconnectedCallback() {
		// this.uninstallRoutes();
		// this.unobserveVisibility();
		this.removeEventListener('page-change', this.boundOnPageChanged);
		unregisterRouter(this);
		this.visible = false;
	}

	replacePath(path: string, state?: any) {
		this.pagejsInstance?.replace(path, state);
	}

	navigate(uri: string) {
		this.pagejsInstance?.show(uri);
	}

	handleWindowClick(evt: MouseEvent) {
		this.pagejsInstance?.clickHandler(evt);
	}

	/**
	 * Note that this has to be done in the connectedCallback, not before.
	 * Otherwise we'll mess up with the render fn
	 */
	private removeNonRecyclablePages() {
		for (const child of this.children) {
			if (this.pageHasAttribute(child, 'recycle')) {
				child.remove();
			} else {
				AppRouter.togglePageVisibility(child as AppRouterPage, false);
			}
		}
	}

	private async animatePageIn(page: PageItem, pageElem: AppRouterPage, animation: string | AnimationItem | null) {
		let anim: Animation;
		this.style.setProperty('overflow', 'hidden');
		this.style.setProperty('pointer-events', 'none', 'important');
		try {
			let entryAnim = typeof animation === 'string' ? this.findAnimation(animation) : animation;
			entryAnim ??= this.getPageAnimation(page)[0];
			if (entryAnim) {
				anim = pageElem.animate(entryAnim.keyframeSet, entryAnim.keyframeOptions);
				this.entryAnimation = anim.finished;
				await this.entryAnimation;
			}
		} finally {
			this.entryAnimation = null;
			this.style.removeProperty('overflow');
			this.style.removeProperty('pointer-events');
		}
	}

	private animatePageOut(page: PageItem, pageElem: AppRouterPage, animation: AnimationItem | string | null): Animation | undefined {
		let exitAnim = typeof animation === 'string' ? this.findAnimation(animation) : animation;
		exitAnim ??= this.getPageAnimation(page)[1];
		if (exitAnim) {
			return pageElem.animate(exitAnim.keyframeSet, exitAnim.keyframeOptions);
		}
		return undefined;
	}

	private createPageElem(page: PageItem): AppRouterPage {
		const pageElem = document.createElement(page.elementName);
		const container = page.overlay ? this._overlayContainer : this;
		AppRouter.togglePageVisibility(pageElem, false);
		// pageElem.className = page.className;
		// pageElem.route = this.route;
		for (const { name, value } of page.attributes ?? []) {
			pageElem.setAttribute(name, value);
		}
		if (page.overlay) {
			Object.assign(pageElem.style, {
				position: 'absolute',
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
			});
		}
		container.append(pageElem);
		return pageElem;
	}

	private findAnimation(id: string): AnimationItem | null {
		if (typeof id === 'string') {
			return (
				this.animations?.find(
					anim =>
						anim.id === id ||
						// keyframeOptions can be a number by the spec - the duration
						(anim.keyframeOptions as KeyframeAnimationOptions)?.id === id,
				) ?? null
			);
		}
		return null;
	}

	private getPageAnimation(page: PageItem): [AnimationItem | null, AnimationItem | null] {
		const animationIn = page.animationIn ?? page.animation ?? null;
		const animationOut = page.animationOut ?? page.animation ?? null;
		if (animationIn) {
			return this.getAnimationInOutArray(animationIn, animationOut);
		}
		return [null, null];
	}

	private getPageAttribute(pageElem: Element, attrName: string): string | null {
		return pageElem.getAttribute(this.attrPrefix + attrName);
	}

	private pageHasAttribute(pageElem: Element, attrName: string): boolean {
		return pageElem.hasAttribute(this.attrPrefix + attrName);
	}

	private updateRoutes() {
		const pages: PageItem[] = [];
		for (const child of this.children) {
			const path = this.getPageAttribute(child, 'path');
			if (!path || !/^(\/|\*)/.test(path)) {
				console.error('Router path not found, or is not an absolute path', child);
			} else {
				const isRedirect = child.localName === 'app-router__redirect';
				const redirect = (isRedirect && this.getPageAttribute(child, 'redirect')) || null;
				const src = this.getPageAttribute(child, 'src'); // optional lazy load
				const animation = this.getPageAttribute(child, 'animation') ?? null; // optional
				const animationIn = this.getPageAttribute(child, 'animation-in') ?? null; // optional
				const animationOut = this.getPageAttribute(child, 'animation-out') ?? null; // optional
				const overlay = !!this.getPageAttribute(child, 'overlay');
				const name = this.getPageAttribute(child, 'name'); // optional for id
				const recycle = overlay ? false : !this.pageHasAttribute(child, 'no-recycle');
				const attributes = [...child.attributes].map(({ name: attrName, value }) => ({
					name: attrName,
					value,
				}));
				const pageItem: PageItem = {
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
				};
				pages.push(pageItem);
			}
		}
		this._pages = pages;
	}

	private getAnimationInOutArray(animationIn: AnimationItem | string, animationOut?: AnimationItem | string | null): [AnimationItem | null, AnimationItem | null] {
		const animIn = typeof animationIn === 'string' ? this.findAnimation(animationIn) : animationIn;
		let animOut = typeof animationOut === 'string' ? this.findAnimation(animationOut) : animationOut;
		animOut ??= animIn;
		if (animIn && animIn === animOut) {
			animOut = { ...animIn };
			animOut.keyframeOptions ??= {};
			animOut.keyframeOptions = {
				...(typeof animOut.keyframeOptions === 'number' ? { duration: animOut.keyframeOptions } : animOut.keyframeOptions),
				direction: 'reverse',
			};
		}
		return [animIn, animOut];
	}

	private getPageElement(page: PageItem): AppRouterPage | null {
		return (page.overlay ? this._overlayContainer : this).querySelector(page.elementName);
	}

	// private hideAllPages() {
	//   [...this.children].map(
	//     child => AppRouter.togglePageVisibility(child, false)
	//   );
	// }

	private installRoutes() {
		if (this.base) {
			this.pagejsInstance?.base(this.base);
		}
		if (this.home) {
			this.addRoute({ path: '/', redirect: this.home });
		}
		this.pages?.forEach(page => {
			this.addRoute({
				path: page.path,
				// if defined, "callback" next prop won't be used
				redirect: page.redirect,
				callback: (ctx: PageJS.Context) => {
					this.switchPage(page, ctx);
				},
			});
		});
		if (this.fallback) {
			this.addRoute({ path: '*', redirect: this.fallback });
		}
	}

	private uninstallRoutes() {
		const pageCallbacks: PageCallbacksList = (this.pagejsInstance as any).callbacks;
		if (this.pages)
			for (const page of this.pages) {
				const cb = this.getRouterCallback(page.path);
				if (cb) {
					pageCallbacks.splice(pageCallbacks.indexOf(cb), 1);
				}
			}
	}

	private pageHasAnimation(page: PageItem): boolean {
		const anim = this.getPageAnimation(page);
		return !!(anim[0] || anim[1]);
	}

	private prefetchPagesWhenIdle() {
		if (this.pages)
			for (const page of this.pages) {
				if (page.src) {
					const src = !page.src.endsWith('.js') ? `${page.src}.js` : page.src;
					const link = document.createElement('link');
					link.setAttribute('rel', 'modulepreload');
					link.setAttribute('as', 'script');
					link.setAttribute('href', src);
					document.head.append(link);
				}
			}
	}

	private shouldAnimateEntry(entryPage: PageItem, exitPage?: PageItem | null): boolean {
		if (this.userPrefersReducedMotion) {
			return false;
		}
		const entryAnimationPreventedByExitPage = exitPage?.nextEntryAnimation === false || exitPage?.overlay === true;
		return !!(exitPage && this.pageHasAnimation(entryPage) && !entryAnimationPreventedByExitPage);
	}

	private shouldAnimateExit(entryPage: PageItem, exitPage?: PageItem | null): boolean {
		if (this.userPrefersReducedMotion) {
			return false;
		}
		const exitPageHasAnimation = !!(exitPage && this.pageHasAnimation(exitPage));
		const exitPageAnimationPreventedByEntryPage = entryPage?.nextExitAnimation === false || entryPage?.overlay === true;
		return exitPageHasAnimation && !exitPageAnimationPreventedByEntryPage;
	}

	private switchPage(page: PageItem, ctx: PageJS.Context) {
		const query: { [x: string]: string } = {};
		for (const [key, value] of new URLSearchParams(ctx.querystring).entries()) {
			try {
				query[key] = JSON.parse(value);
			} catch {
				query[key] = value;
			}
		}
		ctx.query = query;
		const samePage = this.page === page;
		const samePath = this.route?.path === ctx.path && this.route?.querystring === ctx.querystring;
		if (samePage && samePath) {
			return;
		}
		AppRouter.currentPage = page;
		AppRouter.currentRoute = ctx;
		this.route = ctx;
		if (samePage) {
			const pageElem = this.getPageElement(page) || this.createPageElem(page);
			AppRouter.togglePageVisibility(pageElem, true);
			this.dispatch('page-changed', {
				page,
				oldPage: page,
				route: ctx,
				entryAnimation: this.entryAnimation,
			});
		} else {
			this.exitPage = this.page;
			this.page = page;
		}
		// Refresh the page containing this app-router instance. In case it uses
		// currentPage/Route. Needed because that's an element that changes routes
		// after it's rendered. If it didn't it could read AppRouter.currentPage and
		// be sure it isn't changed
		const shadowRootNode: ShadowRoot = this.getRootNode?.() as ShadowRoot;
		const litParentElement: LitElement = shadowRootNode?.host as LitElement;
		if (litParentElement?.requestUpdate) {
			requestAnimationFrame(() => litParentElement.requestUpdate());
		}
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
		if (this.page && this.shouldAnimateExit(this.page, this.exitPage)) {
			const { nextExitAnimation } = this.page;
			const anim = nextExitAnimation ? this.findAnimation(nextExitAnimation) || nextExitAnimation : null;
			animFinish = this.animatePageOut(page, pageElem, anim)?.finished;
		}
		await this.entryAnimation;
		await animFinish;
		if (page.recycle) {
			AppRouter.togglePageVisibility(pageElem, false);
		} else {
			pageElem.remove();
		}
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
			const importPath = path.charAt(0) === '/' || path.charAt(0) === '.' ? path : AppRouter.pathRelativeToThisModule(path);
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

	private addRedirect(path: string, redirect: string): void {
		this.pagejsInstance?.(path, (ctx: PageJS.Context): void => {
			// Custom redirect middleware for adding support to redirects with params
			let to = redirect + (ctx.querystring ? `?${ctx.querystring}` : '');
			for (const key of Object.keys(ctx.params)) {
				to = to.replace(new RegExp(`(\\/|^)(:${key})(\\/|$)`), `$1${ctx.params[key]}$3`);
			}
			if (this.pagejsInstance?.current !== to) {
				this.pagejsInstance?.replace(to);
			}
		});
	}

	private addRoute({ path, callback, redirect }: { path: string; redirect?: string | null; callback?: PageJS.Callback | null }): void {
		const pageCallbacks: PageCallbacksList = (this.pagejsInstance as any).callbacks;
		if (this.getRouterCallback(path)) {
			console.warn(`Route ${path} duplicated`);
		} else {
			if (redirect) {
				this.addRedirect(path, redirect);
			} else if (callback) {
				// TODO don't leverage Page for matching paths, create a middleware
				// so that we can add more stuff. Mainly params/multiple-path
				this.pagejsInstance?.(path, callback);
			}
			const pageCb = pageCallbacks[pageCallbacks.length - 1];
			pageCb.__path = path;
		}
	}

	private boundOnPageChanged = this.onPageChange.bind(this);

	private onPageChange(evt: EventsMap['page-change']) {
		evt.stopPropagation();
		if (evt.detail.path !== window.history.state.path) {
			// TODO optional params + serialize?
			this.pagejsInstance?.(evt.detail.path);
		}
	}

	private getRouterCallback(path: string): PageCallbacksFn | undefined {
		const pageCallbacks: PageCallbacksList = (this.pagejsInstance as any).callbacks;
		return pageCallbacks.find(cb => cb.__path === path);
	}

	static commonStart(strings: string[]): string {
		const A = [...strings].sort();
		const a1 = A[0];
		const a2 = A[A.length - 1];
		const L = a1.length;
		let i = 0;
		while (i < L && a1.charAt(i) === a2.charAt(i)) i += 1;
		return a1.slice(0, Math.max(0, i));
	}

	static pathRelativeToThisModule(path: string): string {
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

	static togglePageVisibility(pageElem: AppRouterPage, visible: boolean) {
		// pageElem.style.display = visible ? '' : 'none';
		pageElem.toggleAttribute('hidden', !visible);
		if ('hidden' in pageElem) {
			const element = pageElem as AppRouterPage;
			element.hidden = !visible;
		}
		const maybeLit = pageElem as unknown as {
			requestUpdate?: () => void;
			shadowRoot?: ShadowRoot | null;
		};
		if (typeof maybeLit.requestUpdate === 'function') {
			maybeLit.requestUpdate();
		}
		const nestedRouter = maybeLit.shadowRoot?.querySelector('app-router') as (AppRouter & { visible?: boolean }) | null;
		if (nestedRouter && 'visible' in nestedRouter) {
			nestedRouter.visible = visible;
		}
	}

	// ---- Typed listeners

	private dispatch<EventName extends keyof EventsMap>(eventName: EventName, detail: EventsMap[EventName]['detail']) {
		const params = { bubbles: true, composed: true, detail };
		const evt = new CustomEvent(eventName, params);
		this.dispatchEvent(evt);
	}

	public override addEventListener<T extends keyof AllEventsMap>(type: T, listener: (this: AppRouter, ev: AllEventsMap[T]) => any, options?: boolean | AddEventListenerOptions): void;

	public override addEventListener(type: string, listener: (this: AppRouter, ev: Event) => any, options?: boolean | AddEventListenerOptions): void {
		super.addEventListener(type, listener, options);
	}

	public override removeEventListener<T extends keyof AllEventsMap>(type: T, listener: (this: AppRouter, ev: AllEventsMap[T]) => any, options?: boolean | EventListenerOptions): void;

	public override removeEventListener(type: string, listener: (this: AppRouter, ev: Event) => any, options?: boolean | EventListenerOptions): void {
		super.removeEventListener(type, listener, options);
	}
}

const Routers: Set<AppRouter> = new Set();
const clickEvent = document.ontouchstart ? 'touchstart' : 'click';

document.addEventListener(clickEvent as 'click', evt => {
	const routers = [...Routers];
	for (let idx = routers.length - 1; idx >= 0; idx -= 1) {
		const router = routers[idx];
		router.handleWindowClick(evt);
	}
});

/**
 * For multiple routing support, we need to prevent multiple routers from acting on a popstate
 */
window.addEventListener(
	'popstate',
	evt => {
		const routers = [...Routers];
		for (let idx = routers.length - 1; idx >= 0; idx -= 1) {
			const router = routers[idx];
			const path: string = evt.state?.path || window.location.pathname;
			if (path.startsWith(router.base)) {
				if (evt.state) {
					router.replacePath(path, evt.state);
				} else {
					const { pathname, search, hash } = window.location;
					router.navigate(pathname + search + hash);
				}
			}
		}
	},
	false,
);

function unregisterRouter(router: AppRouter) {
	Routers.delete(router);
}

function registerRouter(router: AppRouter) {
	Routers.add(router);
}
