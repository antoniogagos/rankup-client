import '../score-bets/rk-sb-match-details/rk-sb-unstarted-match-details.js';
import '../score-bets/rk-sb-bet-match/rk-sb-bet-match.js';
import type { RkSbUnStartedMatchDetails, RkSbUnStartedMatchDetailsParameters } from '../score-bets/rk-sb-match-details/rk-sb-unstarted-match-details.js';
import { openOverlay } from '@rankup/samba/overlay/open-overlay';
import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-tournament-matchday-not-started')
export class RkTournamentMatchdayNotStarted extends LitElement {
	@property({ attribute: false }) fixture?: Match[];

	private _onClickMatch(match: Match) {
		openOverlay<RkSbUnStartedMatchDetails, RkSbUnStartedMatchDetailsParameters>(
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

	override render() {
		return html`
			${this.fixture?.map(
				match => html`
					<rk-sb-bet-match
						id="match"
						@click=${() => this._onClickMatch(match)}
						.match=${match}
					></rk-sb-bet-match>
				`,
			)}
		`;
	}

	static override styles = [
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
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-matchday-not-started': RkTournamentMatchdayNotStarted;
	}
}
