import { contextProvided } from '@lit-labs/context';
import {
	routerContext as mainRouterContext,
	RoutesController,
} from '@rankup/common/contexts/main-router-context.js';
import { addPlayerIcon, arrowLeftIcon, settingsIcon } from '@rankup/samba/icons.js';
import buttonsStyles from '@rankup/samba/styles/buttons-css.js';
import linksCss from '@rankup/samba/styles/links-css.js';
import typographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { routerContext } from '../../contexts/router-context.js';

@customElement('fsg-header')
export class FsgHeader extends LitElement {
	@contextProvided({ context: routerContext })
	router!: RoutesController;

	@contextProvided({ context: mainRouterContext })
	mainRouter!: RoutesController;

	@property({ type: Boolean, attribute: 'inverted-color' })
	invertedColor = false;

	render() {
		const id = 'fj_rew';
		const linkClasses = classMap({
			'link--primary': !this.invertedColor,
			'link--primary-inverted': this.invertedColor,
		});
		return html`
      <header
        class=${classMap({
					'color-header-text': !this.invertedColor,
					'color-header-text-inverted': this.invertedColor,
				})}>
        <section class="left-section">
          <a
            id="arrow"
            class=${linkClasses}
            href=${this.mainRouter.link('my-contests')}>
            ${arrowLeftIcon}
          </a>
        </section>
        <div class="f3 text-bold nowrap contest-name">The Squad Team</div>
        <section class="right-section">
          <a href=${this.router.link(`share`, { id })} class=${linkClasses}>${addPlayerIcon}</a>
          <a href=${this.router.link(`settings`, {
						id,
					})} class=${linkClasses}>${settingsIcon}</button></a>
        </section>
      </header>
    `;
	}

	static styles = [
		linksCss,
		buttonsStyles,
		typographyStyles,
		css`
			:host {
				display: block;
			}
			header {
				align-items: center;
				box-sizing: border-box;
				display: flex;
				height: 6.6rem;
				padding: 2rem;
				width: 100%;
				z-index: 1;
			}
			#arrow {
				display: flex;
			}
			.color-header-text {
				background: var(--color-header-bg);
				color: var(--color-header-text);
			}
			.color-header-text-inverted {
				background: var(--color-header-bg-inverted);
				color: var(--color-header-text-inverted);
			}
			.contest-name {
				padding-left: 3.7rem;
			}
			.left-section {
				display: flex;
				align-items: center;
				gap: 1rem;
				position: absolute;
				left: 2rem;
			}
			.right-section {
				position: absolute;
				right: 2rem;
				display: flex;
				align-items: center;
				gap: 1.5rem;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-header': FsgHeader;
	}
}
