import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';

export class RkSignInPage extends LitElement {
  render() {
    return html`
      <h1>SignIn Page</h1>
      <a href="/">${msg('Back')}</a>
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

customElements.define('rk-signin-page', RkSignInPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-signin-page': RkSignInPage;
  }
}
