import { Task } from '@lit-labs/task';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import marginStyles from '@rankup/samba/styles/margin-css.js';
import typographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

interface Contest {
	contestId: string;
	title: string;
}

@customElement('lobby-index-page')
export class LobbyIndexPage extends LitElement {
	private _contestList = new Task(
		this,
		async () => [
			{ contestId: 'fLe31mF', title: 'El pelotazo' },
			{ contestId: 'fLe31mF', title: 'La liga Maldini' },
		],
		() => [null],
	);

	private _renderContestList(contests: Contest[]) {
		return html`
			<div class="table">
				${contests.map(
					contest =>
						html`<button class="btn row" data-id=${contest.contestId}>
							<div class="title">${contest.title}</div>
						</button>`,
				)}
			</div>
		`;
	}

	render() {
		return html`
			${this._contestList.render({
				complete: this._renderContestList,
				pending: () => html`loading...`,
			})}
		`;
	}

	static styles = [
		typographyStyles,
		buttonStyles,
		marginStyles,
		css`
			:host {
				display: block;
			}

			.table {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.8rem;
				padding: 0 2rem;
			}

			.row {
				background: var(--color-avatar-stack-fade);
				width: 100%;
				border-radius: 0.8rem;
				padding: 0.6rem 0.8rem;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'lobby-index-page': LobbyIndexPage;
	}
}
