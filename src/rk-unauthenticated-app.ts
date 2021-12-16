import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { appRouterAnimations } from './router-animations.js';
import './elements/app-router/app-router.js';
import './pages/welcome/rk-welcome-page.js';
import './pages/404/rk-404-page.js';
import type { EventsMap as AppRouterEventsMap } from './elements/app-router/app-router.js';
import './pages/access/rk-access-page.js';
// @ts-ignore
import AppRouterStyles from '../../src/elements/app-router/styles.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '../../samba/styles/scrollbar.css' assert { type: 'css' };

export class RkUnauthenticaApp extends LitElement {
  // @property({ type: String }) ff = 'My app';

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
        main
        fallback="/404"
        .animations=${appRouterAnimations}
        @page-changed=${this.onPageChange}
        @request-navigation=${this.onNavigationRequested}>
        <rk-welcome-page path="/" animation="slide-from-left"></rk-welcome-page>
        <rk-access-page path="/access/*" animation="slide-from-right"></rk-access-page>
        <rk-404-page path="/404"></rk-404-page>
        <app-router__redirect path="/access" redirect="/access/signin"></app-router__redirect>
      </app-router>
    `;
  }

  static styles = [
    AppRouterStyles,
    ScrollbarStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }
    `,
  ];
}

customElements.define('rk-unauthenticated-app', RkUnauthenticaApp);

declare global {
  interface HTMLElementTagNameMap {
    'rk-unauthenticated-app': RkUnauthenticaApp;
  }
}
