/// <reference types="urlpattern-polyfill" />
import 'samba/overlay/overlay-container.js';
// import './elements/app-router/app-router.js';
import './pages/home/rk-home-page.js';
import './pages/tourney/rk-tourney-page.js';
import './pages/create-tourney/rk-create-tourney-page.js';
import './pages/join-tourney/rk-join-tourney-page.js';

import { Router } from '@lit-labs/router';
// import AppRouterStyles from 'app/elements/app-router/styles-css.js'
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ScrollbarStyles from 'samba/styles/scrollbar-css.js';

import { DataService } from './lib/data-service/data-service.js';
import { path } from './lib/localization/rk-url-paths.js';
import { SessionManager } from './managers/session/session-manager.js';
// import { appRouterAnimations } from './router-animations.js';

if (!('URLPattern' in globalThis)) await import('urlpattern-polyfill');

/**
 * @fires session-updated
 */
@customElement('rk-app')
export class RkApp extends LitElement {
	private _router = new Router(this, [
		{ path: path('TOURNEYS'), render: () => null },
		{ path: path('TOURNEY', '*'), render: () => null },
		{ path: path('JOIN_TOURNEY'), render: () => null },
		{ path: path('CREATE_TOURNEY'), render: () => null },
		{ path: '/404', render: () => null },
		{
			path: '*',
			render: () => null,
			enter: () => {
				this._router.goto(path('TOURNEYS'));
				return false;
			},
		},
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
			this.shadowRoot!.querySelector('app-router')!.navigate('/');
		}
	}

	onSignOutClick() {
		this.sessionManager.signOut();
	}

	// <button path=${path('TOURNEYS')} @click=${this.onSignOutClick}>Sign Out</button>
	// <div path=${path('TOURNEYS')} animation="opacity">
	//   List of tourneys
	//   <button @click=${this.onSignOutClick}>Sign Out</button>
	// </div>
	// <div path=${path('TOURNEY') + '/:id'} animation="opacity">Tourney Foo</div>
	render() {
		return html`${this._router.outlet()}`;
		// return html`
		//   <app-router .animations=${appRouterAnimations}>
		//     <rk-home-page path=${path('TOURNEYS')} animation="opacity"></rk-home-page>
		//     <rk-tourney-page path=${path('TOURNEY', '*')} animation="opacity"></rk-tourney-page>
		//     <rk-join-tourney-page
		//       path=${path('JOIN_TOURNEY')}
		//       animation="opacity"></rk-join-tourney-page>
		//     <rk-create-tourney-page
		//       path=${path('CREATE_TOURNEY')}
		//       animation="opacity"></rk-create-tourney-page>
		//     <hw-404-page path="/404"></hw-404-page>
		//     <app-router__redirect path="*" redirect=${path('TOURNEYS')}></app-router__redirect>
		//   </app-router>
		// `;
	}

	static styles = [
		// AppRouterStyles,
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
			:host > * {
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				overflow-y: auto;
				box-sizing: border-box;
				overflow-x: hidden;
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
