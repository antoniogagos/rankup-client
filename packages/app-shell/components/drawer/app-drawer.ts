import { localizePath, msg } from '@rankup/common/i18n/localize';
import type { WithEvents } from '@rankup/common/types/html-element-typed-events';
import {
	createTourneyIcon,
	joinTourneyIcon,
	newsletterIcon,
	signOutIcon,
	twitterIcon,
} from '@rankup/samba/icons.js';
import type { OverlayController } from '@rankup/samba/overlay/types.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

export interface AppDrawerParameters {}

export type EventsMap = {
	'drawer-opened': CustomEvent<{
		old: boolean;
		value: boolean;
	}>;
};

@customElement('app-drawer')
export class AppDrawer extends LitElement implements AppDrawerParameters {
	overlayController?: OverlayController<this>;

	connectedCallback(): void {
		super.connectedCallback?.();
		const url = new URL(window.location.toString());
		url.searchParams.set('drawer', '1');
		window.history.pushState({ drawer: 1, ...window.history.state }, '', url.toString());
		window.addEventListener('popstate', this._onPopstate);
	}

	disconnectedCallback(): void {
		super.disconnectedCallback?.();
		const { drawer, ..._state } = window.history.state ?? {};
		if (drawer) {
			const url = new URL(window.location.toString());
			url.searchParams.delete('drawer');
			window.history.replaceState(_state, '', url);
		}
		window.removeEventListener('popstate', this._onPopstate);
	}

	private _onPopstate = () => {
		this.overlayController?.close();
	};

	private _onSignOutClicked() {
		// TODO specify different animation (opacity?)
		this.overlayController?.close({ noAnimation: true });
		appShell.sessionManager.signOut();
	}

	render() {
		return html`
			<main opened>
				<img src="/assets/images/rk-logo-with-bg.svg" alt="Rankup logo" />
				<div class="rankup">Rankup</div>
				<a href=${localizePath(msg('crear-torneo'))}>
					<button class="btn btn--md">${createTourneyIcon}${msg('Crear liga')}</button>
				</a>
				<a href=${localizePath(msg('unirse-torneo'))}>
					<button class="btn btn--md">${joinTourneyIcon}${msg('Unirse a una liga')}</button>
				</a>
				<button id="signOutBtn" @click=${this._onSignOutClicked} class="btn btn--md">
					${signOutIcon}${msg('Cerrar sesión')}
				</button>
				<div class="divisor-line"></div>
				<button class="btn btn--md">${twitterIcon}${msg('¡Síguenos en Twitter!')}</button>
				<button class="btn btn--md">${newsletterIcon}${msg('Rankup newsletter')}</button>
			</main>
		`;
	}

	static styles = [
		buttonStyles,
		css`
			:host {
				display: inline-block;
				height: 100%;
			}
			main {
				align-items: flex-start;
				background: var(--color-canvas-overlay);
				box-sizing: border-box;
				color: var(--color-fg-default);
				display: flex;
				flex-direction: column;
				gap: 1rem;
				height: 100%;
				justify-content: flex-start;
				max-width: 35rem;
				padding: 2rem;
				position: absolute;
				transform: translateX(-100%);
				transition: transform 350ms ease-in-out;
				z-index: 2;
			}
			main[opened] {
				transform: translateX(0);
			}
			a {
				width: 100%;
			}
			#signOutBtn {
				margin-top: 3.5rem;
			}
			.rankup {
				font-size: 2.2rem;
				font-weight: bold;
				margin-bottom: 2rem;
			}
			.btn {
				width: 100%;
				border-radius: 0.8rem;
			}
			.divisor-line {
				background-color: var(--color-canvas-subtle);
				height: 0.1rem;
				width: 100%;
			}
		`,
	];
}

export type AppDrawerWithEvents = WithEvents<AppDrawer, EventsMap>;

declare global {
	interface HTMLElementTagNameMap {
		'app-drawer': WithEvents<AppDrawer, EventsMap>;
	}
}
