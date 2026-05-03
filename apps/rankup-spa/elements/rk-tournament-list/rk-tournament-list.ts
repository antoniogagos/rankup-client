import { Icons } from '../../authenticated-icons.js';
import { AppPaths, path } from '../../lib/localization/rk-url-paths.js';
import { Task } from '@lit/task';
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import { ITournamentCoreService } from '@rankup/rankup/domains/tournaments/core/contracts/tournamentCore.js';
import type { MyTournamentItem, MyTournamentPage } from '@rankup/rankup/domains/tournaments/core/contracts/types.js';
import buttonStyles from '@rankup/samba/styles/button.css';
import marginStyles from '@rankup/samba/styles/margin.css';
import resetStyles from '@rankup/samba/styles/reset.css';
import tournamentCardStyles from '@rankup/samba/styles/tournament-card.css';
import typographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rk-tournament-list')
export class RkTournamentList extends LitElement {
	@service(ITournamentCoreService) private readonly _tournamentService!: ITournamentCoreService;

	private _tournaments = new Task(
		this,
		() => this._tournamentService.listMyTournaments(),
		() => [null],
	);

	private _onRefreshRequested = () => {
		this._tournaments.run();
	};

	override connectedCallback(): void {
		super.connectedCallback?.();
		this._tournaments.run();
		window.addEventListener('rk-tournament-list-refresh', this._onRefreshRequested);
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback?.();
		window.removeEventListener('rk-tournament-list-refresh', this._onRefreshRequested);
	}

	private _getCompetitionMeta(sportId: string) {
		switch (sportId) {
			case 'football':
				return { styleId: 'football', icon: 'rk-logo-with-bg', label: 'Football logo' };
			default:
				return { styleId: 'default', icon: 'rk-logo-with-bg', label: 'Rankup logo' };
		}
	}

	private _getMedalAsset(position: number) {
		if (position === 1) return 'gold-medal';
		if (position === 2) return 'silver-medal';
		if (position === 3) return 'bronze-medal';
		return null;
	}

	private _renderTournamentCard(tournament: MyTournamentItem) {
		const { styleId, icon, label } = this._getCompetitionMeta(tournament.tournament.sportId);
		const medal = this._getMedalAsset(0);
		const href = path('TOURNAMENT', `${tournament.tournament.tournamentId}/${AppPaths.MATCHDAY}`);
		return html`
			<a href=${href} class="tournament-card" competitionId=${styleId}>
				<div><img src="/assets/images/${icon}.svg" alt="${label}" /></div>
				<div class="tournament-description">
					<div class="tournament-name">${tournament.tournament.name}</div>
					<span>${Icons('person', 10)} ${tournament.tournament.memberCount}</span>
				</div>
				<div>${medal ? html`<img src="/assets/images/${medal}.svg" alt="${medal} medal" />` : html``}</div>
				<div class="offset-shadows">
					<div></div>
					<div></div>
				</div>
			</a>
		`;
	}

	private _renderTournaments(tournaments: MyTournamentItem[]) {
		return html`
			<main class="mt-4 mb-3">${tournaments.map(tournament => this._renderTournamentCard(tournament))}</main>
			<img id="RkLogoSplash" src="/assets/images/rk-logo-splash.svg" alt="Rankup logo" />
		`;
	}

	override render() {
		// <!-- <div path=${path('TOURNAMENT') + '/:id'} animation="opacity">Tournament Foo</div> -->
		//   <!-- <main class="mt-4 mb-3">
		//     <div class="empty-state-message mt-6">
		//       <h2>${msg('No estás participando en ninguna liga')}</h2>
		//       <div class="empty-state-buttons mt-4">
		//         <button class="btn btn--primary">
		//           ${msg('Crear liga')} ${Icons('create-tournament', 18)}
		//         </button>
		//         <button class="btn btn--primary">
		//           ${msg('Unirse a una liga')} ${Icons('join-tournament', 18)}
		//         </button>
		//       </div>
		//     </div> -->
		return this._tournaments.render({
			pending: () => html``,
			complete: (page: MyTournamentPage) => this._renderTournaments(page.items),
		});
	}

	static override styles = [
		resetStyles,
		typographyStyles,
		buttonStyles,
		tournamentCardStyles,
		marginStyles,
		css`
		:host {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 40px;
			margin-top: 3rem;
		}
		main {
			align-items: center;
			background: var(--color-header-bg);
			box-sizing: border-box;
			color: var(--color-header-text);
			display: flex;
			flex-direction: column;
			gap: 3.5rem;
			justify-content: space-between;
			width: 100%;
			z-index: 2;
			height: 100%;
		}
		#RkLogoSplash {
			bottom: 0;
			left: 0;
			margin: 0 auto;
			max-width: 32.4rem;
			position: absolute;
			right: 0;
			width: 100%;
			z-index: 0;
		}
		.empty-state-message {
			align-items: center;
			display: flex;
			flex-direction: column;
		}
		.empty-state-message h2 {
			max-width: 30rem;
			text-align: center;
		}
		.empty-state-buttons {
			align-items: center;
			display: flex;
			flex-direction: column;
			gap: 1.2rem;
			justify-content: center;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-list': RkTournamentList;
	}
}
