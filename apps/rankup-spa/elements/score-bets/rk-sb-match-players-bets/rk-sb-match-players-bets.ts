import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import type { OverlayController } from '@rankup/samba/overlay/types';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface RkSbMatchPlayersBetsParameters {
	match: Match;
}

@customElement('rk-sb-match-players-bets')
export class RkSbMatchPlayersBets extends LitElement implements Partial<RkSbMatchPlayersBetsParameters> {
	overlayController?: OverlayController<this>;

	@property({ attribute: false }) match: Match | undefined = undefined;

	override render() {
		return html` bets `;
	}

	static override styles = [
		css`
		:host {
			color: var(--color-fg-default);
			background: #fff;
			display: block;
			box-sizing: border-box;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-sb-match-players-bets': RkSbMatchPlayersBets;
	}
}
