import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';

export class RkSignUpPage extends LitElement {
  render() {
    return html`
      <h1>SignUp Page</h1>
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

customElements.define('rk-signup-page', RkSignUpPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-signup-page': RkSignUpPage;
  }
}
