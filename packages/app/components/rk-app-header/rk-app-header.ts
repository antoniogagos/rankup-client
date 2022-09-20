import '../rk-drawer/rk-drawer.js';

// import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bellWithNumberIcon, hamburgerIcon } from 'samba/icons.js';
import { openOverlay } from 'samba/overlay/open-overlay.js';
import buttonStyles from 'samba/styles/button-css.js';

import type { RkDrawer } from '../rk-drawer/rk-drawer.js';

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

	render() {
		return html`
			<header>
				<button @click=${this._onMenuClick}>${hamburgerIcon}</button>
				<section>
					<button>${bellWithNumberIcon}</button>
					<button>
						<img alt="Player avatar" src="/assets/images/default-avatar.svg" />
					</button>
				</section>
			</header>
		`;
	}

	static styles = [
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

			svg {
				height: 24px;
				width: 24px;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-app-header': RkAppHeader;
	}
}
