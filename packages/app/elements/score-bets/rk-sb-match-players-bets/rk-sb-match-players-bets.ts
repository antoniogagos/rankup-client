import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { OverlayController } from 'samba/overlay/types.js';

import type { Match } from '../../../lib/data-service/data-service.js';

export interface RkSbMatchPlayersBetsParameters {
  match: Match;
}

@customElement('rk-sb-match-players-bets')
export class RkSbMatchPlayersBets
  extends LitElement
  implements Partial<RkSbMatchPlayersBetsParameters>
{
  overlayController?: OverlayController<this>;

  @property({ attribute: false })
  match: Match | undefined = undefined;

  render() {
    return html` bets `;
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

declare global {
  interface HTMLElementTagNameMap {
    'rk-sb-match-players-bets': RkSbMatchPlayersBets;
  }
}
