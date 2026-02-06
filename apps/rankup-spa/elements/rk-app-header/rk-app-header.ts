import '../rk-drawer/rk-drawer.js';
import { Icons } from '../../authenticated-icons.js';
import type { RkDrawer } from '../rk-drawer/rk-drawer.js';
import { openOverlay } from '@rankup/samba/overlay/open-overlay';
import buttonStyles from '@rankup/samba/styles/button.css';
import resetStyles from '@rankup/samba/styles/reset.css';
// import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rk-app-header')
export class RkAppHeader extends LitElement {
	private _onMenuClick() {
		openOverlay<RkDrawer>('rk-drawer', null, {
			addOverlayStyles: false,
			cancelOnOutsideClick: true,
			withBackdrop: true,
			animationIn: [
				{ transform: 'translateX(-20px)', opacity: 0 },
				{ transform: 'translateX(0)', opacity: 1 },
			],
			animationOut: [
				{ transform: 'translateX(0)', opacity: 1 },
				{ transform: 'translateX(-20px)', opacity: 0 },
			],
		});
	}

	override render() {
		return html`
			<header>
				<button @click=${this._onMenuClick}>${Icons('hamburger', 24)}</button>
				<section>
					<button>${Icons('bell-with-number', 24)}</button>
					<button>
						<img alt="Player avatar" src="/assets/avatars/rocket.svg" />
						<!-- <img alt="Player avatar" src="/assets/images/default-avatar.svg" /> -->
					</button>
				</section>
			</header>
		`;
	}

	static override styles = [
		resetStyles,
		buttonStyles,
		css`
		header {
			align-items: center;
			background: var(--color-header-bg);
			box-sizing: border-box;
			color: var(--color-header-text);
			display: flex;
			flex-direction: row;
			height: 70px;
			justify-content: space-between;
			padding: 2rem;
			width: 100%;
			z-index: 2;
		}

		header section {
			display: flex;
			gap: 2rem;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-app-header': RkAppHeader;
	}
}
