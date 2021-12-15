import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';

export class RkResetPasswordPage extends LitElement {
  render() {
    return html`
      <h1>ResetPassword Page</h1>
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

customElements.define('rk-reset-password-page', RkResetPasswordPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-reset-password-page': RkResetPasswordPage;
  }
}
