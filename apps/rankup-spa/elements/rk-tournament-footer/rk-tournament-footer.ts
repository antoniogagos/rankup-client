// import { msg } from '@lit/localize';
import { Icons } from '../../authenticated-icons.js';
import { relativePath } from '../../lib/localization/rk-url-paths.js';
import { getCurrentTournamentBase } from '../../lib/utils/tournament-path.js';
import buttonStyles from '@rankup/samba/styles/button.css';
import resetStyles from '@rankup/samba/styles/reset.css';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

enum Tabs {
	RANKING = 1,
	MATCHDAY,
	CHAT,
}

/**
 * @element rk-tournament-footer
 */
@customElement('rk-tournament-footer')
export class RkTournamentFooter extends LitElement {
	@property({ type: String, attribute: 'tournament-base' }) tournamentBase = '';

	@state() private _selectedTab = Tabs.MATCHDAY;

	private _onTabClick(evt: MouseEvent) {
		if (evt.button === 0) {
			const name = (evt.target as HTMLAnchorElement).getAttribute('name');
			this._selectedTab = Number(name);
		}
	}

	private _onTabKeydown() {
		//
	}

	override render() {
		const tournamentBase = this.tournamentBase || getCurrentTournamentBase();
		const selectedTab = this._resolveSelectedTab();
		return html`
			<footer @click=${this._onTabClick} @keydown=${this._onTabKeydown}>
				<a href=${tournamentBase + relativePath('RANKING')} class="header--item" name=${Tabs.RANKING} ?selected=${selectedTab === Tabs.RANKING}>
					<div class="item-icon">${selectedTab === Tabs.RANKING ? Icons('trophy-filled', 24) : Icons('trophy', 24)}</div>
					<span>Ranking</span>
				</a>
				<a href=${tournamentBase + relativePath('MATCHDAY')} class="header--item" name=${Tabs.MATCHDAY} ?selected=${selectedTab === Tabs.MATCHDAY}>
					<div class="item-icon item-icon--matchday">${selectedTab === Tabs.MATCHDAY ? html`<img src="/assets/images/rk-logo-with-bg.svg" alt="" />` : Icons('field', 24)}</div>
					<span>Matchday</span>
				</a>
				<a href=${tournamentBase + relativePath('CHAT')} class="header--item" name=${Tabs.CHAT} ?selected=${selectedTab === Tabs.CHAT}>
					<div class="item-icon">${selectedTab === Tabs.CHAT ? Icons('chat-filled', 24) : Icons('chat', 24)}</div>
					<span>Chat</span>
				</a>
			</footer>
		`;
	}

	private _resolveSelectedTab(): Tabs {
		const pathname = window.location.pathname;
		if (pathname.endsWith(relativePath('RANKING'))) {
			return Tabs.RANKING;
		}
		if (pathname.endsWith(relativePath('CHAT'))) {
			return Tabs.CHAT;
		}
		return this._selectedTab;
	}

	static override styles = [
		resetStyles,
		buttonStyles,
		css`
		:host {
			display: block;
			z-index: 1;
			width: 100%;
			background: linear-gradient(180deg, #fff 0%, #fff4ee 100%);
			color: var(--color-footer-text);
			font-weight: 600;
		}
		footer {
			border-top: 1px solid rgb(0 0 0 / 5%);
			max-width: 450px;
			margin: 0 auto;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			height: 5.6rem;
			font-size: 1.2rem;
			font-weight: 800;
		}
		.header--item {
			align-items: center;
			box-sizing: border-box;
			color: var(--color-footer-text);
			display: flex;
			flex-basis: 0;
			flex-direction: column;
			flex: 1 1 0;
			height: 100%;
			justify-content: center;
			padding: 0.5rem 0.5rem 0.7rem;
			text-align: center;
		}
		.header--item > * {
			pointer-events: none;
		}
		.header--item[selected] {
			color: #303036;
		}
		.header--item[selected] .item-icon {
			color: #6d675f;
		}
		.item-icon {
			align-items: center;
			color: var(--color-footer-icon);
			display: flex;
			height: 3rem;
			justify-content: center;
			margin: 0 auto;
			max-width: 6rem;
			width: 70%;
		}
		.item-icon--matchday {
			background: linear-gradient(90deg, #ffc05a 0%, #ff8f54 48%, #ffb36a 100%);
			border-radius: 999px;
			height: 3.8rem;
			margin-bottom: 0.1rem;
			max-width: 7.6rem;
			width: 7.6rem;
		}
		.item-icon--matchday img {
			height: 3.2rem;
			object-fit: contain;
			width: 3.2rem;
		}
		.header--item span {
			display: block;
			line-height: 1;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-footer': RkTournamentFooter;
	}
}
