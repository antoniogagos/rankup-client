import '../drawer/app-drawer.js';

import { bellWithNumberIcon, hamburgerIcon } from '@rankup/samba/icons.js';
import { openOverlay } from '@rankup/samba/overlay/open-overlay.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
// import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import type { AppDrawer } from '../drawer/app-drawer.js';

@customElement('app-header')
export class AppHeader extends LitElement {
	private _onMenuClick() {
		openOverlay<AppDrawer>('app-drawer', null, {
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
		'app-header': AppHeader;
	}
}
