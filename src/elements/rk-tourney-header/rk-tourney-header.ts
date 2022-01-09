import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { path, relativePath } from '../../lib/localization/rk-url-paths.js';
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
  invertedColor = false;

  private _tourneys = new Task(
    this,
    () => rkApp.ds.request.Tourneys.GetUserTourneys(),
    () => [null],
  );

  render() {
    const linkClasses = {
      'link--primary': !this.invertedColor,
      'link--primary-inverted': this.invertedColor,
    };
    const staticPath = path('TOURNEY') + '/fj_rew';
    return html`
      <header
        class=${classMap({
          'color-header-text': !this.invertedColor,
          'color-header-text-inverted': this.invertedColor,
        })}>
        <section class="left-section">
          <a
            id="arrow"
            class=${classMap(linkClasses)}
            href=${path('TOURNEYS')}>
            ${Icons('arrow-left', 20)}
          </a>
        </section>
        <div class="f3 text-bold nowrap">The Squad Team</div>
        <section class="right-section">
          <a href=${staticPath + relativePath('SHARE_TOURNEY')} class=${classMap(
      linkClasses,
    )}>${Icons('add-player', 20)}</a>
          <a href=${staticPath + relativePath('SETTINGS_TOURNEY')} class=${classMap(
      linkClasses,
    )}>${Icons('settings', 20)}</button></a>
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
        z-index: 3;
      }
      header {
        align-items: center;
        box-sizing: border-box;
        display: flex;
        height: 6.6rem;
        justify-content: center;
        padding: 2rem;
        width: 100%;
        z-index: 1;
      }
      #arrow {
        display: flex;
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
        position: absolute;
        left: 2rem;
      }
      .right-section {
        position: absolute;
        right: 2rem;
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
