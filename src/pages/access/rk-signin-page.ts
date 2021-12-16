import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';

export class RkSignInPage extends LitElement {
  render() {
    return html``;
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
