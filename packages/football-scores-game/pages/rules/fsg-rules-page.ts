import { msg } from '@rankup/common/i18n/localize.js';
import ButtonStyles from '@rankup/samba/styles/buttons-css.js';
import LinkStyles from '@rankup/samba/styles/links-css.js';
import MarginStyles from '@rankup/samba/styles/margin-css.js';
import TypographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

@customElement('fsg-rules-page')
export class FsgRulesPage extends LitElement {
	render() {
		return html`
			<h1 class="text-bold">${msg('Sistema de puntuación')}</h1>
			<p class="f3 mt-4 mb-4">
				${msg(
					`Al finalizar cada partido, se calcularán los puntos para ese partido.
            Según tu pronóstico y el resultado final tendrás una determinada puntuación.`,
				)}
			</p>
			<div class="f3 description mt-4">
				${msg('Al acertar el...')}
				<ul class="rules">
					<li>
						<span class="rule-text">Ganador del partido</span>
						<span class="rule-points text-bold positive">+8</span>
					</li>
					<li>
						<span class="rule-text">Resultado exacto</span>
						<span class="rule-points text-bold positive">+6</span>
					</li>
					<li>
						<span class="rule-text">Goles exactos de un equipo</span>
						<span class="rule-points text-bold positive">+2</span>
					</li>
					<li>
						<span class="rule-text">Fallar goles exactos de ambos equipos (excepto empates)</span>
						<span class="rule-points text-bold negative">-2</span>
					</li>
				</ul>
				<img src="/assets/images/fsg-live-match-card.png" alt="" />
			</div>
		`;
	}

	static styles = [
		ButtonStyles,
		LinkStyles,
		TypographyStyles,
		MarginStyles,
		css`
			:host {
				display: flex;
				align-items: flex-start;
				flex-direction: column;
				padding: 0 2rem;
			}
			p {
				max-width: 40rem;
				text-align: left;
			}
			.rules li {
				display: list-item;
				align-items: center;
				margin-bottom: 1.5rem;
				gap: 1.5rem;
				margin-left: 2rem;
			}
			.rules {
				padding: 1rem;
				margin: 0;
			}
			.rule-text {
				max-width: 25rem;
			}
			.rule-points {
				padding: 0.3rem 0.6rem;
				border-radius: 0.5rem;
				margin-left: 0.5rem;
			}
			.positive {
				background-color: #9cf6a5;
			}
			.negative {
				background-color: #ffb8b8;
			}
			.description {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-rules-page': FsgRulesPage;
	}
}
