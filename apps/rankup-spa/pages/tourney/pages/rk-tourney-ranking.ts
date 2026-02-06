import { Icons } from '../../../authenticated-icons.js';
import { msg } from '@lit/localize';
import { Task } from '@lit/task';
import { getCurrentTourneyId } from '../../../lib/utils/tourney-path.js';
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import { ITourneyRankingService } from '@rankup/rankup/domains/scoring/ranking/contracts/tourneyRanking.js';
import type { RankingEntry as UserRanking, TournamentRankingPage } from '@rankup/rankup/domains/scoring/ranking/contracts/types.js';
import ButtonStyles from '@rankup/samba/styles/button.css';
import LinkStyles from '@rankup/samba/styles/link.css';
import MarginStyles from '@rankup/samba/styles/margin.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export enum RankingType {
	SEASON = 1,
	MATCHDAY,
}

/**
 * @fires selected-ranking-changed
 */
@customElement('rk-tourney-ranking')
export class RkTourneyRanking extends LitElement {
	@property({ type: Boolean }) override hidden = true;

	@service(ITourneyRankingService) private readonly _tourneyService!: ITourneyRankingService;

	override shouldUpdate(): boolean {
		return !this.hidden;
	}

	@property({ type: Number }) selectedRanking = RankingType.MATCHDAY;

	private _ranking = new Task(
		this,
		() => {
			const tournamentId = getCurrentTourneyId() ?? 'fj_rew';
			return this._tourneyService.getTournamentRanking({ tournamentId });
		},
		() => [this.selectedRanking],
	);

	private _onSelectRankingKeydown() {
		//
	}

	private _onSelectRankingClick(evt: MouseEvent) {
		const selectedRanking = (evt.target as HTMLButtonElement).getAttribute('name');
		if (selectedRanking) {
			this.selectedRanking = Number(selectedRanking);
			this.dispatchEvent(
				new CustomEvent('selected-ranking-changed', {
					detail: { selectedRanking: Number(selectedRanking) },
				}),
			);
		}
	}

	private _renderRankingRow(entry: UserRanking) {
		const medals = [null, 'gold-medal.svg', 'silver-medal.svg', 'bronze-medal.svg'];
		const avatarUrl = entry.user.pictureUrl ?? '/assets/avatars/rocket.svg';
		return html`
			<div class="row text-bold mt-2 mb-2">
				<img class="avatar" src="${avatarUrl}" alt="Avatar" />
				<div class="username">${entry.user.username}</div>
				<div class="position f3">
					${medals[entry.position]
						? html`<img width="42" height="42" src="/assets/images/${medals[entry.position]}" alt="Player position ${entry.position}" />`
						: html`<span class="text-bold">${entry.position}</span> `}
				</div>
				<div class="points">${entry.points}</div>
			</div>
		`;
	}

	private _renderRanking(ranking: UserRanking[]) {
		if (ranking.length === 0) {
			return html``;
		}
		if (this.selectedRanking === RankingType.SEASON) {
			const winner = ranking.slice(0, 1)[0];
			const winnerAvatarHref = winner?.user.pictureUrl ?? '/assets/avatars/rocket.svg';
			const winnerBackgroundGradient = `linear-gradient(0deg, rgba(4, 138, 123, 0.80) 0%, rgba(0, 104, 87, 0.80) 100%)`;
			return html`
				<div class="row-season-winner f1 text-bold">
					<div class="row-season-winner-bg" style="background-image: ${winnerBackgroundGradient}">
						<div class="row-season-winner-bg-avatar" style="background-image: url(${winnerAvatarHref})"></div>
					</div>
					${this._renderRankingRow(winner)}
				</div>
				<div class="ranking-without-winner">${ranking.slice(1, ranking.length).map(user => this._renderRankingRow(user))}</div>
			`;
		}
		return ranking.map(user => this._renderRankingRow(user));
	}

	override render() {
		return html`
			<div class="main">
				${this.selectedRanking === RankingType.MATCHDAY
					? html`
						<div class="matchday-status text-bold">
							<div class="circle"></div>
							${msg('Jornada en juego', { id: 'apps.rankup.spa.pages.tourney.pages.rk.tourney.ranking.msg.l105c10' })}
						</div>
					`
					: ''}
				<div class="ranking">
					${this._ranking.render({
						pending: () => html``,
						complete: (page: TournamentRankingPage) => this._renderRanking(page.items),
					})}
				</div>
				<div class="buttons mb-3" @click=${this._onSelectRankingClick} @keydown=${this._onSelectRankingKeydown}>
					<button class="btn btn--primary btn--s f5" name=${RankingType.SEASON} ?selected=${this.selectedRanking === RankingType.SEASON}>${msg('Temporada', { id: 'apps.rankup.spa.pages.tourney.pages.rk.tourney.ranking.msg.l116c135' })}</button>
					<button class="btn btn--primary btn--s f5 matchday-btn" name=${RankingType.MATCHDAY} ?selected=${this.selectedRanking === RankingType.MATCHDAY}>
						${msg('Jornada 8', { id: 'apps.rankup.spa.pages.tourney.pages.rk.tourney.ranking.msg.l118c9' })}
						<span id="chevron">${Icons('chevron-down', 16)}</span>
					</button>
				</div>
			</div>
		`;
	}

	static override styles = [
		ButtonStyles,
		LinkStyles,
		TypographyStyles,
		MarginStyles,
		css`
		:host {
			display: block;
			width: 100%;
		}
		.main {
			align-items: center;
			background: var(--color-canvas-default);
			color: var(--color-fg-default);
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			height: 100%;
			width: 100%;
			box-sizing: border-box;
		}
		.row {
			width: 100%;
			display: grid;
			grid-template-areas: 'position avatar username points';
			grid-template-columns: 36px 45px auto 50px;
			padding: 1rem 2rem;
			box-sizing: border-box;
			align-items: center;
			grid-column-gap: 1.5rem;
		}
		.row-season-winner {
			align-items: flex-end;
			color: var(--color-season-winner-text);
			display: flex;
			height: 20.5rem;
			position: absolute;
			text-shadow: 0px 1px 0px hsl(0deg 0% 0% / 14%);
			top: 0px;
			width: 100%;
			font-weight: bold;
		}
		.matchday-status {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: 2rem 2rem 0.5rem 2rem;
		}
		.circle {
			background-color: var(--color-scale-green-5);
			width: 0.6rem;
			height: 0.6rem;
			border-radius: 1rem;
		}
		.row-season-winner .row {
			z-index: 2;
		}
		.row-season-winner-bg {
			width: 100%;
			height: 100%;
			background-position: top;
			position: absolute;
			z-index: 2;
			background-size: cover;
			pointer-events: none;
		}
		.row-season-winner-bg-avatar {
			background-position: top;
			background-size: cover;
			filter: opacity(0.3);
			height: 100%;
			margin: 0 auto;
			max-width: 65.5rem;
			pointer-events: none;
			width: 100%;
			z-index: 2;
		}
		.ranking {
			width: 100%;
			flex: 1;
		}
		/* row season winner + rk-tourney-header height */
		.ranking-without-winner {
			padding-top: calc(20.5rem - 7rem);
		}
		:host(.router-page-season-ranking) .ranking-without-winner {
			padding-top: 20.5rem;
		}
		.position {
			align-items: center;
			display: flex;
			grid-area: position;
			justify-content: center;
			text-align: center;
		}
		.avatar {
			grid-area: avatar;
		}
		.username {
			grid-area: username;
			text-align: left;
		}
		.points {
			grid-area: points;
			text-align: right;
		}
		.buttons {
			display: flex;
			align-items: center;
			gap: 1rem;
			width: 100%;
			justify-content: center;
		}
		.buttons button {
			color: var(--color-fg-muted);
			border-color: var(--color-border-subtle);
		}
		.buttons [selected] {
			color: var(--color-scale-green-6);
			background-color: var(--color-scale-green-0);
			border-color: var(--color-scale-green-6);
		}
		.matchday-btn {
			position: relative;
		}
		#chevron {
			position: absolute;
			right: 7px;
			filter: opacity(0.8);
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tourney-ranking': RkTourneyRanking;
	}
}
