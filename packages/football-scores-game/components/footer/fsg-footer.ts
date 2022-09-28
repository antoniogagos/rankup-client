import { contextProvided } from '@lit-labs/context';
import type { RoutesController } from '@rankup/common/router/routes.js';
import { fieldFilledIcon, fieldIcon, trophyFilledIcon, trophyIcon } from '@rankup/samba/icons.js';
import buttonsStyles from '@rankup/samba/styles/buttons-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { routerContext } from '../../contexts/router-context.js';

enum Tabs {
	RANKING = 1,
	MATCHDAY,
	CHAT,
}

@customElement('fsg-footer')
export class FsgFooter extends LitElement {
	@property({ type: String })
	contestId = 'fj_rew';

	@state()
	private _selectedTab = Tabs.MATCHDAY;

	@contextProvided({ context: routerContext })
	_router!: RoutesController;

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
		return html`
			<footer @click=${this._onTabClick} @keydown=${this._onTabKeydown}>
				<a
					href=${this._router.link('matchday', { id: this.contestId })}
					class="header--item"
					name=${Tabs.MATCHDAY}
					?selected=${this._selectedTab === Tabs.MATCHDAY}>
					<div class="item-icon">
						${this._selectedTab === Tabs.MATCHDAY ? fieldFilledIcon : fieldIcon}
					</div>
				</a>
				<a
					href=${this._router.link('ranking', { id: this.contestId })}
					class="header--item"
					name=${Tabs.RANKING}
					?selected=${this._selectedTab === Tabs.RANKING}>
					<div class="item-icon">
						${this._selectedTab === Tabs.RANKING ? trophyFilledIcon : trophyIcon}
					</div>
				</a>
			</footer>
		`;
	}

	static styles = [
		buttonsStyles,
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
				border-top: 0.1rem solid var(--color-border-subtle);
				max-width: 45rem;
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
				max-width: 60rem;
				width: 70%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-footer': FsgFooter;
	}
}
