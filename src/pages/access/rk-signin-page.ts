import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';

export class RkSignInPage extends LitElement {
  render() {
    return html`
      <h1>SignIn Page</h1>
      <div>
        <a href="/">${msg('volver')}</a>
      </div>
      <div>
        <a href=${path('FORGOT_PASSWORD')}>${msg('Forgot Password')}</a>
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
