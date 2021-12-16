import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';

export class RkSignUpPage extends LitElement {
  render() {
    return html`
      <h1>SignUp Page</h1>
      <a href=${path('HOME')}>${msg('atras')}</a>
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
