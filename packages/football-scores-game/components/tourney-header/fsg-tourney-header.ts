import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { addPlayerIcon, arrowLeftIcon, settingsIcon } from 'samba/icons.js';
import buttonStyles from 'samba/styles/button-css.js';
import linkStyles from 'samba/styles/link-css.js';
import typographyStyles from 'samba/styles/typography-css.js';

@customElement('fsg-tourney-header')
export class FsgTourneyHeader extends LitElement {
	@property({ type: Boolean, attribute: 'inverted-color' })
	invertedColor = false;

	render() {
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
            href="/">
            ${arrowLeftIcon}
          </a>
        </section>
        <div class="f3 text-bold nowrap tourney-name">The Squad Team</div>
        <section class="right-section">
          <a href="SHARE_TOURNEY" class=${linkClasses}>${addPlayerIcon}</a>
          <a href="SETTINGS_TOURNEY" class=${linkClasses}>${settingsIcon}</button></a>
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
			.tourney-name {
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
		'fsg-tourney-header': FsgTourneyHeader;
	}
}
