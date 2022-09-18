import { adoptStyles } from 'lit';
import OverlayContainerStyles from 'samba/overlay/styles/overlay-container-css.js';
/** @typedef {import('./types').OverlayController<any, any>} OverlayController */

export class OverlayContainer extends HTMLElement {
	constructor() {
		super();
		this.backdropContentFilterStyle = 'grayscale(0.7)';
		this.backdropFilterTarget = null;
		const shadowRoot = this.attachShadow({ mode: 'open' });
		this.#containerEl = document.createElement('div');
		this.#containerEl.setAttribute('id', 'container');
		shadowRoot.append(this.#containerEl);
		adoptStyles(shadowRoot, [OverlayContainerStyles]);
	}

	/** @type {Animation | null} */
	#addBackdropAnimation = null;

	/** @type {Animation | null} */
	#removeBackdropAnimation = null;

	/** @type {WeakMap<HTMLElement, HTMLElement>} */
	#backdrops = new WeakMap();

	/** @type {HTMLElement} */
	#containerEl;

	/** @type {HTMLElement | null} */
	backdropFilterTarget = null;

	/** @type {import('./types').CustomElementClass[]} */
	get #overlays() {
		const overlays = /** @type {import('./types').CustomElementClass[]} */ (
			this.shadowRoot?.querySelectorAll('#container > *:not(.backdrop)') ?? []
		);
		return [...overlays];
	}

	connectedCallback() {
		this.#toggleListenersForOpenedOverlays({ enable: true });
		this.#toggleListeners({ enable: true });
	}

	disconnectedCallback() {
		this.#toggleListenersForOpenedOverlays({ enable: false });
		this.#toggleListeners({ enable: false });
	}

	closeAll() {
		for (const overlay of this.#overlays) overlay.overlayController?.close();
	}

	/** @param {{enable: boolean}} p */
	#toggleListeners({ enable }) {
		const m = enable ? 'addEventListener' : 'removeEventListener';
		const _m = /** @type {'addEventListener'} */ (m);
		window[_m]('find-overlay-container', this.#onFindOverlayContainer);
		window[_m]('before-close-overlay', this.#onBeforeOverlayClose);
		window[_m]('before-open-overlay', this.#onBeforeOpenOverlay);
		window[_m]('overlay-opened', this.#onOverlayOpened);
		window[_m]('popstate', this.#onPopstate);
	}

	/** @param {{enable: boolean}} p */
	#toggleListenersForOpenedOverlays({ enable }) {
		const m = enable ? 'addEventListener' : 'removeEventListener';
		const _m = /** @type {'addEventListener'} */ (m);
		document[_m]('keydown', this.#onDocumentKeydown, { capture: true });
		document[_m]('mousedown', this.#onDocumentMousedown, { capture: true });
	}

	/** @param {import('./events.types').EventsMap['find-overlay-container']} evt */
	#onFindOverlayContainer = evt => {
		const _evt = evt;
		_evt.detail.container = this.#containerEl;
	};

	/** @param {import('./events.types').EventsMap['before-open-overlay']} evt */
	#onBeforeOpenOverlay = evt => {
		const { overlay, overlayController } = evt.detail;
		this.#closeOthers({ overlay, overlayController });
	};

	/** @param {import('./events.types').EventsMap['before-close-overlay']} evt */
	#onBeforeOverlayClose = evt => {
		const { overlay, overlayController } = evt.detail;
		this.#removeOverlayBackdrop({ overlay, overlayController });
	};

	/** @param {import('./events.types').EventsMap['overlay-opened']} evt */
	#onOverlayOpened = evt => {
		const { overlay, overlayController } = evt.detail;
		const withAnimation = !this.#removeBackdropAnimation;
		this.#addOverlayBackdrop({ overlay, overlayController, withAnimation });
		if (overlayController.cancelOnPopState) {
			window.history.pushState({}, '', window.location.href);
		}
	};

	/** @param {MouseEvent} evt */
	#onDocumentMousedown = evt => {
		const overlays = this.#overlays;
		const lastOverlay = overlays[overlays.length - 1];
		if (lastOverlay && evt.button === 0) {
			const { overlayController } = lastOverlay;
			const overlayClicked = evt.composedPath().includes(lastOverlay);
			if (!overlayClicked && overlayController) {
				overlayController.handleOutsideClick(evt);
				if (overlayController.cancelOnOutsideClick) {
					overlayController.close();
				}
			}
		}
	};

	/** @param {KeyboardEvent} evt */
	#onDocumentKeydown = evt => {
		if (evt.key === 'Escape' || evt.keyCode === 27) {
			const overlays = this.#overlays;
			const lastOverlay = overlays[overlays.length - 1];
			if (lastOverlay) {
				const { overlayController } = lastOverlay;
				if (overlayController && !overlayController.noCancelOnEscKey) {
					overlayController.cancel();
					evt.stopImmediatePropagation();
				}
			}
		}
	};

	#onPopstate = () => {
		const overlays = this.#overlays;
		const lastOverlay = overlays[overlays.length - 1];
		if (lastOverlay) {
			const { overlayController } = lastOverlay;
			if (overlayController && overlayController.cancelOnPopState) {
				overlayController.close();
			}
		}
	};

	#updateContentFilterStyle() {
		const qs = '.backdrop:not(.transparent):not([is-closing])';
		const visibleBackdrop = this.shadowRoot?.querySelector(qs);
		this.#toggleContentFilterStyle(Boolean(visibleBackdrop));
	}

	/** @param {boolean} enable */
	#toggleContentFilterStyle(enable) {
		requestAnimationFrame(() => {
			if (this.backdropContentFilterStyle && this.backdropFilterTarget) {
				if (enable) {
					this.backdropFilterTarget.style.setProperty('filter', this.backdropContentFilterStyle);
				} else {
					this.backdropFilterTarget.style.removeProperty('filter');
				}
			}
		});
	}

	/**
	 * Call this method just before opening the overlay.
	 * @param {{
	 *   withAnimation?: boolean
	 *   overlay: HTMLElement
	 *   overlayController: OverlayController
	 * }} opts
	 */
	#addOverlayBackdrop(opts) {
		const { overlay, overlayController, withAnimation = true } = opts ?? {};
		const { opened, withBackdrop, transparentBackdrop } = overlayController;
		let backdrop = this.#backdrops.get(overlay);
		this.#removeBackdropAnimation?.finish();
		this.#removeBackdropAnimation = null;
		this.#addBackdropAnimation?.finish();
		this.#addBackdropAnimation = null;
		if (opened && withBackdrop && !backdrop) {
			backdrop = document.createElement('div');
			backdrop.classList.add('backdrop');
			if (transparentBackdrop) {
				backdrop.classList.add('transparent');
			}
			this.#backdrops.set(overlay, backdrop);
			if (withAnimation) {
				const currentAnim = overlayController.animation;
				const currentAnimDuration = currentAnim?.effect?.getComputedTiming().activeDuration;
				const duration = Math.max(0, currentAnimDuration ?? 192);
				const animation = backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
					duration,
					easing: 'cubic-bezier(0.4, 0.4, 0, 1)',
					fill: 'forwards',
				});
				this.#addBackdropAnimation = animation;
				animation.onfinish = () => {
					if (animation === this.#addBackdropAnimation) {
						this.#addBackdropAnimation = null;
					}
				};
			} else {
				backdrop.style.setProperty('opacity', '1');
			}
			overlay.before(backdrop);
			this.#updateContentFilterStyle();
		}
	}

	/**
	 * @param {{
	 *   overlay: HTMLElement
	 *   overlayController: OverlayController
	 * }} opts
	 */
	#removeOverlayBackdrop(opts) {
		const { overlay } = opts ?? {};
		const backdrop = this.#backdrops.get(overlay);
		if (backdrop) {
			this.#addBackdropAnimation?.finish();
			this.#removeBackdropAnimation?.finish();
			this.#removeBackdropAnimation = backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 128,
				easing: 'cubic-bezier(0.4, 0.4, 0, 1)',
				fill: 'forwards',
			});
			this.#backdrops.delete(overlay);
			this.#removeBackdropAnimation.onfinish = () => {
				backdrop.remove();
				this.#removeBackdropAnimation = null;
			};
		}
	}

	/**
	 * @param {{
	 *   overlay: HTMLElement
	 *   overlayController: OverlayController
	 * }} opts
	 */
	#closeOthers(opts) {
		const { overlay, overlayController } = opts ?? {};
		const askingToCloseOthers = overlayController.closeOthers;
		const overlays = this.#overlays;
		for (let i = overlays.length - 1; i >= 0; i -= 1) {
			const previousOverlayController = overlays[i].overlayController;
			if (previousOverlayController) {
				const { opened, closeWhenOtherIsOpened, preventAutoClose } = previousOverlayController;
				// todo rethink these
				if (opened && askingToCloseOthers) {
					if (closeWhenOtherIsOpened) {
						previousOverlayController.close({ noAnimation: true });
					} else if (askingToCloseOthers && overlay !== overlays[i] && !preventAutoClose) {
						previousOverlayController.close({ noAnimation: true });
					}
				}
			} else {
				console.warn('OverlayContainer.OverlayControllerNotDefined', overlays[i]);
			}
		}
	}
}

customElements.define('overlay-container', OverlayContainer);
