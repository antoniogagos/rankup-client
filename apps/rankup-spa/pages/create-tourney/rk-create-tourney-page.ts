import { Icons } from '../../authenticated-icons.js';
import { path } from '../../lib/localization/rk-url-paths.js';
import { msg } from '@lit/localize';
import { ITourneyCoreService } from '@rankup/rankup/domains/tournaments/core/contracts/tourneyCore.js';
import type { CreateTournamentRequest } from '@rankup/rankup/domains/tournaments/core/contracts/types.js';
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import ButtonStyles from '@rankup/samba/styles/button.css';
import LinkStyles from '@rankup/samba/styles/link.css';
import MarginStyles from '@rankup/samba/styles/margin.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

type LeagueOption = {
	assetId: string;
	competitionId: string;
	label: string;
	seasonId: string;
};

const leagueOptions: LeagueOption[] = [
	{
		assetId: 'laliga',
		competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
		label: 'La Liga',
		seasonId: '2024',
	},
	{
		assetId: 'champions-league',
		competitionId: 'FOOTBALL_CHAMPIONS_LEAGUE',
		label: 'Champions League',
		seasonId: '2024',
	},
	{
		assetId: 'premier-league',
		competitionId: 'FOOTBALL_UK_LEAGUE_1',
		label: 'Premier League',
		seasonId: '2024',
	},
];

@customElement('rk-create-tourney-page')
export class RkCreateTourneyPage extends LitElement {
	@service(ITourneyCoreService) private readonly _tourneyService!: ITourneyCoreService;

	@state() private _selectedCompetitionId: string | null = null;

	@state() private _tourneyName = '';

	@state() private _isSubmitting = false;

	@state() private _errorMessage: string | null = null;

	private _onClickGoBack() {
		window.history.back();
	}

	private _onSelectCompetition(event: Event) {
		const target = event.currentTarget as HTMLInputElement | null;
		this._selectedCompetitionId = target?.value ?? null;
		this._errorMessage = null;
	}

	private _onNameInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement | null;
		this._tourneyName = target?.value ?? '';
		this._errorMessage = null;
	}

	private _getSelectedLeague(): LeagueOption | null {
		if (!this._selectedCompetitionId) {
			return null;
		}
		return leagueOptions.find(option => option.competitionId === this._selectedCompetitionId) ?? null;
	}

	private _buildRequest(option: LeagueOption, name: string): CreateTournamentRequest {
		return {
			name,
			visibility: 'private',
			discoverability: 'unlisted',
			sportId: 'football',
			gameModeId: 'scorePrediction',
			modality: 'season',
			timing: {
				competitionId: option.competitionId,
				seasonId: option.seasonId,
			},
			joinPolicy: {
				joinMode: 'code',
				joinMidSeasonAllowed: true,
				locked: false,
			},
		};
	}

	private _navigateTo(pathname: string) {
		const root = this.getRootNode();
		if (root instanceof ShadowRoot) {
			const router = root.querySelector('app-router') as { navigate?: (path: string) => void } | null;
			router?.navigate?.(pathname);
			return;
		}
		window.location.assign(pathname);
	}

	private async _onCreateTournament() {
		if (this._isSubmitting) {
			return;
		}
		const league = this._getSelectedLeague();
		const name = this._tourneyName.trim();
		if (!league || !name) {
			this._errorMessage = msg('Completa todos los campos para continuar.', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l114c25' });
			return;
		}
		this._isSubmitting = true;
		this._errorMessage = null;
		try {
			const service = this._tourneyService;
			if (!service) {
				this._errorMessage = msg('Servicio no disponible. Inténtalo de nuevo.', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l122c26' });
				return;
			}
			const request = this._buildRequest(league, name);
			await service.createTournament(request);
			window.dispatchEvent(new CustomEvent('rk-tourney-list-refresh'));
			this._navigateTo(path('TOURNEYS'));
		} catch (error) {
			console.error(error);
			this._errorMessage = msg('No se pudo crear el torneo. Inténtalo de nuevo.', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l131c25' });
		} finally {
			this._isSubmitting = false;
		}
	}

	override render() {
		const canSubmit = Boolean(this._selectedCompetitionId && this._tourneyName.trim().length > 0);
		const buttonLabel = this._isSubmitting ? msg('Creando...', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l139c44' }) : msg('Empezar liga', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l139c64' });
		return html`
			<header>
				<button id="arrow" @click=${this._onClickGoBack} class="link--primary">${Icons('arrow-left', 20)}</button>
			</header>
			<main>
				<h1 class="text-bold">${msg('Crear una liga', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l145c29' })}</h1>
				<div class="f3 mt-5 mb-3">${msg('Escoge una competición:', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l146c33' })}</div>
				${leagueOptions.map(
					option => html`
						<div class="league-container f4 text-bold">
							<label for=${option.competitionId}>
								<img src="/assets/images/${option.assetId}.svg" width="42" alt=${option.label} />
								${option.label}
							</label>
							<input
								type="radio"
								id=${option.competitionId}
								name="competition"
								.value=${option.competitionId}
								?checked=${this._selectedCompetitionId === option.competitionId}
								@change=${this._onSelectCompetition}
							/>
						</div>
					`,
				)}
				<p class="f4 mt-5">${msg('Introduce el nombre de la liga.', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l165c26' })}</p>
				<input
					class="mb-3"
					id="textInput"
					type="text"
					placeholder=${msg('Nombre de la liga', { id: 'apps.rankup.spa.pages.create.tourney.rk.create.tourney.page.msg.l170c20' })}
					.value=${this._tourneyName}
					@input=${this._onNameInput}
				/>
				${this._errorMessage ? html`<p class="error mt-3">${this._errorMessage}</p>` : html``}
				<button class="btn btn--primary btn--lg mt-6" ?disabled=${!canSubmit || this._isSubmitting} @click=${this._onCreateTournament}>
					${buttonLabel} ${this._isSubmitting ? html`` : html`${Icons('arrow-right', 16)}`}
				</button>
			</main>
		`;
	}

	static override styles = [
		ButtonStyles,
		LinkStyles,
		TypographyStyles,
		MarginStyles,
		css`
		:host {
			align-items: flex-start;
			background: var(--color-canvas-default);
			box-sizing: border-box;
			color: var(--color-fg-default);
			display: flex;
			flex-direction: column;
			height: 100%;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: 2;
		}
		header {
			align-items: center;
			box-sizing: border-box;
			display: flex;
			height: 6.6rem;
			justify-content: flex-start;
			padding: 2rem;
			width: 100%;
		}
		main {
			box-sizing: border-box;
			margin: 0 auto;
			max-width: 450px;
			padding: 0 2rem;
			width: 100%;
		}
		label {
			align-items: center;
			cursor: default;
			display: flex;
			gap: 0.5rem;
			pointer-events: all;
			width: 100%;
		}
		.league-container {
			align-items: center;
			background: var(--color-canvas-secondary);
			border-radius: 0.8rem;
			border: 2px solid var(--color-border-muted);
			box-sizing: border-box;
			display: flex;
			height: 4.6rem;
			justify-content: flex-start;
			margin: 1.75rem 0;
			padding: 0.5rem 1.5rem;
			width: 100%;
		}
		#textInput {
			background: none;
			box-sizing: border-box;
			color: var(--color-fg-default);
			font-family: inherit;
			font-size: 1.4rem;
			font-weight: bold;
			padding: 1rem;
			width: 100%;
			border: none;
			border-bottom: 3px solid var(--color-canvas-inverted);
		}
		#textInput::placeholder {
			color: var(--color-fg-subtle);
		}
		.error {
			color: var(--color-danger-fg, #b91c1c);
			font-weight: 600;
		}
		.btn {
			width: 100%;
		}
		.btn[disabled] {
			cursor: not-allowed;
			opacity: 0.6;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-create-tourney-page': RkCreateTourneyPage;
	}
}
