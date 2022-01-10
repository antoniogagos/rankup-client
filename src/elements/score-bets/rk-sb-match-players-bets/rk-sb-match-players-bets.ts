import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { OverlayController } from 'samba/overlay/types.js';
import type { Match } from '../../../lib/data-service/data-service.js';

export interface RkSbMatchPlayersBetsParameters {
  match: Match;
}

export class RkSbMatchPlayersBets extends LitElement implements RkSbMatchPlayersBetsParameters {
  overlayController?: OverlayController<this> = null;

  @property({ attribute: false })
  match: Match = null;

  render() {
    return html`
      bets
    `;
  }

  static styles = [
    css`
      :host {
        color: var(--color-fg-default);
        background: #fff;
        display: block;
        box-sizing: border-box;
      }
    `,
  ];
}

customElements.define('rk-sb-match-players-bets', RkSbMatchPlayersBets);

declare global {
  interface HTMLElementTagNameMap {
    'rk-sb-match-players-bets': RkSbMatchPlayersBets;
  }
}
