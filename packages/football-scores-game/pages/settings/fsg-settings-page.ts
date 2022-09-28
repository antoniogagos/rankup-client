import '@rankup/samba/toggle-input/sb-toggle-input.js';

import { contextProvided } from '@lit-labs/context';
import { msg } from '@rankup/common/i18n/localize.js';
import { bellIcon, leaveIcon, paperIcon } from '@rankup/samba/icons.js';
import ButtonStyles from '@rankup/samba/styles/buttons-css.js';
import FormControlStyles from '@rankup/samba/styles/form-control-css.js';
import LinkStyles from '@rankup/samba/styles/links-css.js';
import MarginStyles from '@rankup/samba/styles/margin-css.js';
import TypographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { routerContext, RoutesController } from '../../contexts/router-context.js';

@customElement('fsg-settings-page')
export class FsgSettingsPage extends LitElement {
	@contextProvided({ context: routerContext })
	router!: RoutesController;

	contestId = 'fj_rew';

	render() {
		return html`
			<h1 class="text-bold">${msg('Ajustes')}</h1>
			<section>
				<p class="section-title text-bold f3 mt-6 mb-3">${bellIcon} ${msg('Notificaciones')}</p>
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
						<sb-toggle-input tabindex="0"></sb-toggle-input>
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
						<sb-toggle-input tabindex="0"></sb-toggle-input>
					</div>
					<div class="list--item">
						<div class="list--item-block f4">
							<!-- <img width="28" height="28" src="/assets/images/goal.webp" alt="Goal" /> -->
							${msg('Goles en vivo')}
						</div>
						<sb-toggle-input tabindex="0"></sb-toggle-input>
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
						<sb-toggle-input tabindex="0"></sb-toggle-input>
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
						<sb-toggle-input tabindex="0"></sb-toggle-input>
					</div>
				</div>
			</section>
			<div class="buttons mt-6">
				<a
					class="btn btn--primary btn--md"
					href=${this.router.link('rules', { id: this.contestId })}>
					${msg('Ver sistema de puntuación')} ${paperIcon}
				</a>
				<button class="btn btn--primary btn--md btn--danger">
					${msg('Abandonar torneo')} ${leaveIcon}
				</button>
			</div>
		`;
	}

	static styles = [
		ButtonStyles,
		LinkStyles,
		TypographyStyles,
		MarginStyles,
		FormControlStyles,
		css`
			:host {
				display: flex;
				align-items: flex-start;
				flex-direction: column;
				padding: 0 2rem;
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
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-settings-page': FsgSettingsPage;
	}
}
