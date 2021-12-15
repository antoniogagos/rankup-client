import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { appRouterAnimations } from './router-animations.js';
// import { msg, str } from '@lit/localize';
import './elements/app-router/app-router.js';
// @ts-ignore
import AppRouterStyles from '../../src/elements/app-router/styles.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '../../samba/styles/scrollbar.css' assert { type: 'css' };

export class RkApp extends LitElement {
  private onPageChange() {}

  private onNavigationRequested() {}

  render() {
    return html`
      <app-router
        class="pages"
        home="/tourneys"
        base="/app"
        .animations=${appRouterAnimations}
        @page-changed=${this.onPageChange}
        @request-navigation=${this.onNavigationRequested}>
        <hw-404-page path="/404" class="page"></hw-404-page>
      </app-router>
    `;
  }

  static styles = [AppRouterStyles, ScrollbarStyles, css``];
}

customElements.define('rk-app', RkApp);
