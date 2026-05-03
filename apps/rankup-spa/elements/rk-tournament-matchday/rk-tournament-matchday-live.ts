import '../rk-match-row/rk-match-row.js';
import type { RkSbMatchPlayersBets, RkSbMatchPlayersBetsParameters } from '../score-bets/rk-sb-match-players-bets/rk-sb-match-players-bets.js';
import { openOverlay } from '@rankup/samba/overlay/open-overlay';
import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
// import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-tournament-matchday-live')
export class RkTournamentMatchdayLive extends LitElement {
	@property({ attribute: false }) fixture?: Match[];

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

	override render() {
		return html` ${this.fixture?.map(match => html` <rk-match-row id="match" @click=${() => this._onMatchClick(match)} .match=${match}></rk-match-row> `)} `;
	}

	static override styles = [
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
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-matchday-live': RkTournamentMatchdayLive;
	}
}
