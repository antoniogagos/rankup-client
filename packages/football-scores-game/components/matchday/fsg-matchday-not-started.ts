import '../match-details/fsg-unstarted-match-details.js';
import '../bet-match/fsg-bet-match.js';

import type { Match } from '@rankup/common/football/types';
import { openOverlay } from '@rankup/samba/overlay/open-overlay.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type {
	FsgUnstartedMatchDetails,
	FsgUnstartedMatchDetailsParameters,
} from '../match-details/fsg-unstarted-match-details.js';

@customElement('fsg-matchday-not-started')
export class FsgMatchdayNotStarted extends LitElement {
	@property({ attribute: false })
	fixture?: Match[];

	private _onClickMatch(match: Match) {
		openOverlay<FsgUnstartedMatchDetails, FsgUnstartedMatchDetailsParameters>(
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
				margin: 3rem 0;
			}

			:host > #match:first-child {
				margin-top: 1.5rem;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-matchday-not-started': FsgMatchdayNotStarted;
	}
}
