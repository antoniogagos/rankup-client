import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
// import { CloudController } from '../../rk-lib/data-service/cloud-db-controller.js';
import '../../rk-elements/rk-auth-wall/rk-auth-wall.js';
// import { msg, str } from '@lit/localize';

export class AccessPage extends LitElement {
  render() {
    return html`
      Access Page
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        background: firebrick;
      }
    `,
  ];
}

customElements.define('rk-access-page', AccessPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-access-page': AccessPage;
  }
}
