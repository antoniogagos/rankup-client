import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../authenticated-icons.js';
import { appRouterAnimations } from '../../router-animations.js';
import { property } from 'lit/decorators.js';
import '../../elements/rk-tourney-header/rk-tourney-header.js';
import '../../elements/rk-tourney-footer/rk-tourney-footer.js';
import { RankingType } from './pages/rk-tourney-ranking.js';

// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import linkStyles from '/samba/styles/link.css' assert { type: 'css' };

export class RkTourneyPage extends LitElement {
  @property({ type: Boolean })
  hidden = true;

  @property({ type: Number })
  private _selectedRanking = RankingType.SEASON;

  shouldUpdate(): boolean {
    return !this.hidden;
  }

  private _onSelectRankingChanged(evt: CustomEvent) {
    this._selectedRanking = evt.detail.selectedRanking;
  }

  render() {
    return html`
      <rk-tourney-header
        ?inverted-color=${this._selectedRanking === RankingType.SEASON}></rk-tourney-header>
      <rk-tourney-ranking
        @selected-ranking-changed=${this._onSelectRankingChanged}></rk-tourney-ranking>
      <rk-tourney-footer></rk-tourney-footer>
    `;
  }

  static styles = [
    buttonStyles,
    linkStyles,
    css`
      :host {
        background: var(--color-canvas-default);
        box-sizing: border-box;
        color: var(--color-fg-default);
        display: grid;
        grid-template-rows: max-content auto 6.2rem;
      }
    `,
  ];
}

customElements.define('rk-tourney-page', RkTourneyPage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-page': RkTourneyPage;
  }
}
