import '@rankup/samba/toggle-input/toggle-input';
import { Icons } from '../../../authenticated-icons.js';
import { relativePath } from '../../../lib/localization/rk-url-paths.js';
import { getCurrentTourneyBase } from '../../../lib/utils/tourney-path.js';
import { msg } from '@lit/localize';
import ButtonStyles from '@rankup/samba/styles/button.css';
import FormControlStyles from '@rankup/samba/styles/form-control.css';
import LinkStyles from '@rankup/samba/styles/link.css';
import MarginStyles from '@rankup/samba/styles/margin.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-tourney-settings')
export class RkTourneySettings extends LitElement {
	@property({ type: Boolean }) override hidden = true;

	override shouldUpdate(): boolean {
		return !this.hidden;
	}

	private _onGoBackKeydown() {
		//
	}

	private _onGoBackClick() {
		window.history.back();
	}

	override render() {
		const tourneyBase = getCurrentTourneyBase();
		return html`
			<header>
				<button id="arrow" @click=${this._onGoBackClick} @keydown=${this._onGoBackKeydown} class="link--primary">${Icons('arrow-left', 20)}</button>
			</header>
			<main>
				<h1 class="text-bold">${msg('Ajustes')}</h1>
				<section>
					<p class="section-title text-bold f3 mt-6 mb-3">${Icons('bell', 24)} ${msg('Notificaciones')}</p>
					<div class="section-list f5">
						<div class="list--item">
							<div class="list--item-block f4">
								<!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/finished-match.webp"
                  alt="Finished match" /> -->
								${msg('Partidos finalizados')}
							</div>
							<toggle-input tabindex="0"></toggle-input>
						</div>
						<div class="list--item">
							<div class="list--item-block f4">
								<!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/postponed-match.webp"
                  alt="Postponed match" /> -->
								${msg('Partidos postpuestos a punto de comenzar')}
							</div>
							<toggle-input tabindex="0"></toggle-input>
						</div>
						<div class="list--item">
							<div class="list--item-block f4">
								<!-- <img width="28" height="28" src="/assets/images/goal.webp" alt="Goal" /> -->
								${msg('Goles en vivo')}
							</div>
							<toggle-input tabindex="0"></toggle-input>
						</div>
						<div class="list--item">
							<div class="list--item-block f4">
								<!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/finished-matchday.webp"
                  alt="Finished matchday" /> -->
								${msg('Jornada finalizada')}
							</div>
							<toggle-input tabindex="0"></toggle-input>
						</div>
						<div class="list--item">
							<div class="list--item-block f4">
								<!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/new-messages.webp"
                  alt="New message" /> -->
								${msg('Nuevos mensajes en el chat')}
							</div>
							<toggle-input tabindex="0"></toggle-input>
						</div>
					</div>
				</section>
				<div class="buttons mt-6">
					<a class="btn btn--primary btn--md" href=${tourneyBase + relativePath('RULES_TOURNEY')}> ${msg('Ver sistema de puntuación')} ${Icons('paper', 24)} </a>
					<button class="btn btn--primary btn--md btn--danger">${msg('Abandonar torneo')} ${Icons('leave', 20)}</button>
				</div>
			</main>
		`;
	}

	static override styles = [
		ButtonStyles,
		LinkStyles,
		TypographyStyles,
		MarginStyles,
		FormControlStyles,
		css`
		:host {
			align-items: flex-start;
			background: var(--color-canvas-default);
			box-sizing: border-box;
			color: var(--color-fg-default);
			display: block;
			display: flex;
			flex-direction: column;
			height: 100%;
			position: absolute;
			top: 0;
			width: 100%;
			z-index: 10;
		}
		header {
			width: 100%;
			box-sizing: border-box;
			height: 6.6rem;
			padding: 2rem;
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}
		main {
			padding: 0 2rem;
			width: 100%;
			max-width: 450px;
			margin: 0 auto;
			box-sizing: border-box;
		}
		.section-title {
			align-items: center;
			display: flex;
			font-weight: bold;
			justify-content: flex-start;
			gap: 0.4rem;
		}
		.section-list {
			margin-right: 0.8rem;
			padding: 0 1rem;
		}
		.list--item {
			align-items: flex-start;
			display: flex;
			gap: 2rem;
			justify-content: space-between;
			margin-bottom: 1.2rem;
		}
		.list--item-block {
			display: flex;
			align-items: center;
			gap: 1.5rem;
		}
		.buttons {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			justify-content: center;
			width: 100%;
		}
		.btn {
			width: fit-content;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tourney-settings': RkTourneySettings;
	}
}
