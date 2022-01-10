import { LitElement, html, css } from 'lit';
import { path, relativePath } from '../../lib/localization/rk-url-paths.js';
import { appRouterAnimations } from '../../router-animations.js';
import { property } from 'lit/decorators.js';
import { RankingType } from './pages/rk-tourney-ranking.js';
import '../../elements/rk-tourney-header/rk-tourney-header.js';
import '../../elements/rk-tourney-footer/rk-tourney-footer.js';
import './pages/rk-tourney-matchday.js';
import './pages/rk-tourney-chat.js';
import './pages/rk-tourney-settings.js';
import './pages/rk-share-tourney.js';
import './pages/rk-sb-rules.js';
// @ts-ignore
import AppRouterStyles from '/src/elements/app-router/styles.css' assert { type: 'css' };
// @ts-ignore
import ButtonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import LinkStyles from '/samba/styles/link.css' assert { type: 'css' };

export class RkTourneyPage extends LitElement {
  @property({ type: Boolean })
  hidden = true;

  @property({ type: Boolean })
  private _seasonRankingSelected = false;

  shouldUpdate(): boolean {
    return !this.hidden;
  }

  private _onSelectRankingChanged(evt: CustomEvent) {
    this._seasonRankingSelected = evt.detail.selectedRanking === RankingType.SEASON;
  }

  render() {
    const router = this.shadowRoot.querySelector('app-router');
    const rankingPageVisible = router?.page.elementName === 'rk-tourney-ranking';
    return html`
      <rk-tourney-header
        ?inverted-color=${this._seasonRankingSelected && rankingPageVisible}></rk-tourney-header>
      <app-router
        class="router"
        base="${path('TOURNEY', 'fj_rew')}"
        .animations=${appRouterAnimations}>
        <rk-tourney-ranking
          class="${this._seasonRankingSelected && rankingPageVisible
            ? 'router-page-season-ranking'
            : 'router-page'}"
          path=${relativePath('RANKING')}
          animation="opacity"
          @selected-ranking-changed=${this._onSelectRankingChanged}></rk-tourney-ranking>
        <rk-tourney-matchday
          class="router-page"
          animation="opacity"
          path=${relativePath('MATCHDAY')}></rk-tourney-matchday>
        <rk-tourney-chat
          class="router-page"
          animation="opacity"
          path=${relativePath('CHAT')}></rk-tourney-chat>
        <rk-share-tourney
          path=${relativePath('SHARE_TOURNEY')}
          animation="opacity"></rk-share-tourney>
        <rk-tourney-settings
          path=${relativePath('SETTINGS_TOURNEY')}
          animation="opacity"></rk-tourney-settings>
        <rk-sb-rules path=${relativePath('RULES_TOURNEY')} animation="opacity"></rk-sb-rules>
      </app-router>
      <rk-tourney-footer></rk-tourney-footer>
    `;
  }

  static styles = [
    ButtonStyles,
    LinkStyles,
    AppRouterStyles,
    css`
      :host {
        background: var(--color-canvas-default);
        box-sizing: border-box;
        color: var(--color-fg-default);
        display: flex;
        flex-direction: column;
      }
      .router {
        display: block;
        flex: 1;
      }
      .router-page {
        margin-top: 7rem;
        height: calc(100% - 12.6rem);
      }
      .router-page-season-ranking {
        height: calc(100% - 5.6rem);
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
