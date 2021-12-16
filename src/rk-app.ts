import { LitElement, html, css } from 'lit';
import { msg, str } from '@lit/localize';
import { appRouterAnimations } from './router-animations.js';
import './elements/app-router/app-router.js';
import { path } from './lib/localization/rk-url-paths.js';
// @ts-ignore
import AppRouterStyles from '../../src/elements/app-router/styles.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '../../samba/styles/scrollbar.css' assert { type: 'css' };

export class RkApp extends LitElement {
  render() {
    return html`
      <app-router base=${path('APP', false)} .animations=${appRouterAnimations}>
        <div path=${path('TOURNEYS')} animation="opacity">List of tourneys</div>
        <div path=${path('TOURNEY') + '/:id'} animation="opacity">Tourney Foo</div>
        <hw-404-page path="/404"></hw-404-page>

        <app-router__redirect path="/" redirect=${path('TOURNEYS')}></app-router__redirect>
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
