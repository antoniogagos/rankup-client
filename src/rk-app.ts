import { LitElement, html, css } from 'lit';
import { msg, str } from '@lit/localize';
import { appRouterAnimations } from './router-animations.js';
import { Locale, updateLocale } from './lib/localization/localization.js';
import './elements/app-router/app-router.js';
// @ts-ignore
import AppRouterStyles from '../../src/elements/app-router/styles.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '../../samba/styles/scrollbar.css' assert { type: 'css' };

export class RkApp extends LitElement {
  render() {
    return html`
      <app-router base="/${Locale}/app" .animations=${appRouterAnimations}>
        <div path="/${msg('torneos')}" animation="opacity">List of tourneys</div>
        <div path="/tourney/:id" animation="opacity">Tourney Foo</div>
        <hw-404-page path="/404"></hw-404-page>

        <app-router__redirect path="/" redirect="/${msg('torneos')}"></app-router__redirect>
        <app-router__redirect path="*" redirect="/404"></app-router__redirect>
      </app-router>
    `;
  }

  static styles = [
    AppRouterStyles,
    ScrollbarStyles,
    css`
      :host {
        display: contents;
      }

      @supports not (display: contents) {
        :host {
          display: block;
          height: 100%;
        }
      }
    `,
  ];
}

customElements.define('rk-app', RkApp);
