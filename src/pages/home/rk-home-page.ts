import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../authenticated-icons.js';
import { property } from 'lit/decorators.js';
import '../../elements/rk-app-header/rk-app-header.js';
import '../../elements/rk-tourney-list/rk-tourney-list.js';
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };

export class HomePage extends LitElement {
  @property({ type: Boolean })
  toggleDrawer: false;

  render() {
    return html`
      <rk-app-header></rk-app-header>
      <rk-tourney-list></rk-tourney-list>
    `;
  }

  static styles = [css``];
}

customElements.define('rk-home-page', HomePage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-home-page': HomePage;
  }
}
