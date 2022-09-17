import '../../elements/rk-match-row/rk-match-row.js';

// import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { openOverlay } from 'samba/overlay/open-overlay.js';

import { Match } from '../../lib/data-service/data-service.js';
import type {
  RkSbMatchPlayersBets,
  RkSbMatchPlayersBetsParameters,
} from '../score-bets/rk-sb-match-players-bets/rk-sb-match-players-bets.js';

@customElement('rk-tourney-matchday-live')
export class RkTourneyMatchdayLive extends LitElement {
  @property({ attribute: false })
  fixture?: Match[];

  private _onMatchClick(match: Match) {
    openOverlay<RkSbMatchPlayersBets, RkSbMatchPlayersBetsParameters>(
      'rk-sb-match-players-bets',
      { match },
      {
        addOverlayStyles: false,
        withBackdrop: false,
        animationIn: [
          { transform: 'translateY(-20px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        animationOut: [
          { transform: 'translateY(0)', opacity: 1 },
          { transform: 'translateY(-20px)', opacity: 0 },
        ],
      },
    );
  }

  render() {
    return html`
      ${this.fixture?.map(
        match =>
          html`
            <rk-match-row
              id="match"
              @click=${() => this._onMatchClick(match)}
              .match=${match}></rk-match-row>
          `,
      )}
    `;
  }

  static styles = [
    css`
      :host {
        background-color: var(--color-canvas-default);
        color: var(--color-fg-default);
        display: block;
        box-sizing: border-box;
        margin-top: 2rem;
      }
      #match {
        margin: 1rem 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-matchday-live': RkTourneyMatchdayLive;
  }
}
