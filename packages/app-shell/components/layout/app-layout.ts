import '../drawer/app-drawer.js';
import './app-header.js';
import './app-footer.js';

import { RouterStyles } from '@rankup/common/router/router.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';

import type { AppHeader } from './app-header.js';

@customElement('app-layout')
export class AppLayout extends LitElement {
	@property({ type: Boolean, reflect: true, attribute: 'header-hidden' })
	headerHidden = false;

	@property({ type: Boolean, reflect: true, attribute: 'footer-hidden' })
	footerHidden = false;

	@query('app-header', true)
	header?: AppHeader;

	@query('app-footer', true)
	footer?: AppHeader;

	@query('section', true)
	section?: HTMLDivElement;

	firstUpdated() {
		this.header!.toggleAttribute('hidden', this.headerHidden);
		this.footer!.toggleAttribute('hidden', this.footerHidden);
	}

	private _onSectionAnimationStart(evt: AnimationEvent) {
		const { animationName } = evt;
		if (animationName.startsWith('RouterExit')) {
			const rect = this.section!.getBoundingClientRect();
			this.section!.style.width = rect.width + 'px';
			this.section!.style.height = rect.height + 'px';
			this.section!.style.top = rect.top + 'px';
			this.section!.style.position = 'absolute';
			this.header!.style.position = 'absolute';
			this.footer!.style.position = 'absolute';
			this.header!.toggleAttribute('exit', this.headerHidden);
			this.footer!.toggleAttribute('exit', this.footerHidden);
		} else if (animationName.startsWith('RouterEntry')) {
			this.section!.style.removeProperty('width');
			this.section!.style.removeProperty('height');
			this.section!.style.removeProperty('top');
			this.section!.style.removeProperty('position');
			this.header!.style.removeProperty('position');
			this.footer!.style.removeProperty('position');
		}
	}

	private _onSectionAnimationEnd(evt: AnimationEvent) {
		const { animationName } = evt;
		if (animationName.startsWith('RouterExit')) {
			this.header!.toggleAttribute('hidden', this.headerHidden);
			this.footer!.toggleAttribute('hidden', this.footerHidden);
		} else if (animationName.startsWith('RouterEntry')) {
			this.header!.toggleAttribute('exit', false);
			this.footer!.toggleAttribute('exit', false);
		}
	}

	render() {
		return html`
			<app-header></app-header>
			<section
				@animationend=${this._onSectionAnimationEnd}
				@animationstart=${this._onSectionAnimationStart}>
				<slot></slot>
			</section>
			<app-footer></app-footer>
		`;
	}

	static styles = [
		RouterStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				height: 100%;
			}

			section {
				position: relative;
				flex: 1;
				display: block;
				height: max-content;
			}

			app-header {
				top: 0;
			}

			app-footer {
				bottom: 0;
			}

			app-header,
			app-footer {
				animation-name: RouterEntryLeft;
				z-index: 1;
				width: 100%;
				animation-duration: 380ms;
				animation-timing-function: ease-out;
				animation-fill-mode: forwards;
			}

			app-header[exit],
			app-footer[exit] {
				animation-name: RouterExitRight;
				position: absolute;
				animation-duration: 140ms;
				animation-timing-function: ease-out;
				animation-fill-mode: forwards;
			}

			[hidden] {
				display: none;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'app-layout': AppLayout;
	}
}
