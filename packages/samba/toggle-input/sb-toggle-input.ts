import { HTMLElementTypedEvents } from 'common/types/html-element-typed-events';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { EventDetail, IEventsMap } from 'types/types';

export type EventsMap = {
	'change-prevented': Event;
	change: CustomEvent<{
		old: boolean;
		value: boolean;
	}>;
};

/**
 * @fires change
 * @fires change-prevented
 */
@customElement('sb-toggle-input')
export class SbToggleInput
	extends LitElement
	implements HTMLElementTypedEvents<IEventsMap & HTMLElementEventMap>
{
	@property({ type: Boolean, reflect: true })
	checked = false;

	@property({ type: Boolean, reflect: true })
	disabled = false;

	#onInputChange(evt: Event) {
		const input = evt.currentTarget as HTMLInputElement;
		const { checked } = input;
		if (this.disabled) {
			input.checked = !checked;
			this.dispatchEvent(
				new CustomEvent<EventDetail<EventsMap['change-prevented']>>('change-prevented'),
			);
			return;
		}
		const old = this.checked;
		this.checked = checked;
		this.dispatchEvent(
			new CustomEvent<EventDetail<EventsMap['change']>>('change', {
				detail: { value: checked, old },
			}),
		);
	}

	render() {
		return html`
			<label part="label">
				<input type="checkbox" .checked=${this.checked} @change=${this.#onInputChange} />
				<div id="toggle" part="circle"></div>
				<div class="text" part="text"><slot></slot></div>
			</label>
		`;
	}

	static styles = css`
		:host {
			display: inline-block;
			user-select: none;
		}
		:host([disabled]) {
			color: var(--text-color-disabled, #00000061);
		}
		label {
			align-items: center;
			position: relative;
			display: grid;
			grid-template-columns: 28px 1fr;
			cursor: pointer;
		}
		input {
			display: none !important;
		}
		#toggle {
			background: #666;
			border-radius: 1.6rem;
			display: inline-block;
			width: 4rem;
			height: 2.2rem;
			position: relative;
			transition: background 0.15s;
			vertical-align: middle;
		}
		#toggle::after {
			content: '';
			position: absolute;
			top: 4px;
			left: 6px;
			border-radius: 1.6rem;
			width: 1.3rem;
			height: 1.3rem;
			background: #fff;
			display: block;
			transition: left 0.15s;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 0 1px 0 rgba(0, 0, 0, 0.21);
		}
		input:checked + #toggle {
			background: #0066ff;
		}
		:host([disabled]) input:checked + #toggle {
			background: var(--background-color-500, #9e9e9e);
		}
		input:checked + #toggle::after {
			left: calc(100% - 20px);
		}
		.text:not(:empty) {
			margin-left: 5px;
		}
	`;
}

declare global {
	interface HTMLElementTagNameMap {
		'sb-toggle-input': SbToggleInput;
	}
}
