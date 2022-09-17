import './elements/app-router/app-router.js';
import './pages/welcome/rk-welcome-page.js';
import './pages/access/rk-forgot-password-page.js';
import './pages/access/rk-reset-password-page.js';
import './pages/access/rk-signin-page.js';
import './pages/access/rk-signup-page.js';
import './pages/access/rk-confirm-registration-page.js';
import './pages/404/rk-404-page.js';
import 'samba/load-spinner/load-spinner.js';

import AppRouterStyles from 'app/elements/app-router/styles.css' assert { type: 'css' };
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ScrollbarStyles from 'samba/styles/scrollbar.css' assert { type: 'css' };

import type { EventsMap as AppRouterEventsMap } from './elements/app-router/app-router.js';
import { path, PublicPaths } from './lib/localization/rk-url-paths.js';
import { SessionManager } from './managers/session/session-manager.js';
import { appRouterAnimations } from './router-animations.js';

@customElement('rk-unauthenticated-app')
export class RkUnauthenticatedApp extends LitElement {
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

  redirectToPage(pagePath: keyof typeof PublicPaths, queryParams?: { [key: string]: string }) {
    let url: string = path(pagePath);
    if (queryParams) {
      url += '?' + new URLSearchParams(queryParams).toString();
    }
    this.shadowRoot?.querySelector('app-router')?.navigate(url);
  }

  render() {
    return html`
      <load-spinner></load-spinner>
      <app-router .animations=${appRouterAnimations}>
        <rk-welcome-page path="/" animation="opacity"></rk-welcome-page>
        <rk-signin-page path=${path('SIGNIN')} animation="opacity"></rk-signin-page>
        <rk-signup-page path=${path('SIGNUP')} animation="opacity"></rk-signup-page>
        <rk-confirm-registration-page
          path=${path('CONFIRM_REGISTRATION')}
          animation="opacity"></rk-confirm-registration-page>
        <rk-forgot-password-page
          path=${path('FORGOT_PASSWORD')}
          animation="opacity"></rk-forgot-password-page>
        <rk-reset-password-page
          path=${path('RESET_PASSWORD')}
          animation="opacity"></rk-reset-password-page>
        <rk-404-page path="/404" animation="opacity"></rk-404-page>

        <app-router__redirect path="/oauth" redirect=${path('SIGNIN')}></app-router__redirect>
        <app-router__redirect path="*" redirect="/"></app-router__redirect>
      </app-router>
    `;
  }

  static styles = [
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
