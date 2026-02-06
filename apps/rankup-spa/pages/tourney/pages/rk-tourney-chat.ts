import { Icons } from '../../../authenticated-icons.js';
import { msg } from '@lit/localize';
import ButtonStyles from '@rankup/samba/styles/button.css';
import FormControlStyles from '@rankup/samba/styles/form-control.css';
import LinkStyles from '@rankup/samba/styles/link.css';
import MarginStyles from '@rankup/samba/styles/margin.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

interface Message {
	id: number;
	value: string;
	completed: boolean;
}

@customElement('rk-tourney-chat')
export class RkTourneyChat extends LitElement {
	@property({ type: Boolean }) override hidden = true;

	@property({ type: Array }) messages: Message[] = [];

	@query('#textInput') declare textField: HTMLInputElement;

	override shouldUpdate(): boolean {
		return !this.hidden;
	}

	addMessage() {
		if (!this.textField.value) {
			return;
		}
		const nextId = (this.messages[this.messages.length - 1]?.id || 0) + 1;
		this.messages = [
			...this.messages,
			{
				id: nextId,
				value: this.textField.value,
				completed: false,
			},
		];
		this.textField.value = '';
	}

	removeMessage(item: Message) {
		this.messages = this.messages.filter(i => i !== item);
	}

	_handleTextInput(evt: KeyboardEvent) {
		if (evt.code === 'Enter') {
			this.addMessage();
		}
	}

	_renderMessages() {
		return html` ${this.messages.map(message => html` <li>${message.value}</li> `)} `;
	}

	override render() {
		return html`
			<ul class="messages">
				${this._renderMessages()}
			</ul>
			<div class="input-container">
				${Icons('happy-emoji', 24)}
				<input id="textInput" type="text" @keydown=${this._handleTextInput} @change=${this._handleTextInput} class="form-control" placeholder=${msg('Escribe un mensaje aquí')} />
			</div>
		`;
	}

	static override styles = [
		ButtonStyles,
		LinkStyles,
		TypographyStyles,
		MarginStyles,
		FormControlStyles,
		css`
		:host {
			display: flex;
			flex-direction: column;
			width: 100%;
			box-sizing: border-box;
			padding: 0 2.2rem;
		}
		.messages {
			flex: 1;
		}
		#textInput {
			max-width: 45rem;
			margin: 0 auto;
		}
		.input-container {
			bottom: 2rem;
			margin: 0px auto;
			max-width: 50rem;
			position: relative;
			width: 100%;
		}
		.input-container svg {
			bottom: 0;
			left: 2rem;
			margin: auto;
			position: absolute;
			top: 0;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tourney-chat': RkTourneyChat;
	}
}
