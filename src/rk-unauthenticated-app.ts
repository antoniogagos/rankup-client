import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { msg, str } from '@lit/localize';
import { Locale, updateLocale } from './lib/localization/localization.js';
import { appRouterAnimations } from './router-animations.js';
import './elements/app-router/app-router.js';
import './pages/welcome/rk-welcome-page.js';
import './pages/access/rk-forgot-password-page.js';
import './pages/access/rk-reset-password-page.js';
import './pages/access/rk-sigin-page.js';
import './pages/access/rk-sigup-page.js';
import './pages/404/rk-404-page.js';
import type { EventsMap as AppRouterEventsMap } from './elements/app-router/app-router.js';
// @ts-ignore
import AppRouterStyles from '../../src/elements/app-router/styles.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '../../samba/styles/scrollbar.css' assert { type: 'css' };

@customElement('rk-unauthenticated-app')
export class RkUnauthenticaApp extends LitElement {
  private onPageChange(evt: AppRouterEventsMap['page-changed']) {
    // const { elementName } = evt.detail.page;
    // if (elementName === 'rk-access-page') {
    //   import(`./pages/access/rk-access-page.js`);
    // }
  }

  private onNavigationRequested() {}

  render() {
    return html`
      <app-router
        base="/${Locale}"
        .animations=${appRouterAnimations}
        @page-changed=${this.onPageChange}
        @request-navigation=${this.onNavigationRequested}>
        <rk-welcome-page path="/" animation="opacity"></rk-welcome-page>
        <rk-signin-page path="/${msg('iniciar-session')}" animation="opacity"></rk-signin-page>
        <rk-signup-page path="/${msg('registro')}" animation="opacity"></rk-signup-page>
        <rk-forgot-password-page
          path="/${msg('recordar-password')}"
          animation="opacity"></rk-forgot-password-page>
        <rk-reset-password-page
          path="/${msg('resetear-password')}"
          animation="opacity"></rk-reset-password-page>
        <rk-404-page path="/404" animation="opacity"></rk-404-page>

        <app-router__redirect path="*" redirect="/404"></app-router__redirect>
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
  interface HTMLElementTagNameMap {
    'rk-unauthenticated-app': RkUnauthenticaApp;
  }
}
