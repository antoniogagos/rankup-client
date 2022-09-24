import { localizePath, msg, str } from '@rankup/common/i18n/localize';
import { addPlayerIcon, arrowLeftIcon, settingsIcon } from '@rankup/samba/icons.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import linkStyles from '@rankup/samba/styles/link-css.js';
import typographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('fsg-header')
export class FsgHeader extends LitElement {
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
            href=${localizePath(msg('/mis-torneos'))}>
            ${arrowLeftIcon}
          </a>
        </section>
        <div class="f3 text-bold nowrap contest-name">The Squad Team</div>
        <section class="right-section">
          <a href=${localizePath(
						msg(str`resultados/${id}/compartir-torneo`),
					)} class=${linkClasses}>${addPlayerIcon}</a>
          <a href=${localizePath(
						msg(str`resultados/${id}/ajustes`),
					)} class=${linkClasses}>${settingsIcon}</button></a>
        </section>
      </header>
    `;
	}

	static styles = [
		linkStyles,
		buttonStyles,
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
		'fsg-contest-header': FsgHeader;
	}
}
