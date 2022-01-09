import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { Match } from 'src/lib/rk-data-service/api-service.js';
import { classMap } from 'lit/directives/class-map.js';
// @ts-ignore
import MatchRowStyles from '/samba/styles/rk-match-row.css' assert { type: 'css' };
import { hasMatchdayStarted } from 'src/lib/utils/has-matchday-started';

export class RKMatchRow extends LitElement {
  @property({ attribute: false })
  match: Match = null;

  render() {
    return html`
      <div class="match-row">
        <div class="left-section">
          <div class="team home">
            <span class="team-name">Sev</span>
            <img width="32" height="32" src="/assets/teams/sevilla.png" alt="home logo" />
          </div>
          <div class="result ${this.match.result ? 'live' : 'not-started'}">
            ${this.match.result
              ? html`
                  <span>${this.match.result?.split('-')[0]}</span>
                  <span class="divisor-line"></span>
                  <span>${this.match.result?.split('-')[1]}</span>
                  <div class="match-time-lapsed-line"></div>
                `
              : html`
                  <div>Sab</div>
                  <div>14:00</div>
                `}
          </div>
          <div class="team away">
            <img width="32" height="32" src="/assets/teams/villareal.png" alt="away logo" />
            <span class="team-name">Vil</span>
          </div>
        </div>
        <div class="right-section">
          <div class="bet">
            ${Math.floor(Math.random() * (4 - 0 + 1) + 0)}-${Math.floor(
              Math.random() * (4 - 0 + 1) + 0,
            )}
          </div>
          ${this.match.result
            ? html`
                <div class="points positive">+12</div>
              `
            : ''}
        </div>
      </div>
    `;
  }

  static styles = [
    MatchRowStyles,
    css`
      :host {
        display: block;
        width: 100%;
        background-color: var(--color-canvas-secondary);
        color: var(--color-fg-default);
        border-radius: 0.8rem;
      }
    `,
  ];
}

customElements.define('rk-match-row', RKMatchRow);

declare global {
  interface HTMLElementTagNameMap {
    'rk-match-row': RKMatchRow;
  }
}
