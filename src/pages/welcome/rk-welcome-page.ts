import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';

export class WelcomePage extends LitElement {
  render() {
    return html`
      Welcome Page
      <a href="/access">${msg('Start playing')}</a>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        background: teal;
      }
    `,
  ];
}

customElements.define('rk-welcome-page', WelcomePage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-welcome-page': WelcomePage;
  }
}
