import '@rankup/samba/overlay/sb-overlay-container.js';
import './pages/home/app-home-page.js';
import './pages/welcome/app-welcome-page.js';

// import './pages/tourney/app-tourney-page.js';
// import './pages/create-tourney/app-create-tourney-page.js';
// import './pages/join-tourney/app-join-tourney-page.js';
import { eventListener } from '@rankup/common/lit-controllers/listeners-controller/decorators/event-listeners.js';
import { Router, RouterStyles } from '@rankup/common/router/main-router.js';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { DataService } from './lib/data-service/data-service.js';
import env from './lib/env/env.js';
import { path } from './lib/url-paths/url-paths.js';
import {
	EventsMap as SessionManagerEvents,
	SessionManager,
} from './managers/session/session-manager.js';

/**
 * @fires session-updated
 */
@customElement('app-shell')
export class AppShell extends LitElement {
	private _router = Router(this, [
		{
			path: '/',
			enter: () => {
				if (this.sessionManager.isLogged) this.redirectToPage('TOURNEYS');
				return !this.sessionManager.isLogged;
			},
			render: () => html`<app-welcome-page class="page" animation="opacity"></app-welcome-page>`,
		},
		{
			path: path('TOURNEYS'),
			render: () => html`<app-home-page class="page" animation="slide"></app-home-page>`,
		},
		{
			path: path('TOURNEY', '*'),
			render: () => html`<app-tourney-page class="page" animation="slide"></app-tourney-page>`,
		},
		{
			path: path('JOIN_TOURNEY'),
			render: () =>
				html`<app-join-tourney-page class="page" animation="slide"></app-join-tourney-page>`,
		},
		{
			path: path('CREATE_TOURNEY'),
			render: () =>
				html`<app-create-tourney-page class="page" animation="slide"></app-create-tourney-page>`,
		},
		{
			path: path('/404'),
			render: () => html`<app-404-page class="page" animation="slide"></app-404-page>`,
		},
		...env.Routes.map(route => ({
			path: route.path,
			enter: async () => import(route.componentPath),
			render: () =>
				unsafeHTML(
					`<${route.componentName} class="page" animation="slide"></${route.componentName}`,
				),
		})),
		// {
		// 	path: '*',
		// 	render: () => null,
		// 	enter: () => {
		// 		this._router.goto(path('TOURNEYS'));
		// 		return false;
		// 	},
		// },
	]);

	ds = new DataService(this);

	sessionManager = new SessionManager(this);

	constructor() {
		super();
		window.rkApp = this;
	}

	@eventListener({ eventName: 'session-updated' })
	_onSessionUpdated(evt: SessionManagerEvents['session-updated']) {
		const { session } = evt.detail;
		this.ds.userId = session?.userId ?? null;
		this.ds.authorizationToken = session?.accessToken ?? null;
		if (session) {
			// test
			this.ds
				.GetUser()
				.then(resp => resp.json())
				.then(data => console.log('getUserResponse', data))
				.catch(error => console.error('getUserResp', error));
		} else {
			this._router.goto('/');
		}
	}

	redirectToPage(pagePath: string, queryParams?: { [key: string]: string | undefined }) {
		let url: string = path(pagePath);
		if (queryParams) {
			url += '?' + new URLSearchParams(queryParams as Record<string, string>).toString();
		}
		this._router.goto(url);
		window.history.replaceState({}, '', url);
	}

	render() {
		return html`${this._router.outlet()}`;
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
	let rkApp: AppShell;

	interface Window {
		rkApp: AppShell;
	}

	interface HTMLElementTagNameMap {
		'rk-app': AppShell;
	}
}
