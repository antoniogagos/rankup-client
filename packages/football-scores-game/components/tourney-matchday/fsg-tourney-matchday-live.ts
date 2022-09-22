import '../match-row/fsg-match-row.js';

import type { Match } from '@rankup/common/football/types';
import { openOverlay } from '@rankup/samba/overlay/open-overlay.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type {
	FsgMatchPlayersBets,
	FsgMatchPlayersBetsParameters,
} from '../match-players-bets/fsg-match-players-bets.js';

@customElement('fsg-tourney-matchday-live')
export class FsgTourneyMatchdayLive extends LitElement {
	@property({ attribute: false })
	fixture?: Match[];

	private _onMatchClick(match: Match) {
		openOverlay<FsgMatchPlayersBets, FsgMatchPlayersBetsParameters>(
			'fsg-match-players-bets',
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
						<fsg-match-row
							id="match"
							@click=${() => this._onMatchClick(match)}
							.match=${match}></fsg-match-row>
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
		'fsg-tourney-matchday-live': FsgTourneyMatchdayLive;
	}
}
