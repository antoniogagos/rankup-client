import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg, str } from '@lit/localize';
import { appRouterAnimations } from './router-animations.js';
import './elements/app-router/app-router.js';
import './pages/access/rk-access-page.js';
import './pages/welcome/rk-welcome-page.js';
// @ts-ignore
import PageStyles from '../../src/elements/app-router/page-styles.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '../../samba/styles/scrollbar.css' assert { type: 'css' };

export class RkUnauthenticaApp extends LitElement {
  // @property({ type: String }) ff = 'My app';

  private onPageChange(evt: CustomEvent) {}

  private onNavigationRequested() {}

  render() {
    return html`
      <app-router
        class="router"
        fallback="/404"
        .animations=${appRouterAnimations}
        @page-changed=${this.onPageChange}
        @request-navigation=${this.onNavigationRequested}>
        <rk-welcome-page
          class="page scroll-target scroll-lg"
          path="/"
          animation="slide-from-left"></rk-welcome-page>
        <rk-access-page
          class="page scroll-target scroll-lg"
          path="/access"
          animation="slide-from-right"></rk-access-page>
        <hw-404-page class="page" path="/404"></hw-404-page>
      </app-router>
    `;
  }

  static styles = [
    PageStyles,
    ScrollbarStyles,
    css`
      :host {
        display: block;
        height: 100%;
      }
      .router {
        height: 100%;
      }
      [hidden] {
        display: none !important;
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
