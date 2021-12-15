import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { msg, str } from '@lit/localize';
import { appRouterAnimations } from '../../router-animations.js';
import '../../rk-elements/rk-auth-wall/rk-auth-wall.js';
import '../404/rk-404-page.js';
import './rk-forgot-password-page.js';
import './rk-reset-password-page.js';
import './rk-sigin-page.js';
import './rk-sigup-page.js';
// @ts-ignore
import AppRouterStyles from '../../../../src/elements/app-router/styles.css' assert { type: 'css' };
// import { property } from 'lit/decorators.js';
// import { CloudController } from '../../rk-lib/data-service/cloud-db-controller.js';

@customElement('rk-access-page')
export class RkAccessPage extends LitElement {
  @property({ type: Boolean }) hidden = true;

  render() {
    return html`
      <app-router base="/access" .animations=${appRouterAnimations}>
        <rk-signin-page path="/signin" animation="opacity"></rk-signin-page>
        <rk-signup-page path="/signup" animation="opacity"></rk-signup-page>
        <rk-forgot-password-page
          path="/forgot-password"
          animation="opacity"></rk-forgot-password-page>
        <rk-reset-password-page path="/reset-password" animation="opacity"></rk-reset-password-page>
        <rk-404-page path="/404" animation="opacity"></rk-404-page>

        <app-router__redirect path="/" redirect="/signin"></app-router__redirect>
        <app-router__redirect path="*" redirect="/404"></app-router__redirect>
      </app-router>
    `;
  }

  shouldUpdate() {
    return !this.hasAttribute('hidden');
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

declare global {
  interface HTMLElementTagNameMap {
    'rk-access-page': RkAccessPage;
  }
}
