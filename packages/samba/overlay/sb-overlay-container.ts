import { adoptStyles } from 'lit';
import { customElement } from 'lit/decorators.js';

import OverlayContainerStyles from './styles/overlay-container-css.js';
import type { CustomElementClass, EventsMap, OverlayController } from './types';

@customElement('sb-overlay-container')
export class SbOverlayContainer extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });
		this._containerEl = document.createElement('div');
		this._containerEl.setAttribute('id', 'container');
		shadowRoot.append(this._containerEl);
		adoptStyles(shadowRoot, [OverlayContainerStyles]);
	}

	backdropContentFilterStyle = 'grayscale(0.7)';

	backdropFilterTarget: HTMLElement | null = null;

	private _addBackdropAnimation: Animation | null = null;

	private _removeBackdropAnimation: Animation | null = null;

	private _backdrops: WeakMap<HTMLElement, HTMLElement> = new WeakMap();

	private _containerEl: HTMLElement;

	get #overlays(): CustomElementClass[] {
		const overlays = (this.shadowRoot?.querySelectorAll('#container > *:not(.backdrop)') ??
			[]) as CustomElementClass[];
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

	#toggleListeners({ enable }: { enable: boolean }) {
		const m = enable ? 'addEventListener' : 'removeEventListener';
		const _m = /** @type {'addEventListener'} */ m;
		window[_m]('find-overlay-container', this.#onFindOverlayContainer);
		window[_m]('before-close-overlay', this.#onBeforeOverlayClose);
		window[_m]('before-open-overlay', this.#onBeforeOpenOverlay);
		window[_m]('overlay-opened', this.#onOverlayOpened);
		window[_m]('popstate', this.#onPopstate);
	}

	#toggleListenersForOpenedOverlays({ enable }: { enable: boolean }) {
		const m = enable ? 'addEventListener' : 'removeEventListener';
		const _m = /** @type {'addEventListener'} */ m;
		document[_m]('keydown', this.#onDocumentKeydown, { capture: true });
		document[_m]('mousedown', this.#onDocumentMousedown, { capture: true });
	}

	#onFindOverlayContainer = (evt: Event) => {
		const _evt = evt as EventsMap['find-overlay-container'];
		_evt.detail.container = this._containerEl;
	};

	#onBeforeOpenOverlay = (evt: Event) => {
		const { overlay, overlayController } = (evt as EventsMap['before-open-overlay']).detail;
		this.#closeOthers({ overlay, overlayController });
	};

	#onBeforeOverlayClose = (evt: Event) => {
		const { overlay, overlayController } = (evt as EventsMap['before-close-overlay']).detail;
		this.#removeOverlayBackdrop({ overlay, overlayController });
	};

	#onOverlayOpened = (evt: Event) => {
		const { overlay, overlayController } = (evt as EventsMap['overlay-opened']).detail;
		const withAnimation = !this._removeBackdropAnimation;
		this.#addOverlayBackdrop({ overlay, overlayController, withAnimation });
		if (overlayController.cancelOnPopState) {
			window.history.pushState({}, '', window.location.href);
		}
	};

	#onDocumentMousedown = (evt: Event) => {
		const _evt = evt as MouseEvent;
		const overlays = this.#overlays;
		const lastOverlay = overlays[overlays.length - 1];
		if (lastOverlay && _evt.button === 0) {
			const { overlayController } = lastOverlay;
			const overlayClicked = _evt.composedPath().includes(lastOverlay);
			if (!overlayClicked && overlayController) {
				overlayController.handleOutsideClick(_evt);
				if (overlayController.cancelOnOutsideClick) {
					overlayController.close();
				}
			}
		}
	};

	#onDocumentKeydown = (evt: Event) => {
		const _evt = evt as KeyboardEvent;
		if (_evt.key === 'Escape' || _evt.keyCode === 27) {
			const overlays = this.#overlays;
			const lastOverlay = overlays[overlays.length - 1];
			if (lastOverlay) {
				const { overlayController } = lastOverlay;
				if (overlayController && !overlayController.noCancelOnEscKey) {
					overlayController.cancel();
					_evt.stopImmediatePropagation();
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

	#toggleContentFilterStyle(enable: boolean) {
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
	 */
	#addOverlayBackdrop(opts: {
		withAnimation?: boolean;
		overlay: HTMLElement;
		overlayController: OverlayController;
	}) {
		const { overlay, overlayController, withAnimation = true } = opts ?? {};
		const { opened, withBackdrop, transparentBackdrop } = overlayController;
		let backdrop = this._backdrops.get(overlay);
		this._removeBackdropAnimation?.finish();
		this._removeBackdropAnimation = null;
		this._addBackdropAnimation?.finish();
		this._addBackdropAnimation = null;
		if (opened && withBackdrop && !backdrop) {
			backdrop = document.createElement('div');
			backdrop.classList.add('backdrop');
			if (transparentBackdrop) {
				backdrop.classList.add('transparent');
			}
			this._backdrops.set(overlay, backdrop);
			if (withAnimation) {
				const currentAnim = overlayController.animation;
				const currentAnimDuration = currentAnim?.effect?.getComputedTiming().activeDuration;
				const duration = Math.max(0, currentAnimDuration ?? 192);
				const animation = backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
					duration,
					easing: 'cubic-bezier(0.4, 0.4, 0, 1)',
					fill: 'forwards',
				});
				this._addBackdropAnimation = animation;
				animation.onfinish = () => {
					if (animation === this._addBackdropAnimation) {
						this._addBackdropAnimation = null;
					}
				};
			} else {
				backdrop.style.setProperty('opacity', '1');
			}
			overlay.before(backdrop);
			this.#updateContentFilterStyle();
		}
	}

	#removeOverlayBackdrop(opts: { overlay: HTMLElement; overlayController: OverlayController }) {
		const { overlay } = opts ?? {};
		const backdrop = this._backdrops.get(overlay);
		if (backdrop) {
			this._addBackdropAnimation?.finish();
			this._removeBackdropAnimation?.finish();
			this._removeBackdropAnimation = backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 128,
				easing: 'cubic-bezier(0.4, 0.4, 0, 1)',
				fill: 'forwards',
			});
			this._backdrops.delete(overlay);
			this._removeBackdropAnimation.onfinish = () => {
				backdrop.remove();
				this._removeBackdropAnimation = null;
			};
		}
	}

	#closeOthers(opts: { overlay: HTMLElement; overlayController: OverlayController }) {
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
