import './pages/welcome/rk-welcome-page.js';
import './pages/access/rk-forgot-password-page.js';
import './pages/access/rk-reset-password-page.js';
import './pages/access/rk-sign-in-page.js';
import './pages/access/rk-sign-up-page.js';
import './pages/access/rk-confirm-registration-page.js';
import './pages/404/rk-404-page.js';

import { Router, RouterStyles } from 'common/router/main-router.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import ScrollbarStyles from 'samba/styles/scrollbar-css.js';

import env from './lib/env/env.js';
import { path, PublicPaths } from './lib/url-paths/url-paths.js';
import { SessionManager } from './managers/session/session-manager.js';

@customElement('rk-unauthenticated-app')
export class RkUnauthenticatedApp extends LitElement {
	private enterPageCallback = async (): Promise<boolean> => {
		// the router only renders one element at a time so we have to wait a bit to animate out on all pages
		this.shadowRoot!.firstElementChild?.setAttribute('animation', 'exit');
		await new Promise(resolve => {
			setTimeout(resolve, 140);
		});
		return true;
	};

	router = Router(this, [
		{
			path: '/',
			enter: this.enterPageCallback,
			render: () => html`<rk-welcome-page class="page" animation="opacity"></rk-welcome-page>`,
		},
		{
			path: path('SIGN_IN'),
			enter: this.enterPageCallback,
			render: () => html`<rk-sign-in-page class="page" animation="slide"></rk-sign-in-page>`,
		},
		{
			path: path('SIGN_UP'),
			enter: this.enterPageCallback,
			render: () => html`<rk-sign-up-page class="page" animation="slide"></rk-sign-up-page>`,
		},
		{
			path: path('RESET_PASSWORD'),
			enter: this.enterPageCallback,
			render: () =>
				html`<rk-reset-password-page class="page" animation="slide"></rk-reset-password-page>`,
		},
		{
			path: path('FORGOT_PASSWORD'),
			enter: this.enterPageCallback,
			render: () =>
				html`<rk-forgot-password-page class="page" animation="slide"></rk-forgot-password-page>`,
		},
		{
			path: path('CONFIRM_REGISTRATION'),
			enter: this.enterPageCallback,
			render: () =>
				html`<rk-confirm-registration-page
					class="page"
					animation="slide"></rk-confirm-registration-page>`,
		},
		...env.Routes.filter(route => route.publicPage).map(route => ({
			path: path(route.baseRoute, '*'),
			enter: async () => import('/node_modules/' + route.path),
			render: () =>
				unsafeHTML(`<${route.component} class="page" animation="slide"></${route.component}`),
		})),
		{
			path: path('/404'),
			enter: this.enterPageCallback,
			render: () => html`<rk-404-page class="page" animation="opacity"></rk-404-page>`,
		},
		{
			path: path('/oauth'),
			enter: () => {
				this.redirectToPage('SIGN_IN');
				return false;
			},
		},
		{
			path: 'oauth',
			enter: params => {
				console.log('redirect', { params });
				this.redirectToPage('SIGN_IN', params);
				return false;
			},
		},
		{
			path: '*',
			enter: () => {
				this.redirectToPage('404');
				return false;
			},
		},
	]);

	sessionManager?: SessionManager;

	constructor() {
		super();
		window.rkPublicApp = this;
	}

	connectedCallback(): void {
		super.connectedCallback?.();
		this.sessionManager = new SessionManager(this);
	}

	disconnectedCallback(): void {
		super.disconnectedCallback?.();
		if (this.sessionManager) {
			this.removeController(this.sessionManager);
			this.sessionManager = undefined;
		}
	}

	redirectToPage(
		pagePath: keyof typeof PublicPaths | string,
		queryParams?: { [key: string]: string | undefined },
	) {
		let url: string = path(pagePath);
		if (queryParams) {
			url += '?' + new URLSearchParams(queryParams as Record<string, string>).toString();
		}
		this.router.goto(url);
		window.history.replaceState({}, '', url);
	}

	render() {
		return html`${this.router.outlet()}`;
	}

	static styles = [
		RouterStyles,
		ScrollbarStyles,
		css`
			:host {
				display: contents;
			}

			@supports not (display: contents) {
				:host {
					display: block;
					height: 100%;
				}
			}
		`,
	];
}

declare global {
	let rkPublicApp: RkUnauthenticatedApp;

	interface Window {
		rkPublicApp: RkUnauthenticatedApp;
	}

	interface HTMLElementTagNameMap {
		'rk-unauthenticated-app': RkUnauthenticatedApp;
	}
}
