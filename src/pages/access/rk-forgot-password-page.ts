import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';

export class RkForgotPasswordPage extends LitElement {
  render() {
    return html`
      <h1>ForgotPassword Page</h1>
      <a href="/access">${msg('Back')}</a>
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
