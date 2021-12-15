import { LitElement, html, css } from 'lit';
import { msg, str } from '@lit/localize';
import { appRouterAnimations } from '../../router-animations.js';
import '../../rk-elements/rk-auth-wall/rk-auth-wall.js';
import './rk-forgot-password-page.js';
import './rk-reset-password-page.js';
import './rk-sigin-page.js';
import './rk-sigup-page.js';
// @ts-ignore
import AppRouterStyles from '../../../../src/elements/app-router/styles.css' assert { type: 'css' };
// import { property } from 'lit/decorators.js';
// import { CloudController } from '../../rk-lib/data-service/cloud-db-controller.js';

export class RkAccessPage extends LitElement {
  render() {
    return html`
      <app-router access .animations=${appRouterAnimations}>
        <rk-signin-page path="/access/signin" animation="slide-from-left"></rk-signin-page>
        <rk-signup-page path="/access/signup" animation="slide-from-left"></rk-signup-page>
        <rk-forgot-password-page
          path="/access/forgot-password"
          animation="slide-from-left"></rk-forgot-password-page>
        <rk-reset-password-page
          path="/access/reset-password"
          animation="slide-from-left"></rk-reset-password-page>
        <hw-404-page path="/404"></hw-404-page>
      </app-router>
    `;
  }

  static styles = [
    AppRouterStyles,
    css`
      :host {
        display: block;
      }
    `,
  ];
}

customElements.define('rk-access-page', RkAccessPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-access-page': RkAccessPage;
  }
}
