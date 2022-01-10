import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { property, query, state } from 'lit/decorators.js';
import { Task } from '@lit-labs/task';
// @ts-ignore
import ButtonStyles from 'samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import LinkStyles from 'samba/styles/link.css' assert { type: 'css' };
// @ts-ignore
import TypographyStyles from 'samba/styles/typography.css' assert { type: 'css' };
// @ts-ignore
import MarginStyles from 'samba/styles/margin.css' assert { type: 'css' };
// @ts-ignore
import FormControlStyles from 'samba/styles/form-control.css' assert { type: 'css' };
import { path } from '../../../lib/localization/rk-url-paths.js';
import { Icons } from '../../../authenticated-icons.js';

interface Message {
  id: number;
  value: string;
  completed: boolean;
}

export class RkTourneyChat extends LitElement {
  @property({ type: Boolean })
  hidden = true;

  @property({ type: Array })
  messages: Message[] = [];

  @query('#textInput') textField!: HTMLInputElement;

  shouldUpdate(): boolean {
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
    return html`
      ${this.messages.map(
        message => html`
          <li>${message.value}</li>
        `,
      )}
    `;
  }

  render() {
    return html`
      <ul class="messages">
        ${this._renderMessages()}
      </ul>
      <div class="input-container">
        ${Icons('happy-emoji', 24)}
        <input
          id="textInput"
          type="text"
          @keydown=${this._handleTextInput}
          @change=${this._handleTextInput}
          class="form-control"
          placeholder=${msg('Escribe un mensaje aquí')} />
      </div>
    `;
  }

  static styles = [
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
    `,
  ];
}

customElements.define('rk-tourney-chat', RkTourneyChat);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-chat': RkTourneyChat;
  }
}
