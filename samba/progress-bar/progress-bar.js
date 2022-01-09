import { LitElement, html, css } from 'lit';

const STEP = 0.01;
const MIN_PROGRESS = 0;
const MAX_PROGRESS = 1;

/**
 * @customElement
 */
class ProgressBar extends LitElement {
  static is = 'progress-bar';

  static properties = {
    blockOn: { type: Number, attribute: 'block-on' },
    noBlur: { type: Boolean, attribute: 'no-blur' },
    progress: { type: Number },
    active: { type: Boolean },
  };

  constructor() {
    super();
    this.blockOn = 0.8;
    this.noBlur = false;
  }

  #progress = 0;

  #active = false;

  get progress() {
    return this.#progress;
  }

  set progress(progress) {
    this.#progress = progress;
    const scaleX = `scaleX(${progress})`;
    const bar = /** @type {HTMLElement} */ (this.shadowRoot.querySelector('#bar'));
    bar.style.transform = scaleX;
    bar.style.webkitTransform = scaleX;
    this.setAttribute('aria-valuenow', String(progress));
  }

  /** @param {boolean} value  */
  set active(value) {
    this.#active = value;
    if (value) {
      this.start();
    } else {
      this.finish();
    }
  }

  get active() {
    return this.#active;
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.setAttribute('hidden', '');
    this.setAttribute('aria-valuemin', String(MIN_PROGRESS));
    this.setAttribute('aria-valuemax', String(MAX_PROGRESS));
  }

  start() {
    this.progress = MIN_PROGRESS;
    this.removeAttribute('hidden');
    requestAnimationFrame(() => this.#nextProgress);
  }

  finish() {
    this.progress = MAX_PROGRESS;
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.setAttribute('hidden', '');
        this.progress = 0;
      });
    }, 80);
  }

  #nextProgress() {
    if (this.progress < this.blockOn) {
      this.progress += STEP;
      requestAnimationFrame(() => this.#nextProgress);
    }
  }

  render() {
    return html`
      <div id="bar">
        <div id="blur" ?hidden=${this.noBlur}></div>
      </div>
    `;
  }

  static styles = css`
    :host {
      background: #e0e0e0;
      display: block;
      height: 2px;
      left: 0;
      pointer-events: none;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 2100;
    }
    :host([hidden]),
    [hidden] {
      display: none !important;
    }
    #bar {
      background: var(--primary-color-600);
      height: 100%;
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.08s ease;
      width: 100%;
    }
    #blur {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px var(--primary-color-600), 0 0 5px var(--primary-color-600);
      opacity: 1;

      -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
      transform: rotate(3deg) translate(0px, -4px);
    }
  `;
}

window.customElements.define(ProgressBar.is, ProgressBar);
