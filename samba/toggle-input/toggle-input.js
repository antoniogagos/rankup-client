import { LitElement, html, css } from 'lit';

/**
 * @fires change
 * @fires change-prevented
 */
export class ToggleInput extends LitElement {
  static properties = {
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.checked = false;
    this.disabled = false;
  }

  /**
   * @param {Event} evt
   */
  #onInputChange(evt) {
    const input = /** @type {HTMLInputElement} */ (evt.currentTarget);
    const { checked } = input;
    if (this.disabled) {
      input.checked = !checked;
      this.dispatchEvent(new Event('change-prevented'));
      return;
    }
    const old = this.checked;
    this.checked = checked;
    this.dispatchEvent(
      new CustomEvent('change', {
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
    }
    input {
      display: none !important;
    }
    #toggle {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 14px;
      display: inline-block;
      width: 28px;
      min-width: 28px;
      height: 16px;
      position: relative;
      transition: background 0.15s;
      vertical-align: middle;
      width: 100%;
    }
    #toggle::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      border-radius: 14px;
      width: 14px;
      height: 14px;
      background: #fff;
      display: block;
      transition: left 0.15s;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 0 1px 0 rgba(0, 0, 0, 0.21);
    }
    input:checked + #toggle {
      background: var(--primary-color, #129bf6);
    }
    :host([disabled]) input:checked + #toggle {
      background: var(--background-color-500, #9e9e9e);
    }
    input:checked + #toggle::after {
      left: calc(100% - 15px);
    }
    .text:not(:empty) {
      margin-left: 5px;
    }
  `;
}

customElements.define('toggle-input', ToggleInput);
