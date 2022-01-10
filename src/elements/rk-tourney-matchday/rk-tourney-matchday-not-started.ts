import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { openOverlay } from 'samba/overlay/open-overlay.js';
import type { Match } from '../../lib/data-service/data-service.js';
import type {
  RkSbUnstartedMatchDetails,
  RkSbUnstartedMatchDetailsParameters,
} from '../score-bets/rk-sb-match-details/rk-sb-unstarted-match-details.js';
import '../score-bets/rk-sb-match-details/rk-sb-unstarted-match-details.js';
import '../score-bets/rk-sb-bet-match/rk-sb-bet-match.js';

export class RkTourneyMatchdayNotStarted extends LitElement {
  @property({ attribute: false })
  fixture: Match[] = null;

  private _onClickMatch(match: Match) {
    openOverlay<RkSbUnstartedMatchDetails, RkSbUnstartedMatchDetailsParameters>(
      'rk-sb-unstarted-match-details',
      { match },
      {
        addOverlayStyles: false,
        withBackdrop: false,
        animationIn: [
          { transform: 'translateX(-20px)', opacity: 0 },
          { transform: 'translateX(0)', opacity: 1 },
        ],
        animationOut: [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: 'translateX(-20px)', opacity: 0 },
        ],
      },
    );
  }

  render() {
    return html`
      ${this.fixture?.map(
        match =>
          html`
            <rk-sb-bet-match
              id="match"
              @click=${() => this._onClickMatch(match as Match)}
              .match=${match}></rk-sb-bet-match>
          `,
      )}
    `;
  }

  static styles = [
    css`
      :host {
        color: var(--color-fg-default);
        display: block;
        box-sizing: border-box;
      }
      #match {
        margin: 3rem 0px;
      }

      :host > #match:first-child {
        margin-top: 1.5rem;
      }
    `,
  ];
}

customElements.define('rk-tourney-matchday-not-started', RkTourneyMatchdayNotStarted);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-matchday-not-started': RkTourneyMatchdayNotStarted;
  }
}
