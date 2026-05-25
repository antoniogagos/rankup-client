import '../../elements/rk-tournament-header/rk-tournament-header.js';
import '../../elements/rk-tournament-footer/rk-tournament-footer.js';
import './pages/rk-tournament-matchday.js';
import './pages/rk-tournament-chat.js';
import './pages/rk-tournament-settings.js';
import './pages/rk-share-tournament.js';
import './pages/rk-sb-rules.js';
// @ts-ignore
import AppRouterStyles from '../../elements/app-router/styles.css';
import { relativePath } from '../../lib/localization/rk-url-paths.js';
import { getCurrentTournamentBase } from '../../lib/utils/tournament-path.js';
import { appRouterAnimations } from '../../router-animations.js';
import { RankingType } from './pages/rk-tournament-ranking.js';
import ButtonStyles from '@rankup/samba/styles/button.css';
import LinkStyles from '@rankup/samba/styles/link.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @element rk-tournament-page
 */
@customElement('rk-tournament-page')
export class RkTournamentPage extends LitElement {
	@property({ type: Boolean }) override hidden = true;

	@property({ type: Boolean }) private _seasonRankingSelected = false;

	override shouldUpdate(): boolean {
		return !this.hidden;
	}

	private _onSelectRankingChanged(evt: CustomEvent) {
		this._seasonRankingSelected = evt.detail.selectedRanking === RankingType.SEASON;
	}

	override render() {
		const router = this.shadowRoot?.querySelector('app-router');
		const rankingPageVisible = router?.page?.elementName === 'rk-tournament-ranking';
		const tournamentBase = getCurrentTournamentBase();
		return html`
			<rk-tournament-header tournament-base=${tournamentBase} ?inverted-color=${this._seasonRankingSelected && rankingPageVisible}></rk-tournament-header>
			<app-router class="router" base=${tournamentBase} home=${relativePath('MATCHDAY')} fallback=${relativePath('MATCHDAY')} .animations=${appRouterAnimations}>
				<rk-tournament-ranking class="${this._seasonRankingSelected && rankingPageVisible ? 'router-page-season-ranking' : 'router-page'}" path=${relativePath('RANKING')} animation="opacity" @selected-ranking-changed=${this._onSelectRankingChanged}></rk-tournament-ranking>
				<rk-tournament-matchday class="router-page" animation="opacity" path=${relativePath('MATCHDAY')}></rk-tournament-matchday>
				<rk-tournament-chat class="router-page" animation="opacity" path=${relativePath('CHAT')}></rk-tournament-chat>
				<rk-share-tournament path=${relativePath('SHARE_TOURNAMENT')} animation="opacity"></rk-share-tournament>
				<rk-tournament-settings path=${relativePath('SETTINGS_TOURNAMENT')} animation="opacity"></rk-tournament-settings>
				<rk-sb-rules path=${relativePath('RULES_TOURNAMENT')} animation="opacity"></rk-sb-rules>
			</app-router>
			<rk-tournament-footer tournament-base=${tournamentBase}></rk-tournament-footer>
		`;
	}

	static override styles = [
		ButtonStyles,
		LinkStyles,
		AppRouterStyles,
		css`
		:host {
			background: #f8f8fc;
			box-sizing: border-box;
			color: var(--color-fg-default);
			display: flex;
			flex-direction: column;
		}
		.router {
			display: block;
			flex: 1;
		}
		.router-page {
			margin-top: 7rem;
			height: calc(100% - 12.6rem);
		}
		.router-page-season-ranking {
			height: calc(100% - 5.6rem);
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-page': RkTournamentPage;
	}
}
