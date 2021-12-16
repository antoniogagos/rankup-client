import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';

export class RkForgotPasswordPage extends LitElement {
  render() {
    return html`
      <h1>ForgotPassword Page</h1>
      <a href=${path('SIGNIN')}>${msg('Volver')}</a>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        background: beige;
      }
    `,
  ];
}

customElements.define('rk-forgot-password-page', RkForgotPasswordPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-forgot-password-page': RkForgotPasswordPage;
  }
}
