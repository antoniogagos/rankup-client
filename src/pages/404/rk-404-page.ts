import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';

export class Rk404Page extends LitElement {
  render() {
    return html`
      <h1>404 Missing</h1>
      <a href="/">${msg('Home')}</a>
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

customElements.define('rk-404-page', Rk404Page);

declare global {
  interface HTMLElementTagNameMap {
    'rk-404-page': Rk404Page;
  }
}
