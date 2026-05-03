import { Icons } from '../../../authenticated-icons.js';
import { msg } from '@lit/localize';
import ButtonStyles from '@rankup/samba/styles/button.css';
import LinkStyles from '@rankup/samba/styles/link.css';
import MarginStyles from '@rankup/samba/styles/margin.css';
import ResetStyles from '@rankup/samba/styles/reset.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rk-share-tournament')
export class RkShareTournament extends LitElement {
	private _onGoBackClick() {
		window.history.back();
	}

	private _onGoBackKeydown() {
		//
	}

	override render() {
		return html`
			<header>
				<button id="arrow" @click=${this._onGoBackClick} @keydown=${this._onGoBackKeydown} class="link--primary">${Icons('arrow-left', 20)}</button>
			</header>
			<main>
				<h1 class="text-bold">${msg('Invita a tus amigos', { id: 'apps.rankup.spa.pages.tournament.pages.rk.share.tournament.msg.l27c29' })}</h1>
				<p class="f3 mt-4 mb-4">${msg(`Invita a tus amigos compartiendo el enlace al pulsar el boton de Compartir o pasándoles el código de acceso único para acceder al torneo.`, { id: 'apps.rankup.spa.pages.tournament.pages.rk.share.tournament.msg.l28c31' })}</p>
				<div class="description">
					<button class="btn btn--primary btn--md">${msg('Compartir enlace', { id: 'apps.rankup.spa.pages.tournament.pages.rk.share.tournament.msg.l30c49' })} ${Icons('share', 20)}</button>
					<div class="tournament-code-description mt-6">
						<div>${msg('Código de acceso al torneo:', { id: 'apps.rankup.spa.pages.tournament.pages.rk.share.tournament.msg.l32c14' })}</div>
						<div class="tournament-code text-bold mt-2">PUI_KD</div>
					</div>
				</div>
			</main>
		`;
	}

	static override styles = [
		ButtonStyles,
		LinkStyles,
		MarginStyles,
		ResetStyles,
		TypographyStyles,
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
		.description {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			width: 100%;
		}
		.tournament-code-description {
			align-items: center;
			display: flex;
			flex-direction: column;
			margin-top: 1.5rem;
		}
		.tournament-code {
		}
		.btn--md {
			width: 100%;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-share-tournament': RkShareTournament;
	}
}
