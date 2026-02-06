import './elements/app-router/app-router.js';
import './pages/404/rk-404-page.js';
import './pages/create-tourney/rk-create-tourney-page.js';
import './pages/home/rk-home-page.js';
import './pages/join-tourney/rk-join-tourney-page.js';
import './pages/tourney/rk-tourney-page.js';
import AppRouterStyles from './elements/app-router/styles.css';
import type { AppServices } from './lib/app-services.js';
import { path } from './lib/localization/rk-url-paths.js';
import { appRouterAnimations } from './router-animations.js';
import type { ISessionManager } from '@rankup/platform/session/common/sessionManager.js';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-app')
export class RkApp extends LitElement {
	@property({ attribute: false }) declare appServices: AppServices;

	@property({ attribute: false }) declare sessionManager: ISessionManager;

	onSignOutClick() {
		this.sessionManager.signOut();
	}

	// <button path=${path('TOURNEYS')} @click=${this.onSignOutClick}>Sign Out</button>
	// <div path=${path('TOURNEYS')} animation="opacity">
	//   List of tourneys
	//   <button @click=${this.onSignOutClick}>Sign Out</button>
	// </div>
	// <div path=${path('TOURNEY') + '/:id'} animation="opacity">Tourney Foo</div>
	override render() {
		return html`
			<app-router .animations=${appRouterAnimations}>
				<rk-home-page path=${path('TOURNEYS')} animation="opacity"></rk-home-page>
				<rk-tourney-page path=${path('TOURNEY', '*')} animation="opacity"></rk-tourney-page>
				<rk-join-tourney-page path=${path('JOIN_TOURNEY')} animation="opacity"></rk-join-tourney-page>
				<rk-create-tourney-page path=${path('CREATE_TOURNEY')} animation="opacity"></rk-create-tourney-page>
				<rk-404-page path="/404"></rk-404-page>
				<app-router__redirect path="*" redirect=${path('TOURNEYS')}></app-router__redirect>
			</app-router>
		`;
	}

	static override styles = [
		AppRouterStyles,
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
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-app': RkApp;
	}
}
