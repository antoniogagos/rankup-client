import 'samba/overlay/sb-overlay-container.js';
import './pages/home/rk-home-page.js';
import './pages/tourney/rk-tourney-page.js';
import './pages/create-tourney/rk-create-tourney-page.js';
import './pages/join-tourney/rk-join-tourney-page.js';

import { Router, RouterStyles } from 'common/router/main-router.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import ScrollbarStyles from 'samba/styles/scrollbar-css.js';

import { DataService } from './lib/data-service/data-service.js';
import env from './lib/env/env.js';
import { path } from './lib/url-paths/url-paths.js';
import { SessionManager } from './managers/session/session-manager.js';

/**
 * @fires session-updated
 */
@customElement('rk-app')
export class RkApp extends LitElement {
	private _router = Router(this, [
		/**
		 * añadir a este array { path: path('/' + game + '/*')}
		 */
		{
			path: path('TOURNEYS'),
			render: () => html`<rk-home-page class="page" animation="slide"></rk-home-page>`,
		},
		{
			path: path('TOURNEY', '*'),
			render: () => html`<rk-tourney-page class="page" animation="slide"></rk-tourney-page>`,
		},
		{
			path: path('JOIN_TOURNEY'),
			render: () =>
				html`<rk-join-tourney-page class="page" animation="slide"></rk-join-tourney-page>`,
		},
		{
			path: path('CREATE_TOURNEY'),
			render: () =>
				html`<rk-create-tourney-page class="page" animation="slide"></rk-create-tourney-page>`,
		},
		{
			path: '/404',
			render: () => html`<rk-404-page class="page" animation="slide"></rk-404-page>`,
		},
		{
			path: '*',
			render: () => null,
			enter: () => {
				this._router.goto(path('TOURNEYS'));
				return false;
			},
		},
		...env.Routes.map(route => ({
			path: route.baseRoute + '/*',
			enter: async () => import(route.path),
			render: () =>
				unsafeHTML(`<${route.component} class="page" animation="slide"></${route.component}`),
		})),
	]);

	ds = new DataService(this);

	sessionManager = new SessionManager(this);

	constructor() {
		super();
		window.rkApp = this;
		this.addEventListener('session-updated', this._onSessionUpdated.bind(this));
	}

	private _onSessionUpdated(evt: Event) {
		const { session } = (evt as CustomEvent).detail;
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
	let rkApp: RkApp;

	interface Window {
		rkApp: RkApp;
	}

	interface HTMLElementTagNameMap {
		'rk-app': RkApp;
	}
}
