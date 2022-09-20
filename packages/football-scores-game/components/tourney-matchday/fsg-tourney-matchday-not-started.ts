import '../match-details/fsg-unstarted-match-details.js';
import '../bet-match/fsg-bet-match.js';

import type { Match } from 'common/football/types';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { openOverlay } from 'samba/overlay/open-overlay.js';

import type {
	FsgUnStartedMatchDetails,
	FsgUnStartedMatchDetailsParameters,
} from '../match-details/fsg-unstarted-match-details.js';

@customElement('fsg-tourney-matchday-not-started')
export class FsgTourneyMatchdayNotStarted extends LitElement {
	@property({ attribute: false })
	fixture?: Match[];

	private _onClickMatch(match: Match) {
		openOverlay<FsgUnStartedMatchDetails, FsgUnStartedMatchDetailsParameters>(
			'fsg-unstarted-match-details',
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
						<fsg-bet-match
							id="match"
							@click=${() => this._onClickMatch(match as Match)}
							.match=${match}></fsg-bet-match>
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

declare global {
	interface HTMLElementTagNameMap {
		'fsg-tourney-matchday-not-started': FsgTourneyMatchdayNotStarted;
	}
}
