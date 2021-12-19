/** @typedef {import('lit').ReactiveController} ReactiveController */
/** @typedef {import('lit').ReactiveControllerHost} ReactiveControllerHost */

/**
 * @implements {ReactiveController}
 */
export class VisibilityController {
  /**
   * @param {HTMLElement & ReactiveControllerHost} host
   * @param {function(boolean):void} callback
   */
  constructor(host, callback) {
    // @ts-ignore not sure how to document that ReactiveControllerHost is here an element
    if (host.nodeType !== Node.ELEMENT_NODE) throw new Error('InvalidHost');
    this.host = host;
    this.#callback = callback;
    host.addController(this);
  }

  /** @type {HTMLElement & ReactiveControllerHost} */
  host = null;

  /** @type {boolean} */
  #visible = false;

  /** @type {Function} */
  #callback = null;

  /** @type {IntersectionObserver} */
  #obs = null;

  get visible() {
    return this.#visible;
  }

  hostConnected() {
    this.#observeVisibility();
  }

  hostDisconnected() {
    this.#unobserveVisibility();
    this.#setVisibility(false);
  }

  detach() {
    this.#unobserveVisibility();
    this.host.removeController(this);
  }

  #observeVisibility() {
    this.#obs = new IntersectionObserver(([entry]) => this.#setVisibility(entry.isIntersecting), {
      rootMargin: '0px',
    });
    this.#obs.observe(this.host);
  }

  #unobserveVisibility() {
    this.#obs?.disconnect();
    this.#obs = null;
  }

  /** @param {boolean} visible */
  #setVisibility(visible) {
    if (visible !== this.#visible) {
      const old = this.#visible;
      this.#visible = visible;
      this.#callback?.(visible, old);
      if (visible) {
        this.host.requestUpdate();
      }
    }
  }
}
