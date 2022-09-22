import '../bet-match/fsg-bet-match.js';

import { msg } from '@lit/localize';
import type { Match } from '@rankup/common/football/types';
import {
	arrowLeftIcon,
	calendarIcon,
	planeIcon,
	targetIcon,
	tvIcon,
	whistleIcon,
} from '@rankup/samba/icons.js';
import type { OverlayController } from '@rankup/samba/overlay/types.js';
import ButtonStyles from '@rankup/samba/styles/button-css.js';
import LinkStyles from '@rankup/samba/styles/link-css.js';
import MarginStyles from '@rankup/samba/styles/margin-css.js';
import TypographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface FsgUnstartedMatchDetailsParameters {
	match: Match;
}

const lastMatches = [
	{
		team: {
			teamId: 'team-1',
			name: 'Real Betis',
		},
		matchId: 'fday',
		opponentId: {
			teamId: 'team-2',
			name: 'Sevilla',
		},
		date: Date.now(),
		home: true,
		result: '2-2',
	},
	{
		team: {
			teamId: 'team-1',
			name: 'Real Betis',
		},
		matchId: 'fada',
		opponentId: {
			teamId: 'team-4',
			name: 'Real Madrid',
		},
		date: Date.now(),
		home: true,
		result: '1-0',
	},
	{
		team: {
			teamId: 'team-1',
			name: 'Real Betis',
		},
		matchId: 'fda3',
		opponentId: {
			teamId: 'team-3',
			name: 'Barcelona',
		},
		date: Date.now(),
		home: false,
		result: '1-3',
	},
	{
		team: {
			teamId: 'team-1',
			name: 'Real Betis',
		},
		matchId: 'fdfa',
		opponentId: {
			teamId: 'team-5',
			name: 'Alavés',
		},
		date: Date.now(),
		home: true,
		result: '4-1',
	},
];

@customElement('fsg-unstarted-match-details')
export class FsgUnstartedMatchDetails
	extends LitElement
	implements Partial<FsgUnstartedMatchDetailsParameters>
{
	overlayController?: OverlayController<this>;

	@property({ attribute: false })
	match: Match | undefined;

	private _onClickGoBack() {
		this.overlayController?.close();
	}

	render() {
		return html`
			<header>
				<button id="arrow" @click=${this._onClickGoBack} class="link--primary">
					${arrowLeftIcon}
				</button>
			</header>
			<main>
				${lastMatches.length}
				<h1 class="text-bold">${msg('Detalles del partido')}</h1>
				<div class="match-date">Hoy 21:00</div>
				<fsg-bet-match class="match" .match=${this.match}></fsg-bet-match>
				<section class="odds">
					<div class="section-title mb-3">${tvIcon} Probabilidad de victoria</div>
					<div class="section-content f5">
						<div class="home-odds odd winner" style="width: 43%">
							<div class="odd-pct-bar">
								<svg width="12" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill="currentColor" d="m6.537 0 5.248 2.909-6.506 11.737L.03 11.737z" />
								</svg>
							</div>
							<div class="odd-desc text-bold">
								Sevilla
								<span class="odds-number">43%</span>
							</div>
						</div>
						<div class="draw-odds odd" style="width: 30%">
							<div class="odd-pct-bar">
								<svg width="12" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path fill="currentColor" d="m6.537 0 5.248 2.909-6.506 11.737L.03 11.737z" />
								</svg>
							</div>
							<div class="odd-desc text-bold">
								${msg('Empate')}
								<span class="odds-number">30%</span>
							</div>
						</div>
						<div class="away-odds odd loser" style="width: 27%">
							<div class="odd-pct-bar"></div>
							<div class="odd-desc text-bold">
								Villareal
								<span class="odds-number">27%</span>
							</div>
						</div>
					</div>
				</section>
				<section class="standings">
					<div class="section-title mb-3">${targetIcon} ${msg('Temporada actual')}</div>
					<div class="section-content">
						<div class="row">
							<img width="42" height="42" src="/assets/teams/sevilla.png" alt="home logo" />
							<img width="42" height="42" src="/assets/teams/villareal.png" alt="away logo" />
						</div>
						<div class="row row-info">
							<div class="row-info--number">3º</div>
							<div class="row-info--text">${msg('Posición')}</div>
							<div class="row-info--number winner">2º</div>
						</div>
						<div class="row row-info">
							<div class="row-info--number">9</div>
							<div class="row-info--text">${msg('Victorias')}</div>
							<div class="row-info--number">9</div>
						</div>
						<div class="row row-info">
							<div class="row-info--number">3</div>
							<div class="row-info--text">${msg('Empates')}</div>
							<div class="row-info--number winner">4</div>
						</div>
						<div class="row row-info">
							<div class="row-info--number">4</div>
							<div class="row-info--text">${msg('Derrotas')}</div>
							<div class="row-info--number winner">2</div>
						</div>
						<div class="row row-info">
							<div class="row-info--number winner">26</div>
							<div class="row-info--text">${msg('Goles marcados')}</div>
							<div class="row-info--number">25</div>
						</div>
						<div class="row row-info">
							<div class="row-info--number winner">18</div>
							<div class="row-info--text">${msg('Goles recibidos')}</div>
							<div class="row-info--number">11</div>
						</div>
					</div>
				</section>
				<section class="last-matches">
					<div class="section-title mb-3">${calendarIcon} ${msg('Últimos partidos en LaLiga')}</div>
					<div class="section-content">
						<div class="left-column column">
							<img width="42" height="42" src="/assets/teams/sevilla.png" alt="home logo" />
							<div class="rows">
								<div class="row">
									<div class="f5 team-name">Villareal</div>
									<div class="result">?</div>
								</div>
								<div class="row">
									${planeIcon}
									<div class="f5 team-name">Barcelona</div>
									<div class="result draw">1-1</div>
								</div>
								<div class="row">
									<div class="f5 team-name">Levante</div>
									<div class="result winner">3-1</div>
								</div>
								<div class="row">
									${planeIcon}
									<div class="f5 team-name">Elche</div>
									<div class="result winner">0-3</div>
								</div>
								<div class="row">
									<div class="f5 team-name">Betis</div>
									<div class="result lose">0-2</div>
								</div>
								<div class="row">
									${planeIcon}
									<div class="f5 team-name">Atlético</div>
									<div class="result lose">3-0</div>
								</div>
							</div>
						</div>
						<div class="right-column column">
							<img width="42" height="42" src="/assets/teams/villareal.png" alt="away logo" />
							<div class="rows">
								<div class="row row-reversed">
									<div class="result">?</div>
									<div class="f5 team-name">Sevilla</div>
								</div>
								<div class="row row-reversed">
									<div class="result draw">1-1</div>
									<div class="f5 team-name">Osasuna</div>
								</div>
								<div class="row row-reversed">
									<div class="result winner">2-1</div>
									<div class="f5 team-name">Atlético</div>
								</div>
								<div class="row row-reversed">
									${planeIcon}
									<div class="result winner">0-2</div>
									<div class="f5 team-name">Alavés</div>
								</div>
								<div class="row row-reversed">
									${planeIcon}
									<div class="result lose">2-0</div>
									<div class="f5 team-name">Real Madrid</div>
								</div>
								<div class="row row-reversed">
									<div class="result draw">2-2</div>
									<div class="f5 team-name">Real Sociedad</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section class="h2h">
					<div class="section-title mb-3">${whistleIcon} ${msg('Enfrentamientos anteriores')}</div>

					<div class="section-content">
						<fsg-match-row .match=${this.match}></fsg-match-row>
					</div>
				</section>
			</main>
		`;
	}

	static styles = [
		LinkStyles,
		ButtonStyles,
		TypographyStyles,
		MarginStyles,
		css`
			:host {
				background: #fff;
				display: inline-block;
				height: 100%;
				overflow: scroll;
				width: 100%;
				box-sizing: border-box;
				padding-bottom: 8rem;
			}
			:host(:focus-visible) {
				outline: none;
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
				padding: 0 2rem;
				width: 100%;
				max-width: 450px;
				margin: 0 auto;
				box-sizing: border-box;
			}
			#arrow {
				display: flex;
			}
			.match {
				margin-top: 3rem;
			}
			.section-title {
				align-items: center;
				display: flex;
				font-size: 1.6rem;
				font-weight: bold;
				gap: 0.5rem;
				margin-top: 4rem;
			}
			.section-content {
				display: flex;
				justify-content: space-between;
			}
			.odd {
				width: 100%;
				box-sizing: border-box;
			}
			.odd-desc {
				margin-top: 0.8rem;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.home-odds .odd-pct-bar {
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
			}
			.away-odds .odd-pct-bar {
				border-top-right-radius: 4px;
				border-bottom-right-radius: 4px;
			}
			.winner .odds-number {
				color: rgb(24 203 31);
			}
			.draw-odds .odds-number {
				color: #74b0bf;
			}
			.loser .odds-number {
				color: #f33838;
			}
			.winner .odd-pct-bar {
				background: rgb(24 203 31);
			}
			.draw-odds .odd-pct-bar {
				background: #74b0bf;
			}
			.loser .odd-pct-bar {
				background: #f33838;
			}
			.away-odds .odd-desc {
				justify-content: flex-end;
			}
			.odds-number {
				display: block;
				font-style: italic;
			}
			.odd-pct-bar {
				background: red;
				height: 0.8rem;
				position: relative;
				width: 100%;
			}
			.odd-pct-bar svg {
				bottom: 0;
				color: #fff;
				position: absolute;
				right: -6px;
				top: -3px;
				z-index: 2;
			}
			.away-odds {
				text-align: right;
			}

			.standings .section-content {
				align-items: center;
				flex-direction: column;
				justify-content: center;
				gap: 1.5rem;
			}
			.standings .row {
				display: flex;
				justify-content: space-between;
				width: 225px;
			}
			.standings .row-info {
				box-sizing: border-box;
				font-weight: bold;
				padding: 0 0.5rem;
			}
			.row-info--text {
				color: rgba(21, 34, 65, 0.7);
			}
			.row-info--number {
				padding: 0 0.8rem;
				border-radius: 4px;
			}
			.row-info--number.winner {
				background-color: #c4ffc6;
			}

			.last-matches .section-content {
				gap: 5rem;
				justify-content: center;
				margin: 0px auto;
				padding: 0px 2rem;
			}
			.last-matches .column {
				display: flex;
				flex-direction: column;
				flex: 1 1 0;
				width: 0;
			}
			.last-matches .left-column img {
				margin-left: auto;
			}
			.last-matches .rows {
				margin-top: 1rem;
				font-weight: bold;
			}
			.last-matches .row {
				align-items: center;
				display: flex;
				gap: 1rem;
				justify-content: space-between;
				margin-bottom: 0.8rem;
				position: relative;
			}
			.last-matches .row svg {
				bottom: 0;
				left: -2rem;
				margin: auto;
				position: absolute;
				top: 0;
			}
			.last-matches .row-reversed svg {
				bottom: 0;
				left: unset;
				right: -2rem;
				margin: auto;
				position: absolute;
				top: 0;
			}
			.last-matches .result {
				border-radius: 4px;
				color: #282828c7;
				box-sizing: border-box;
				padding: 0.2rem 0.8rem;
				text-align: center;
				white-space: nowrap;
				width: 4rem;
			}
			.last-matches .result.winner {
				background: #c4ffc6;
			}
			.last-matches .result.lose {
				background: #fbe1e1;
			}
			.last-matches .result.draw {
				background: #d5f7ff;
			}
			.last-matches .team-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-unstarted-match-details': FsgUnstartedMatchDetails;
	}
}
