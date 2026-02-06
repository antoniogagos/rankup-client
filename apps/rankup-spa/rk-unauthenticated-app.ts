import './elements/app-router/app-router.js';
import './pages/404/rk-404-page.js';
import './pages/access/rk-confirm-registration-page.js';
import './pages/access/rk-forgot-password-page.js';
import './pages/access/rk-reset-password-page.js';
import './pages/access/rk-signin-page.js';
import './pages/access/rk-signup-page.js';
import './pages/welcome/rk-welcome-page.js';
import '@rankup/samba/load-spinner/load-spinner';
import AppRouterStyles from './elements/app-router/styles.css';
import { path } from './lib/localization/rk-url-paths.js';
import { appRouterAnimations } from './router-animations.js';
import type { ISessionManager } from '@rankup/platform/session/common/sessionManager.js';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-unauthenticated-app')
export class RkUnauthenticatedApp extends LitElement {
	@property({ attribute: false }) declare sessionManager: ISessionManager;

	override render() {
		return html`
			<load-spinner></load-spinner>
			<app-router .animations=${appRouterAnimations}>
				<rk-welcome-page path="/" animation="opacity"></rk-welcome-page>
				<rk-signin-page path=${path('SIGNIN')} animation="opacity"></rk-signin-page>
				<rk-signup-page path=${path('SIGNUP')} animation="opacity"></rk-signup-page>
				<rk-confirm-registration-page path=${path('CONFIRM_REGISTRATION')} animation="opacity"></rk-confirm-registration-page>
				<rk-forgot-password-page path=${path('FORGOT_PASSWORD')} animation="opacity"></rk-forgot-password-page>
				<rk-reset-password-page path=${path('RESET_PASSWORD')} animation="opacity"></rk-reset-password-page>
				<rk-404-page path="/404" animation="opacity"></rk-404-page>

				<app-router__redirect path="/oauth" redirect=${path('SIGNIN')}></app-router__redirect>
				<app-router__redirect path="*" redirect="/"></app-router__redirect>
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
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-unauthenticated-app': RkUnauthenticatedApp;
	}
}
