import '../../elements/rk-tourney-header/rk-tourney-header.js';
import '../../elements/rk-tourney-footer/rk-tourney-footer.js';
import './pages/rk-tourney-matchday.js';
import './pages/rk-tourney-chat.js';
import './pages/rk-tourney-settings.js';
import './pages/rk-share-tourney.js';
import './pages/rk-sb-rules.js';
// @ts-ignore
import AppRouterStyles from '../../elements/app-router/styles.css';
import { relativePath } from '../../lib/localization/rk-url-paths.js';
import { getCurrentTourneyBase } from '../../lib/utils/tourney-path.js';
import { appRouterAnimations } from '../../router-animations.js';
import { RankingType } from './pages/rk-tourney-ranking.js';
import ButtonStyles from '@rankup/samba/styles/button.css';
import LinkStyles from '@rankup/samba/styles/link.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-tourney-page')
export class RkTourneyPage extends LitElement {
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
		const rankingPageVisible = router?.page?.elementName === 'rk-tourney-ranking';
		const tourneyBase = getCurrentTourneyBase();
		return html`
			<rk-tourney-header tourney-base=${tourneyBase} ?inverted-color=${this._seasonRankingSelected && rankingPageVisible}></rk-tourney-header>
			<app-router class="router" base=${tourneyBase} home=${relativePath('MATCHDAY')} fallback=${relativePath('MATCHDAY')} .animations=${appRouterAnimations}>
				<rk-tourney-ranking class="${this._seasonRankingSelected && rankingPageVisible ? 'router-page-season-ranking' : 'router-page'}" path=${relativePath('RANKING')} animation="opacity" @selected-ranking-changed=${this._onSelectRankingChanged}></rk-tourney-ranking>
				<rk-tourney-matchday class="router-page" animation="opacity" path=${relativePath('MATCHDAY')}></rk-tourney-matchday>
				<rk-tourney-chat class="router-page" animation="opacity" path=${relativePath('CHAT')}></rk-tourney-chat>
				<rk-share-tourney path=${relativePath('SHARE_TOURNEY')} animation="opacity"></rk-share-tourney>
				<rk-tourney-settings path=${relativePath('SETTINGS_TOURNEY')} animation="opacity"></rk-tourney-settings>
				<rk-sb-rules path=${relativePath('RULES_TOURNEY')} animation="opacity"></rk-sb-rules>
			</app-router>
			<rk-tourney-footer tourney-base=${tourneyBase}></rk-tourney-footer>
		`;
	}

	static override styles = [
		ButtonStyles,
		LinkStyles,
		AppRouterStyles,
		css`
		:host {
			background: var(--color-canvas-default);
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
		'rk-tourney-page': RkTourneyPage;
	}
}
