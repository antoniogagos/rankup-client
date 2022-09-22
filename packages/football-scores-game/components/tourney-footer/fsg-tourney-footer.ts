import {
	chatFilledIcon,
	chatIcon,
	fieldFilledIcon,
	fieldIcon,
	trophyFilledIcon,
	trophyIcon,
} from '@rankup/samba/icons.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

enum Tabs {
	RANKING = 1,
	MATCHDAY,
	CHAT,
}

@customElement('fsg-tourney-footer')
export class FsgTourneyFooter extends LitElement {
	@state()
	private _selectedTab = Tabs.MATCHDAY;

	private _onTabClick(evt: MouseEvent) {
		if (evt.button === 0) {
			const name = (evt.target as HTMLAnchorElement).getAttribute('name');
			this._selectedTab = Number(name);
		}
	}

	private _onTabKeydown() {
		//
	}

	render() {
		const staticPath = 'TOURNEY/fj_rew';
		return html`
			<footer @click=${this._onTabClick} @keydown=${this._onTabKeydown}>
				<a
					href=${staticPath + 'MATCHDAY'}
					class="header--item"
					name=${Tabs.MATCHDAY}
					?selected=${this._selectedTab === Tabs.MATCHDAY}>
					<div class="item-icon">
						${this._selectedTab === Tabs.MATCHDAY ? fieldFilledIcon : fieldIcon}
					</div>
				</a>
				<a
					href=${staticPath + 'RANKING'}
					class="header--item"
					name=${Tabs.RANKING}
					?selected=${this._selectedTab === Tabs.RANKING}>
					<div class="item-icon">
						${this._selectedTab === Tabs.RANKING ? trophyFilledIcon : trophyIcon}
					</div>
				</a>
				<a
					href=${staticPath + 'CHAT'}
					class="header--item"
					name=${Tabs.CHAT}
					?selected=${this._selectedTab === Tabs.CHAT}>
					<div class="item-icon">
						${this._selectedTab === Tabs.CHAT ? chatFilledIcon : chatIcon}
					</div>
				</a>
			</footer>
		`;
	}

	static styles = [
		buttonStyles,
		css`
			:host {
				display: block;
				z-index: 1;
				width: 100%;
				background: var(--color-footer-bg);
				color: var(--color-footer-text);
				font-weight: 600;
			}
			footer {
				border-top: 1px solid var(--color-border-subtle);
				max-width: 450px;
				margin: 0 auto;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				height: 5.6rem;
				font-size: 1.4rem;
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
				justify-content: space-between;
				padding: 0.5rem;
			}
			.header--item > * {
				pointer-events: none;
			}
			.header--item[selected] {
				color: green;
			}
			.header--item[selected] .item-icon {
				color: green;
			}
			.item-icon {
				align-items: center;
				color: var(--color-footer-icon);
				display: flex;
				height: 100%;
				justify-content: center;
				margin: 0 auto;
				max-width: 60px;
				width: 70%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-tourney-footer': FsgTourneyFooter;
	}
}
