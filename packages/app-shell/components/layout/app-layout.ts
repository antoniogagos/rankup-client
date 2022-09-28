import '../drawer/app-drawer.js';
import './app-footer.js';
import './app-header.js';

import { eventListener } from '@rankup/common/lit-controllers/listeners-controller/decorators/event-listeners.js';
import { EventsMap as RouterEvents, RouterStyles } from '@rankup/common/router/router.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { state } from 'lit/decorators/state.js';

import type { AppFooter } from './app-footer.js';
import type { AppHeader } from './app-header.js';

@customElement('app-layout')
export class AppLayout extends LitElement {
	@property({ type: Boolean, reflect: true, attribute: 'header-hidden' })
	// input value - it isn't applied immediately but waits for page-animations to end instead
	headerHidden?: boolean = false;

	@property({ type: Boolean, reflect: true, attribute: 'footer-hidden' })
	footerHidden?: boolean = false;

	@query('app-header', true)
	header?: AppHeader;

	@query('app-footer', true)
	footer?: AppFooter;

	@query('section', true)
	section?: HTMLDivElement;

	@state()
	// value that will be finally applied by the render fn
	_headerHidden?: boolean;

	@state()
	// value that will be finally applied by the render fn
	_footerHidden?: boolean;

	_pageChangeIsAnimating = false;

	@eventListener({ eventName: 'router-page-changed' })
	protected _onRouterPageChanged(evt: RouterEvents['router-page-changed']) {
		// This.headerHidden(footer) will be set from outside
		// During animations, we need the old hidden and the new hidden values to compute the animation
		// But this event occurs before any animation start, so we avoid
		if (evt.detail.host === appShell && !this._pageChangeIsAnimating) {
			this._headerHidden = this.headerHidden;
			this._footerHidden = this.footerHidden;
		}
	}

	private _onSectionAnimationStart(evt: AnimationEvent) {
		const { animationName } = evt;
		if (animationName.startsWith('Router')) {
			this._pageChangeIsAnimating = true;
			const nextHeaderHidden = this.headerHidden;
			const prevHeaderHidden = this._headerHidden;
			const nextFooterHidden = this.footerHidden;
			const prevFooterHidden = this._footerHidden;
			const headerHiddenChanged = nextHeaderHidden !== prevHeaderHidden;
			const footerHiddenChanged = nextFooterHidden !== prevFooterHidden;
			if (animationName.startsWith('RouterExit')) {
				// first animation: when the current page starts to exit
				const rect = this.section!.getBoundingClientRect();
				this.section!.style.height = rect.height + 'px';
				this.section!.style.top = rect.top + 'px';
				this.section!.style.width = rect.width + 'px';
				this.section!.style.position = 'absolute';
				this.header!.style.position = 'absolute';
				this.footer!.style.position = 'absolute';
				this.header!.toggleAttribute('exit', nextHeaderHidden);
				this.footer!.toggleAttribute('exit', nextFooterHidden);
			} else if (animationName.startsWith('RouterEntry')) {
				// when the new page starts to entry
				this.header!.toggleAttribute('entry', !nextHeaderHidden && headerHiddenChanged);
				this.footer!.toggleAttribute('entry', !nextFooterHidden && footerHiddenChanged);
				if (prevHeaderHidden && !nextHeaderHidden) {
					this.header!.removeAttribute('hidden');
				}
				if (prevFooterHidden && !nextFooterHidden) {
					this.footer!.removeAttribute('hidden');
				}
				this.section!.style.removeProperty('height');
				this.section!.style.removeProperty('top');
				this.section!.style.removeProperty('width');
				this.section!.style.removeProperty('position');
				this.header!.style.removeProperty('position');
				this.footer!.style.removeProperty('position');
			}
		}
	}

	private _onSectionAnimationEnd(evt: AnimationEvent) {
		const { animationName } = evt;
		// when the entry page has ended animating
		if (animationName.startsWith('RouterEntry')) {
			this.header!.toggleAttribute('exit', false);
			this.footer!.toggleAttribute('exit', false);
			this.header!.toggleAttribute('entry', false);
			this.footer!.toggleAttribute('entry', false);
			this._headerHidden = this.headerHidden;
			this._footerHidden = this.footerHidden;
			this._pageChangeIsAnimating = false;
		}
	}

	render() {
		// use the public property on initial value, after that we control it on page changes in order to animate
		const headerHidden = this.hasUpdated ? this._headerHidden : this.headerHidden;
		const footerHidden = this.hasUpdated ? this._footerHidden : this.footerHidden;
		return html`
			<app-header ?hidden=${headerHidden}></app-header>
			<section
				@animationend=${this._onSectionAnimationEnd}
				@animationstart=${this._onSectionAnimationStart}>
				<slot></slot>
			</section>
			<app-footer ?hidden=${footerHidden}></app-footer>
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
				z-index: 1;
				width: 100%;
			}

			app-header[entry],
			app-footer[entry] {
				animation-name: RouterEntryLeft;
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
