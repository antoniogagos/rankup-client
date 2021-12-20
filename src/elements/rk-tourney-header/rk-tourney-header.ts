import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Task, TaskStatus } from '@lit-labs/task';
import { Icons } from '../../authenticated-icons.js';
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import linkStyles from '/samba/styles/link.css' assert { type: 'css' };
// @ts-ignore
import typographyStyles from '/samba/styles/typography.css' assert { type: 'css' };

export class RkTourneyHeader extends LitElement {
  @property({ type: Boolean, attribute: 'inverted-color' })
  invertedColor = true;

  private _tourneys = new Task(
    this,
    () => rkApp.ds.request.Tourneys.GetUserTourneys(),
    () => [null],
  );

  render() {
    return html`
      <header
        class=${classMap({
          'color-header-text': !this.invertedColor,
          'color-header-text-inverted': this.invertedColor,
        })}>
        <section class="left-section">
          <a
            id="arrow"
            class=${classMap({
              'link--primary': !this.invertedColor,
              'link--primary-inverted': this.invertedColor,
            })}
            href=${path('TOURNEYS')}>
            ${Icons('arrow-left', 16)}
          </a>
          <div class="f4 text-bold nowrap">The Squad Team</div>
        </section>
        <section class="right-section">
          <button>${Icons('add-player', 20)}</button>
          <button>${Icons('settings', 20)}</button>
        </section>
      </header>
    `;
  }

  static styles = [
    resetStyles,
    linkStyles,
    buttonStyles,
    typographyStyles,
    css`
      :host {
        width: 100%;
        padding: 2rem;
        box-sizing: border-box;
        z-index: 2;
      }
      header {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .color-header-text {
        background: var(--color-header-bg);
        color: var(--color-header-text);
      }
      .color-header-text-inverted {
        background: var(--color-header-bg-inverted);
        color: var(--color-header-text-inverted);
      }
      .left-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .right-section {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
    `,
  ];
}

customElements.define('rk-tourney-header', RkTourneyHeader);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-header': RkTourneyHeader;
  }
}
