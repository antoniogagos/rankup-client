import { adoptStyles } from 'lit';
import { ListenersController } from '../../modules/lit-controllers/listeners-controller/listeners-controller.js';
import { whenVisible } from './common/when-visible.js';
import { AnimationsPresets } from './animations-presets.js';
// @ts-ignore
import BoxOverlayStyles from './styles/box-overlay.css' assert { type: 'css' };
/** @typedef {import('lit').ReactiveControllerHost} ReactiveControllerHost */
/** @typedef {import('lit').ReactiveElement} ReactiveElement */
/** @typedef {import('lit').ReactiveController} ReactiveController */
/** @template {HTMLElementEventMap} T @typedef {import('modules/html-element-typed-events').HTMLElementTypedEvents<T>} HTMLElementTypedEvents<T> */
/** @typedef {import('./types').AnimationOptions} AnimationOptions */
/** @typedef {import('./types').Placement} Placement */
/** @typedef {import('./types').HorizontalAlign} HorizontalAlign */
/** @typedef {import('./types').VerticalAlign} VerticalAlign */
/** @typedef {import('./types').Rect} Rect */
/** @typedef {import('./animations-presets').AnimationKeys} AnimationKeys */

/**
 * TBD
 *
 * instead of horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap
 * we should have placement =
 *   'top-start', 'top', 'top-end',
 *   'left-start', 'left', 'left-end',
 *   'bottom-start', 'bottom', 'bottom-end',
 *   'right-start', 'right', 'right-end',
 *
 * @type {import('./types').PlacementEnum}
 */
export const Placement = {
  TopStart: 'top-start',
  Top: 'top',
  TopEnd: 'top-end',
  LeftStart: 'left-start',
  Left: 'left',
  LeftEnd: 'left-end',
  BottomStart: 'bottom-start',
  Bottom: 'bottom',
  BottomEnd: 'bottom-end',
  RightStart: 'right-start',
  Right: 'right',
  RightEnd: 'right-end',
};

/**
 * @fires before-close-overlay
 * @fires before-open-overlay
 * @fires close-transition-end
 * @fires find-overlay-container
 * @fires open-transition-end
 * @fires overlay-closed
 * @fires overlay-opened
 *
 * @template {ReactiveElement} T
 * @template [EventsMap = import('./types').EventsMap<T>]
 * @implements {ReactiveController}
 */
export class OverlayController {
  /**
   * @this OverlayController<T>
   * @param {T} host
   * @param {import('./types').Options<T, EventsMap>} [opts]
   */
  constructor(host, opts = {}) {
    /** @type {T & HTMLElementTypedEvents<EventsMap & HTMLElementEventMap>} */
    this.host = host;
    this.canceled = false;
    this.ignored = false;
    this.addOverlayStyles = opts.addOverlayStyles ?? true;
    /**
     * @type {Node?}
     * By default all overlays goes into a common container, which is discovered throught the
     * 'find-overlay-container' event. You can specify a container for a single instance with this param
     */
    this.container = opts.container ?? null;
    this.cancelOnOutsideClick = opts.cancelOnOutsideClick ?? true;
    this.cancelOnPopState = opts.cancelOnPopState ?? false;
    this.closeOthers = opts.closeOthers ?? true;
    this.closeWhenOtherIsOpened = opts.closeWhenOtherIsOpened ?? false;
    this.noAutoFocus = opts.noAutoFocus ?? false;
    this.noAutoPositionize = opts.noAutoPositionize ?? false;
    this.noAutoPositionizeOnResize = opts.noAutoPositionizeOnResize ?? false;
    this.noCancelOnEscKey = opts.noCancelOnEscKey ?? false;
    this.noHorizontalOverlap = opts.noHorizontalOverlap ?? false;
    this.noVerticalOverlap = opts.noVerticalOverlap ?? true;
    this.preventAutoClose = opts.preventAutoClose ?? false;
    this.restorePreviousFocusedElementOnClose = opts.restorePreviousFocusedElementOnClose ?? false;
    this.transparentBackdrop = opts.transparentBackdrop ?? false;
    this.withAnimation = opts.withAnimation ?? true;
    this.withBackdrop = opts.withBackdrop ?? true;
    /** @type {number} */
    this.globalMargin = opts.globalMargin ?? 6;
    /** @type {AnimationKeys | Keyframe[]} */
    this.animationIn = opts.animationIn !== undefined ? opts.animationIn : 'slide-in-from-top';
    /** @type {AnimationKeys | Keyframe[]} */
    this.animationOut = opts.animationOut !== undefined ? opts.animationOut : 'fade-out';
    /** @type {AnimationOptions | null} */
    this.animationInOptions = opts.animationInOptions ?? {
      duration: 192,
      easing: 'cubic-bezier(.3,0,.5,1)',
    };
    /** @type {AnimationOptions | null} */
    this.animationOutOptions = opts.animationOutOptions ?? {
      duration: 128,
      easing: 'cubic-bezier(.3,0,.5,1)',
    };
    /** @type {CSSStyleSheet[] | null} */
    this.stylesheets = opts.stylesheets ?? null;
    /** @type {HorizontalAlign} */
    this.horizontalAlign = opts.horizontalAlign ?? 'center';
    /** @type {number} */
    this.horizontalOffset = opts.horizontalOffset ?? 0;
    /**
     * @type {MouseEvent | null}
     * The mouse event that should be used to position the element. It takes preference over the positionTarget.
     */
    this.positionEvent = opts.positionEvent ?? null;
    /** @type {Element} */
    this.positionTarget = opts.positionTarget ?? null;
    /** @type {Rect} */
    this.positionRect = opts.positionRect ?? null;
    // /** @type {Placement} */
    // this.placement = Placement.Top;
    /** @type {VerticalAlign} defaults to 'top' */
    this.verticalAlign = opts.verticalAlign ?? 'top';
    /** @type {number} defaults to 0 */
    this.verticalOffset = opts.verticalOffset ?? 0;
    if (opts.listeners) {
      this.#listeners = new ListenersController(host, [[host, opts.listeners]], {
        removeListenersOnHostDisconnected: false,
      });
    }
    this.#handleOutsideClick = opts.handleOutsideClick;
    host.addController(this);
    this.open();
  }

  get animation() {
    return this.#animation;
  }

  get animating() {
    return Boolean(this.animation);
  }

  get confirmed() {
    return !this.canceled && !this.ignored;
  }

  get opened() {
    return this.#opened;
  }

  get whenAnimationEnds() {
    if (!this.#animation) return Promise.resolve();
    const { onfinish } = this.#animation;
    return new Promise((resolve, reject) => {
      this.#animation.onfinish = ev => {
        try {
          onfinish.call(this.#animation, ev);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
    });
  }

  /** @type {Animation | null} */
  #animation = null;

  #attachedToContainer = false;

  /** @type {(evt: MouseEvent) => void} */
  #handleOutsideClick = null;

  #isClosing = false;

  #initialized = false;

  /** @type {ListenersController<EventsMap>} */
  #listeners = null;

  #opened = false;

  /** @type {HTMLElement} */
  #focusedElementBeforeOpeningOverlay = null;

  hostConnected() {
    this.host.setAttribute('role', 'dialog');
    if (this.addOverlayStyles) {
      this.#addBoxOverlayStyles();
    }
    whenVisible(/** @type {HTMLElement} */ (this.host)).then(() => {
      /** @type {HTMLInputElement} */
      (this.host.shadowRoot?.querySelector('[autofocus]'))?.focus();
    });
  }

  hostDisconnected() {
    this.#opened = false;
    this.host.toggleAttribute('overlay:opened', false);
    this.positionTarget?.toggleAttribute('overlay-opened', false);
    const evtDetail = { overlayController: this, overlay: this.host };
    this.#dispatchEvent('overlay-closed', evtDetail);
    // previous event is only listened by the "host" because it's not connected
    this.#dispatchEvent('overlay-closed', evtDetail, { target: window });
    // this.#removeBoxOverlayStyles();
    this.host.removeController(this);
    this.#listeners?.detach();
    this.#listeners = null;
    if (this.restorePreviousFocusedElementOnClose) {
      this.#focusedElementBeforeOpeningOverlay?.focus();
    }
    this.#focusedElementBeforeOpeningOverlay = null;
  }

  async open() {
    const activeElem = this.#getActiveElement();
    if (activeElem instanceof HTMLElement) {
      this.#focusedElementBeforeOpeningOverlay = activeElem;
    }
    // Note: This is problematic. the overlay isn't connected yet so we need to emit from the window
    // in order to others (overlay-container) to listen to this.
    // But then, it isn't intuitive that this isn't firing this event from the host.
    // ATM the solution is to fire from both places
    const evtDetail = { overlay: this.host, overlayController: this };
    const b4evtHost = this.#dispatchEvent('before-open-overlay', { ...evtDetail, wait: null });
    if (!this.host.isConnected) {
      const b4evtGlobal = this.#dispatchEvent(
        'before-open-overlay',
        { ...evtDetail, wait: null },
        { target: window },
      );
      try {
        await b4evtGlobal.detail.wait;
      } catch (err) {
        console.error('before-open-overlay error', err);
      }
    }
    try {
      await b4evtHost.detail.wait;
    } catch (err) {
      console.error('before-open-overlay error', err);
    }
    this.#beforeOpenOverlay();
    this.#initialize();
    this.#animateEntry();
    this.#opened = true;
    this.host.toggleAttribute('overlay:opened', true);
    if (!this.noAutoFocus) {
      requestAnimationFrame(() => this.host?.focus());
    }
    this.#dispatchEvent('overlay-opened', { overlayController: this, overlay: this.host });
  }

  /**
   * @param {{
   *   noAnimation?: boolean
   * }} [p]
   */
  async close({ noAnimation = false } = {}) {
    if (this.#isClosing) return;
    this.#isClosing = true;
    try {
      this.#dispatchEvent('before-close-overlay', { overlayController: this, overlay: this.host });
      this.endAnimation();
      if (noAnimation === false) {
        await this.#animateExit();
      }
      this.host.remove();
    } finally {
      this.#isClosing = false;
    }
  }

  cancel() {
    this.canceled = true;
    this.close();
  }

  ignore() {
    this.ignored = true;
    this.close();
  }

  endAnimation() {
    this.#animation?.finish();
  }

  /** @param {MouseEvent} evt */
  handleOutsideClick(evt) {
    this.#handleOutsideClick?.(evt);
  }

  /** @return {Promise<{canceled: boolean, ignored: boolean, confirmed: boolean}>} */
  whenClosed() {
    return new Promise(resolve => {
      const end = () =>
        resolve({
          canceled: this.canceled,
          ignored: this.ignored,
          confirmed: !this.confirmed,
        });
      if (this.opened) {
        end();
      } else {
        this.host.addEventListener('overlay-closed', () => end(), { once: true });
      }
    });
  }

  #initialize() {
    if (!this.#initialized) {
      this.host.setAttribute('tabindex', '-1');
      this.host.style.setProperty('display', 'none');
      this.#attachToContainer();
      if (this.stylesheets != null) {
        adoptStyles(this.host.shadowRoot, this.stylesheets);
      }
      this.#initialized = true;
    }
  }

  #addBoxOverlayStyles() {
    adoptStyles(this.host.shadowRoot, [BoxOverlayStyles]);
  }

  #attachToContainer() {
    if (!this.#attachedToContainer) {
      let { container } = this;
      if (!container) {
        const evt = this.#dispatchEvent(
          'find-overlay-container',
          { overlay: this.host, overlayController: this, container: null },
          { target: window },
        );
        container = evt.detail.container ?? document.body;
      }
      container.appendChild(this.host);
      this.#attachedToContainer = true;
    }
  }

  /** @returns {Promise<void>} */
  async #animateEntry() {
    // wait for the overlay content to be rendered (opacity 0)
    await this.host.updateComplete;
    return new Promise(resolve => {
      this.host.style.removeProperty('display');
      this.updatePosition();
      this.host.style.removeProperty('opacity');
      if (this.withAnimation && this.animationIn != null) {
        const animationIn = Array.isArray(this.animationIn)
          ? this.animationIn
          : this.#getAnimationPreset(this.animationIn);
        if (animationIn) {
          this.#animation = this.host.animate(animationIn, {
            ...this.animationInOptions,
            /** @type {FillMode} */
            fill: 'forwards',
          });
          this.#animation.onfinish = () => {
            this.#animation = null;
            this.#dispatchEvent('open-transition-end', {
              overlayController: this,
              overlay: this.host,
            });
            resolve();
          };
        } else {
          this.#dispatchEvent('open-transition-end', {
            overlayController: this,
            overlay: this.host,
          });
          console.warn('Overlay.AnimationInNotFound');
          resolve();
        }
      } else {
        this.#dispatchEvent('open-transition-end', { overlayController: this, overlay: this.host });
        resolve();
      }
    });
  }

  /** @returns {Promise<void>} */
  #animateExit() {
    return new Promise(resolve => {
      try {
        if (this.withAnimation && this.animationOut != null) {
          const animationOut = Array.isArray(this.animationOut)
            ? this.animationOut
            : this.#getAnimationPreset(this.animationOut);
          if (animationOut) {
            this.#animation = this.host.animate(animationOut, {
              ...this.animationOutOptions,
              /** @type {FillMode} */
              fill: 'forwards',
            });
            this.#animation.onfinish = () => {
              this.#animation = null;
              this.#dispatchEvent('close-transition-end', {
                overlayController: this,
                overlay: this.host,
              });
              resolve();
            };
          } else {
            console.warn('Overlay.AnimationOutNotFound');
            resolve();
          }
        } else {
          resolve();
        }
      } catch (err) {
        console.error(err);
        resolve();
      }
    });
  }

  #beforeOpenOverlay() {
    // this.host.attributeStyleMap.set('opacity', CSS.number(1));
    this.positionTarget?.toggleAttribute('overlay-opened', true);
  }

  updatePosition() {
    const targetRect = this.#getPositionTargetRect();
    // This positionize code is bad. Sorry.
    if (targetRect != null) {
      let positionizeTop = false;
      let positionizeLeft = false;
      const hostRect = this.host.getBoundingClientRect();
      /** @type {Rect} */
      const hostRectUpdated = {
        top: hostRect.top,
        left: hostRect.left,
        right: hostRect.right,
        bottom: hostRect.bottom,
        width: hostRect.width,
        height: hostRect.height,
      };
      const hor = this.#getHorizontalPosition({ hostRect, targetRect });
      const ver = this.#getVerticalPosition({ hostRect, targetRect });
      if (hor.left !== null) {
        hostRectUpdated.left = /** @type {number} */ (hor.left);
        positionizeLeft = true;
      }
      if (ver.top !== null) {
        hostRectUpdated.top = /** @type {number} */ (ver.top);
        positionizeTop = true;
      }
      hostRectUpdated.bottom = /** @type {number} */ (ver.bottom);
      hostRectUpdated.right = /** @type {number} */ (hor.right);
      const cssTop = positionizeTop ? Math.round(hostRectUpdated.top) + 'px' : 'auto';
      const cssBottom = Number.isFinite(hostRectUpdated.bottom)
        ? Math.round(hostRectUpdated.bottom) + 'px'
        : 'auto';
      const cssLeft = positionizeLeft ? Math.round(hostRectUpdated.left) + 'px' : 'auto';
      const cssRight = Number.isFinite(hostRectUpdated.right)
        ? Math.round(hostRectUpdated.right) + 'px'
        : 'auto';
      this.host.style.setProperty('top', cssTop);
      this.host.style.setProperty('bottom', cssBottom);
      this.host.style.setProperty('left', cssLeft);
      this.host.style.setProperty('right', cssRight);
    }
  }

  /**
   * @param {{
   *   hostRect: Rect,
   *   targetRect: Rect,
   * }} param0
   * @returns {{
   *   fitAtDesiredPosition: boolean,
   *   left: number | null,
   *   right: number | null,
   * }}
   */
  #getHorizontalPosition({ hostRect, targetRect }) {
    const offset = +this.horizontalOffset;
    const windowWidth = window.innerWidth;
    const rectWidth = hostRect.width + offset;
    const leftWidth =
      (this.noHorizontalOverlap ? targetRect.left : targetRect.right) - this.globalMargin;
    const rightWidth =
      windowWidth -
      this.globalMargin -
      (this.noHorizontalOverlap ? targetRect.right : targetRect.left);
    const fitsLeft = leftWidth >= rectWidth;
    const fitsRight = rightWidth >= rectWidth;
    // noHorizontalOverlap doesn't affect center alignment.
    const leftWidthFromCenter = targetRect.left - this.globalMargin + targetRect.width / 2;
    const rightWidthFromCenter =
      windowWidth - this.globalMargin - targetRect.right + targetRect.width / 2;
    const fitsCenter =
      leftWidthFromCenter >= rectWidth / 2 && rightWidthFromCenter >= rectWidth / 2;
    let left;
    let right;
    let fitAtDesiredPosition = true;
    switch (this.horizontalAlign) {
      case 'left':
        if (fitsLeft) {
          right =
            windowWidth - (this.noHorizontalOverlap ? targetRect.left : targetRect.right) - offset;
        } else {
          left = 0;
          fitAtDesiredPosition = false;
        }
        break;
      case 'center':
        if (fitsCenter) {
          left = targetRect.left + targetRect.width / 2 - (hostRect.width / 2 + offset);
        } else {
          fitAtDesiredPosition = false;
          if (rightWidth < leftWidth) {
            right = 0;
          } else {
            left = rightWidth >= leftWidth ? 0 : windowWidth - hostRect.width;
          }
        }
        break;
      case 'right':
      default:
        if (fitsRight) {
          left = (this.noHorizontalOverlap ? targetRect.right : targetRect.left) + offset;
        } else {
          // left = rightWidth >= leftWidth ? 0 : windowWidth - hostRect.width;
          right = 0;
          fitAtDesiredPosition = false;
        }
        break;
    }
    return {
      fitAtDesiredPosition,
      left: this.#parsePositionValue(left),
      right: this.#parsePositionValue(right),
    };
  }

  /**
   * @param {{
   *   hostRect: Rect,
   *   targetRect: Rect,
   * }} param0
   * @returns {{
   *   fitAtDesiredPosition: boolean,
   *   top: number | null,
   *   bottom: number | null,
   * }}
   */
  #getVerticalPosition({ hostRect, targetRect }) {
    const offset = +this.verticalOffset;
    const windowHeight = window.innerHeight;
    const rectHeight = hostRect.height + offset;
    const topHeight =
      (this.noVerticalOverlap ? targetRect.top : targetRect.bottom) - this.globalMargin;
    const bottomHeight =
      windowHeight -
      this.globalMargin -
      (this.noVerticalOverlap ? targetRect.bottom : targetRect.top);
    const fitsTop = topHeight >= rectHeight;
    const fitsBottom = bottomHeight >= rectHeight;
    const topHeightFromMiddle = targetRect.top - this.globalMargin + targetRect.height / 2;
    const bottomHeightFromMiddle =
      windowHeight - this.globalMargin - targetRect.bottom + targetRect.height / 2;
    const fitsMiddle =
      topHeightFromMiddle >= rectHeight / 2 && bottomHeightFromMiddle >= rectHeight / 2;
    let top;
    let bottom;
    let fitAtDesiredPosition = true;
    switch (this.verticalAlign) {
      case 'top':
        if (fitsTop) {
          bottom =
            windowHeight - (this.noVerticalOverlap ? targetRect.top : targetRect.bottom) + offset;
        } else {
          top = offset;
          fitAtDesiredPosition = false;
        }
        break;
      case 'middle':
        if (fitsMiddle) {
          top = targetRect.top + targetRect.height / 2 - hostRect.height / 2 + offset;
        } else {
          fitAtDesiredPosition = false;
          if (bottomHeight >= topHeight) {
            top = offset;
          } else {
            bottom = offset;
          }
        }
        break;
      default:
        // 'bottom'
        if (fitsBottom) {
          top = (this.noVerticalOverlap ? targetRect.bottom : targetRect.top) + offset;
        } else {
          bottom = offset;
          fitAtDesiredPosition = false;
        }
        break;
    }
    return {
      fitAtDesiredPosition,
      top: this.#parsePositionValue(top),
      bottom: this.#parsePositionValue(bottom),
    };
  }

  /**
   * @template {keyof import('./events.types').EventsMap<this>} EventName
   * @param {EventName} eventName
   * @param {import('./events.types').EventsMap<this>[EventName]['detail']} detail
   * @param {{
   *   target?: EventTarget
   *   cancelable?: boolean
   * }} [p]
   * @returns {import('./events.types').EventsMap<this>[EventName] | null}
   */
  #dispatchEvent(eventName, detail, { target, cancelable = false } = {}) {
    try {
      const evt = /** @type {import('./events.types').EventsMap<this>[EventName]} */ (
        new CustomEvent(eventName, {
          bubbles: true,
          composed: true,
          cancelable,
          detail,
        })
      );
      (target ?? this.host).dispatchEvent(evt);
      return evt;
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  /**
   * @param {number} value
   * @returns {number?}
   */
  #parsePositionValue(value) {
    return typeof value === 'number' ? Math.max(Math.round(value), this.globalMargin) : null;
  }

  /**
   * @param {Document | ShadowRoot} docOrShadow
   * @returns {Element}
   */
  #getActiveElement(docOrShadow = document) {
    let { activeElement } = docOrShadow;
    while (activeElement?.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
  }

  /** @returns {Rect} */
  #getPositionTargetRect() {
    if (this.positionRect) {
      return this.positionRect;
    }
    if (this.positionTarget) {
      /** @type {Rect} */
      let rect = this.positionTarget.getBoundingClientRect();
      if (this.positionTarget.ownerDocument !== document) {
        // In case the element is within a frame, getBoundingClientRect will
        // be relative to it's own view
        const ownerWindow = this.positionTarget.ownerDocument.defaultView;
        const { frameElement } = ownerWindow;
        if (frameElement) {
          const frameRect = frameElement.getBoundingClientRect();
          // Also, we consider that the iframe element itself could've been
          // scaled via transform scale. In that case, we can compute how much
          // by looking at the ownerDocument width and compare it with the frame
          const ownerWindowWidth = ownerWindow.visualViewport.width;
          const scale = frameRect.width / ownerWindowWidth;
          rect = {
            bottom: scale * rect.bottom + frameRect.bottom,
            height: scale * rect.height,
            left: scale * rect.left + frameRect.left,
            right: scale * rect.right + frameRect.right,
            top: scale * rect.top + frameRect.top,
            width: scale * rect.width,
          };
        }
      }
      return rect;
    }
    if (this.positionEvent) {
      return {
        bottom: this.positionEvent.clientY,
        height: 0,
        left: this.positionEvent.clientX,
        right: this.positionEvent.clientX,
        top: this.positionEvent.clientY,
        width: 0,
      };
    }
    return {
      bottom: window.visualViewport.height,
      height: window.visualViewport.height,
      left: 0,
      right: window.visualViewport.width,
      top: 0,
      width: window.visualViewport.width,
    };
  }

  get #isPositionedFromViewport() {
    return !this.positionRect && !this.positionTarget && !this.positionEvent;
  }

  /**
   * @param {AnimationKeys} animationName
   */
  #getAnimationPreset(animationName) {
    if (animationName === 'slide-in') {
      return this.#computeSlideInAnimation({
        verticalAlign: this.verticalAlign,
        horizontalAlign: this.horizontalAlign,
        noVerticalOverlap: this.noVerticalOverlap,
        isPositionedFromViewport: this.#isPositionedFromViewport,
      });
    }
    return AnimationsPresets[animationName];
  }

  /**
   * @param {{
   *   verticalAlign: VerticalAlign
   *   horizontalAlign: HorizontalAlign
   *   noVerticalOverlap: boolean
   *   isPositionedFromViewport: boolean
   * }} param0
   * @returns
   */
  #computeSlideInAnimation({
    verticalAlign,
    horizontalAlign,
    noVerticalOverlap,
    isPositionedFromViewport,
  }) {
    if (noVerticalOverlap && verticalAlign !== 'middle') {
      if (verticalAlign === 'top') {
        return isPositionedFromViewport
          ? AnimationsPresets['slide-in-from-top']
          : AnimationsPresets['slide-in-from-bottom'];
      }
      return isPositionedFromViewport
        ? AnimationsPresets['slide-in-from-bottom']
        : AnimationsPresets['slide-in-from-top'];
    }
    if (horizontalAlign === 'left') {
      return isPositionedFromViewport
        ? AnimationsPresets['slide-in-from-left']
        : AnimationsPresets['slide-in-from-right'];
    }
    return isPositionedFromViewport
      ? AnimationsPresets['slide-in-from-right']
      : AnimationsPresets['slide-in-from-left'];
  }
}
