import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { appRouterAnimations } from './router-animations.js';
// import { msg, str } from '@lit/localize';
import './elements/app-router/app-router.js';
import './pages/access/rk-access-page.js';
import './pages/welcome/rk-welcome-page.js';

export class RkUnauthenticaApp extends LitElement {
  // @property({ type: String }) title = 'My app';

  private onPageChange(evt: CustomEvent) {
    console.log(evt);
  }

  private onNavigationRequested() {}

  render() {
    return html`
      <app-router
        class="pages"
        home="/"
        base="/"
        .animations=${appRouterAnimations}
        @page-changed=${this.onPageChange}
        @request-navigation=${this.onNavigationRequested}>
        <rk-welcome-page
          class="page scroll-target scroll-lg"
          name="welcome"
          path="/"
          animation-in="slide-in"
          animation-out="slide-out"></rk-welcome-page>
        <rk-access-page
          class="page scroll-target scroll-lg"
          name="access"
          path="/access"
          animation-in="slide-in"
          animation-out="slide-out"></rk-access-page>
        <hw-404-page class="page" path="/404"></hw-404-page>
      </app-router>
    `;
  }

  static styles = [css``];
}

customElements.define('rk-unauthenticated-app', RkUnauthenticaApp);

declare global {
  interface HTMLElementTagNameMap {
    'rk-unauthenticated-app': RkUnauthenticaApp;
  }
}
