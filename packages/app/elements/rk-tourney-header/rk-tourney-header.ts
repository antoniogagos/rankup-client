// import { msg } from '@lit/localize';
import { Task } from '@lit-labs/task';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { addPlayerIcon, arrowLeftIcon, settingsIcon } from 'samba/icons.js';
import buttonStyles from 'samba/styles/button-css.js';
import linkStyles from 'samba/styles/link-css.js';
import typographyStyles from 'samba/styles/typography-css.js';

import { path, relativePath } from '../../lib/localization/rk-url-paths.js';

@customElement('rk-tourney-header')
export class RkTourneyHeader extends LitElement {
	@property({ type: Boolean, attribute: 'inverted-color' })
	invertedColor = false;

	private _tourneys = new Task(
		this,
		() => rkApp.ds.GetUserTourneys(),
		() => [null],
	);

	render() {
		const staticPath = path('TOURNEY') + '/fj_rew';
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
            href=${path('TOURNEYS')}>
            ${arrowLeftIcon}
          </a>
        </section>
        <div class="f3 text-bold nowrap tourney-name">The Squad Team</div>
        <section class="right-section">
          <a href=${
						staticPath + relativePath('SHARE_TOURNEY')
					} class=${linkClasses}>${addPlayerIcon}</a>
          <a href=${
						staticPath + relativePath('SETTINGS_TOURNEY')
					} class=${linkClasses}>${settingsIcon}</button></a>
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
				z-index: 3;
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
		'rk-tourney-header': RkTourneyHeader;
	}
}
