import type { Match } from '@rankup/common/football/types';
import { OverlayController } from '@rankup/samba/overlay/types.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface FsgMatchPlayersBetsParameters {
	match: Match;
}

@customElement('fsg-match-players-bets')
export class FsgMatchPlayersBets
	extends LitElement
	implements Partial<FsgMatchPlayersBetsParameters>
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
		'fsg-match-players-bets': FsgMatchPlayersBets;
	}
}
