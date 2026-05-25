// import { msg } from '@lit/localize';
import { Icons } from '../../authenticated-icons.js';
import { path, relativePath } from '../../lib/localization/rk-url-paths.js';
import { getCurrentTournamentBase } from '../../lib/utils/tournament-path.js';
import buttonStyles from '@rankup/samba/styles/button.css';
import linkStyles from '@rankup/samba/styles/link.css';
import resetStyles from '@rankup/samba/styles/reset.css';
import typographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * @element rk-tournament-header
 */
@customElement('rk-tournament-header')
export class RkTournamentHeader extends LitElement {
	@property({ type: String, attribute: 'tournament-base' }) tournamentBase = '';

	@property({ type: Boolean, attribute: 'inverted-color' }) invertedColor = false;

	override render() {
		const linkClasses = {
			'link--primary': !this.invertedColor,
			'link--primary-inverted': this.invertedColor,
		};
		const tournamentBase = this.tournamentBase || getCurrentTournamentBase();
		return html`
			<header
			  class=${classMap({
					'color-header-text': !this.invertedColor,
					'color-header-text-inverted': this.invertedColor,
				})}>
			  <section class="left-section">
			    <a
			      id="arrow"
			      class=${classMap(linkClasses)}
			      href=${path('TOURNAMENTS')}>
			      ${Icons('arrow-left', 20)}
			    </a>
			  </section>
			  <div class="f3 text-bold nowrap tournament-name">The Squad Team</div>
			  <section class="right-section">
			    <a href=${tournamentBase + relativePath('SHARE_TOURNAMENT')} class=${classMap(linkClasses)}>${Icons('add-player', 20)}</a>
			    <a href=${tournamentBase + relativePath('SETTINGS_TOURNAMENT')} class=${classMap(linkClasses)}>${Icons('settings', 20)}</button></a>
			  </section>
			</header>
		`;
	}

	static override styles = [
		resetStyles,
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
			background: #f8f8fc;
			color: var(--color-header-text);
		}
		.color-header-text-inverted {
			background: var(--color-header-bg-inverted);
			color: var(--color-header-text-inverted);
		}
		.tournament-name {
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
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-header': RkTournamentHeader;
	}
}
