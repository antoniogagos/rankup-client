import './elements/app-router/app-router.js';
import './pages/404/rk-404-page.js';
import './pages/create-tournament/rk-create-tournament-page.js';
import './pages/home/rk-home-page.js';
import './pages/join-tournament/rk-join-tournament-page.js';
import './pages/tournament/rk-tournament-page.js';
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

	// <button path=${path('TOURNAMENTS')} @click=${this.onSignOutClick}>Sign Out</button>
	// <div path=${path('TOURNAMENTS')} animation="opacity">
	//   List of tournaments
	//   <button @click=${this.onSignOutClick}>Sign Out</button>
	// </div>
	// <div path=${path('TOURNAMENT') + '/:id'} animation="opacity">Tournament Foo</div>
	override render() {
		return html`
			<app-router .animations=${appRouterAnimations}>
				<rk-home-page path=${path('TOURNAMENTS')} animation="opacity"></rk-home-page>
				<rk-tournament-page path=${path('TOURNAMENT', '*')} animation="opacity"></rk-tournament-page>
				<rk-join-tournament-page path=${path('JOIN_TOURNAMENT')} animation="opacity"></rk-join-tournament-page>
				<rk-create-tournament-page path=${path('CREATE_TOURNAMENT')} animation="opacity"></rk-create-tournament-page>
				<rk-404-page path="/404"></rk-404-page>
				<app-router__redirect path="*" redirect=${path('TOURNAMENTS')}></app-router__redirect>
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
