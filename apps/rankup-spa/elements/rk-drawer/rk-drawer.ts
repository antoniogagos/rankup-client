import { Icons } from '../../authenticated-icons.js';
import { path } from '../../lib/localization/rk-url-paths.js';
import { msg } from '@lit/localize';
import { listen } from '@rankup/base/browser/event.js';
import { DisposableStore } from '@rankup/base/common/lifecycle.js';
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import { ISessionManager } from '@rankup/platform/session/common/sessionManager.js';
import type { OverlayController } from '@rankup/samba/overlay/types';
import buttonStyles from '@rankup/samba/styles/button.css';
import resetStyles from '@rankup/samba/styles/reset.css';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rk-drawer')
export class RkDrawer extends LitElement {
	@service(ISessionManager) private readonly _sessionManager!: ISessionManager;

	private readonly _disposables = new DisposableStore();

	overlayController?: OverlayController<this>;

	override connectedCallback(): void {
		super.connectedCallback?.();
		this._disposables.clear();
		const url = new URL(window.location.toString());
		url.searchParams.set('drawer', '1');
		window.history.pushState({ drawer: 1, ...window.history.state }, '', url.toString());
		this._disposables.add(listen(window, 'popstate', this._onPopstate));
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback?.();
		const { drawer, ..._state } = window.history.state ?? {};
		if (drawer) {
			const url = new URL(window.location.toString());
			url.searchParams.delete('drawer');
			window.history.replaceState(_state, '', url);
		}
		this._disposables.clear();
	}

	private _onPopstate = () => {
		this.overlayController?.close();
	};

	private _onSignOutClicked() {
		this.overlayController?.close();
		this._sessionManager.signOut();
	}

	override render() {
		return html`
			<main opened>
				<img src="/assets/images/rk-logo-with-bg.svg" alt="Rankup logo" />
				<div class="rankup">Rankup</div>
				<a href=${path('CREATE_TOURNEY')}>
					<button class="btn btn--md">${Icons('create-tourney', 18)}${msg('Crear liga')}</button>
				</a>
				<a href=${path('JOIN_TOURNEY')}>
					<button class="btn btn--md">${Icons('join-tourney', 18)}${msg('Unirse a una liga')}</button>
				</a>
				<div class="divisor-line"></div>
				<button class="btn btn--md">${Icons('twitter', 18)}${msg('¡Síguenos en Twitter!')}</button>
				<button id="signoutBtn" @click=${this._onSignOutClicked} class="btn btn--md">${Icons('sign-out', 18)}${msg('Cerrar sesión')}</button>
			</main>
		`;
	}

	static override styles = [
		resetStyles,
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
			width: 65vw;
			z-index: 2;
		}
		main[opened] {
			transform: translateX(0);
		}
		a {
			width: 100%;
		}
		#signoutBtn {
			margin-top: auto;
		}
		.rankup {
			font-size: 2.2rem;
			font-weight: bold;
			margin-bottom: 2rem;
		}
		.btn {
			width: 100%;
			border-radius: 8px;
		}
		.divisor-line {
			background-color: var(--color-canvas-subtle);
			height: 0.1rem;
			width: 100%;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-drawer': RkDrawer;
	}
}
