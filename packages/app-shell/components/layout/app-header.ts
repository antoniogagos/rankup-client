import '../drawer/app-drawer.js';

import { bellWithNumberIcon, hamburgerIcon } from '@rankup/samba/icons.js';
import { openOverlay } from '@rankup/samba/overlay/open-overlay.js';
import type { OverlayController } from '@rankup/samba/overlay/overlay-controller.js';
import buttonsStyles from '@rankup/samba/styles/buttons-css.js';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';

import type { AppDrawer } from '../drawer/app-drawer.js';

@customElement('app-header')
export class AppHeader extends LitElement {
	_drawer?: OverlayController<AppDrawer>;

	@property({ type: Boolean, reflect: true })
	hidden = false;

	updated(changedProperties: PropertyValues): void {
		const hidden = changedProperties.get('hidden');
		if (hidden === false) {
			this._closeDrawer();
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback?.();
		this._closeDrawer();
	}

	private _closeDrawer() {
		this._drawer?.close();
		this._drawer = undefined;
	}

	private _onMenuClick() {
		this._drawer = openOverlay<AppDrawer>('app-drawer', null, {
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
		buttonsStyles,
		css`
			:host {
				display: block;
			}
			header {
				align-items: center;
				background: var(--color-header-bg);
				box-sizing: border-box;
				color: var(--color-header-text);
				display: flex;
				flex-direction: row;
				height: 7rem;
				justify-content: space-between;
				padding: 2rem;
				width: 100%;
			}

			header section {
				display: flex;
				gap: 2rem;
			}

			svg {
				height: 2.4rem;
				width: 2.4rem;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'app-header': AppHeader;
	}
}
