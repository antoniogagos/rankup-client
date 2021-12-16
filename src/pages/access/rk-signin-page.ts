import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';

export class RkSignInPage extends LitElement {
  render() {
    return html`
      <h1>SignIn Page</h1>
      <div>
        <a href="/">${msg('Back')}</a>
      </div>
      <div>
        <a href="/access/forgot-password">${msg('Forgot Password')}</a>
      </div>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        background: var(--color-bg-primary);
        color: var(--color-text-primary);
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
