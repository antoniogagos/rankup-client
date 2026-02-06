import type { EventsMap } from './events.types.js';
import type { OverlayController } from './overlay-controller.js';
import OverlayContainerStyles from '@rankup/samba/overlay/styles/overlay-container.css';
import { adoptStyles } from 'lit';

type OverlayHost = HTMLElement & { overlayController?: OverlayController<any, any> };
type OverlayControllerAny = OverlayController<any, any>;
type OverlayEvents = EventsMap<OverlayControllerAny>;

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

	#addBackdropAnimation: Animation | null = null;

	#removeBackdropAnimation: Animation | null = null;

	#backdrops: WeakMap<OverlayHost, HTMLElement> = new WeakMap();

	#containerEl: HTMLElement;

	backdropFilterTarget: HTMLElement | null = null;

	backdropContentFilterStyle: string | null = null;

	get #overlays(): OverlayHost[] {
		const overlays = this.shadowRoot?.querySelectorAll<OverlayHost>('#container > *:not(.backdrop)') ?? [];
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
		window[m]('find-overlay-container', this.#onFindOverlayContainer as EventListener);
		window[m]('before-close-overlay', this.#onBeforeOverlayClose as EventListener);
		window[m]('before-open-overlay', this.#onBeforeOpenOverlay as EventListener);
		window[m]('overlay-opened', this.#onOverlayOpened as EventListener);
		window[m]('popstate', this.#onPopstate as EventListener);
	}

	#toggleListenersForOpenedOverlays({ enable }: { enable: boolean }) {
		const m = enable ? 'addEventListener' : 'removeEventListener';
		document[m]('keydown', this.#onDocumentKeydown as EventListener, { capture: true });
		document[m]('mousedown', this.#onDocumentMousedown as EventListener, { capture: true });
	}

	#onFindOverlayContainer = (evt: OverlayEvents['find-overlay-container']) => {
		const detail = evt.detail;
		detail.container = this.#containerEl;
	};

	#onBeforeOpenOverlay = (evt: OverlayEvents['before-open-overlay']) => {
		const { overlay, overlayController } = evt.detail;
		this.#closeOthers({ overlay, overlayController });
	};

	#onBeforeOverlayClose = (evt: OverlayEvents['before-close-overlay']) => {
		const { overlay, overlayController } = evt.detail;
		this.#removeOverlayBackdrop({ overlay, overlayController });
	};

	#onOverlayOpened = (evt: OverlayEvents['overlay-opened']) => {
		const { overlay, overlayController } = evt.detail;
		const withAnimation = !this.#removeBackdropAnimation;
		this.#addOverlayBackdrop({ overlay, overlayController, withAnimation });
		if (overlayController.cancelOnPopState) {
			window.history.pushState({}, '', window.location.href);
		}
	};

	#onDocumentMousedown = (evt: Event) => {
		const mouseEvent = evt as MouseEvent;
		const overlays = this.#overlays;
		const lastOverlay = overlays[overlays.length - 1];
		if (lastOverlay && mouseEvent.button === 0) {
			const { overlayController } = lastOverlay;
			const overlayClicked = evt.composedPath().includes(lastOverlay);
			if (!overlayClicked && overlayController) {
				overlayController.handleOutsideClick(mouseEvent);
				if (overlayController.cancelOnOutsideClick) {
					overlayController.close();
				}
			}
		}
	};

	#onDocumentKeydown = (evt: Event) => {
		const keyEvent = evt as KeyboardEvent;
		if (keyEvent.key === 'Escape' || keyEvent.keyCode === 27) {
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

	#addOverlayBackdrop(opts: { withAnimation?: boolean; overlay: OverlayHost; overlayController: OverlayControllerAny }) {
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
				const duration = Math.max(0, Number(currentAnimDuration ?? 192));
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

	#removeOverlayBackdrop(opts: { overlay: OverlayHost; overlayController: OverlayControllerAny }) {
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

	#closeOthers(opts: { overlay: OverlayHost; overlayController: OverlayControllerAny }) {
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
