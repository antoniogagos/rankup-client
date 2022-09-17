import { ListenersController } from 'common/lit-controllers/listeners-controller/listeners-controller.js';
import type { ReactiveController } from 'lit';
import { adoptStyles } from 'lit';

import { IEventsMap } from '../types/types.js';
import type { AnimationKeys } from './animations-presets.js';
import { AnimationsPresets } from './animations-presets.js';
import { whenVisible } from './common/when-visible.js';
// @ts-ignore
import BoxOverlayStyles from './styles/box-overlay.css' assert { type: 'css' };
import type {
  AnimationOptions,
  EventsMap,
  HorizontalAlign,
  Options,
  ReactiveControllerHostElement,
  Rect,
  VerticalAlign,
} from './types';

type Events = keyof EventsMap<OverlayController>;

/**
 * @fires before-close-overlay
 * @fires before-open-overlay
 * @fires close-transition-end
 * @fires find-overlay-container
 * @fires open-transition-end
 * @fires overlay-closed
 * @fires overlay-opened
 */
export class OverlayController<
  T extends ReactiveControllerHostElement = ReactiveControllerHostElement,
  EM extends IEventsMap = EventsMap<any>,
> implements ReactiveController
{
  /**
   * By default all overlays goes into a common container, which is discovered throughout the
   * 'find-overlay-container' event. You can specify a container for a single instance with this param
   */
  container: HTMLElement | null;

  canceled: boolean;

  ignored: boolean;

  cancelOnOutsideClick: boolean;

  cancelOnPopState: boolean;

  closeOthers: boolean;

  closeWhenOtherIsOpened: boolean;

  noAutoFocus: boolean;

  noAutoPositionize: boolean;

  noAutoPositionizeOnResize: boolean;

  noCancelOnEscKey: boolean;

  noHorizontalOverlap: boolean;

  noVerticalOverlap: boolean;

  preventAutoClose: boolean;

  restorePreviousFocusedElementOnClose: boolean;

  transparentBackdrop: boolean;

  withAnimation: boolean;

  withBackdrop: boolean;

  addOverlayStyles: boolean;

  globalMargin = 0;

  animationIn: AnimationKeys | Keyframe[];

  animationOut: AnimationKeys | Keyframe[];

  animationInOptions: AnimationOptions | null;

  animationOutOptions: AnimationOptions | null;

  stylesheets: CSSStyleSheet[] | null;

  horizontalAlign: HorizontalAlign;

  verticalAlign: VerticalAlign;

  horizontalOffset: number;

  verticalOffset: number;

  positionRect: Rect | null;

  positionTarget: Element | null;

  positionEvent: MouseEvent | null;

  #animation: Animation | null = null;

  #attachedToContainer = false;

  #handleOutsideClick: ((evt: MouseEvent) => void) | null = null;

  #isClosing = false;

  #initialized = false;

  #listeners: ListenersController<EM> | null = null;

  #opened = false;

  #focusedElementBeforeOpeningOverlay: HTMLElement | null = null;

  constructor(public host: T, opts: Options<T, EM> = {}) {
    this.canceled = false;
    this.ignored = false;
    this.addOverlayStyles = opts.addOverlayStyles ?? true;
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
    this.globalMargin = opts.globalMargin ?? 6;
    this.animationIn = opts.animationIn !== undefined ? opts.animationIn : 'slide-in-from-top';
    this.animationOut = opts.animationOut !== undefined ? opts.animationOut : 'fade-out';
    this.animationInOptions = opts.animationInOptions ?? {
      duration: 192,
      easing: 'cubic-bezier(.3,0,.5,1)',
    };
    this.animationOutOptions = opts.animationOutOptions ?? {
      duration: 128,
      easing: 'cubic-bezier(.3,0,.5,1)',
    };
    this.stylesheets = opts.stylesheets ?? null;
    this.horizontalAlign = opts.horizontalAlign ?? 'center';
    this.horizontalOffset = opts.horizontalOffset ?? 0;
    this.positionEvent = opts.positionEvent ?? null;
    /** @type {Element | null} */
    this.positionTarget = opts.positionTarget ?? null;
    this.positionRect = opts.positionRect ?? null;
    // /** @type {Placement} */
    // this.placement = Placement.Top;
    this.verticalAlign = opts.verticalAlign ?? 'top';
    this.verticalOffset = opts.verticalOffset ?? 0;
    if (opts.listeners) {
      this.#listeners = new ListenersController(host, [[host, opts.listeners]], {
        removeListenersOnHostDisconnected: false,
      });
    }
    this.#handleOutsideClick = opts.handleOutsideClick ?? null;
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

  get whenAnimationEnds(): Promise<void> {
    if (this.#animation) {
      const animation = this.#animation;
      return new Promise((resolve, reject) => {
        const { onfinish } = animation;
        animation.onfinish = ev => {
          try {
            onfinish?.call(animation, ev);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
      });
    }
    return Promise.resolve();
  }

  hostConnected() {
    this.host.setAttribute('role', 'dialog');
    if (this.addOverlayStyles) {
      this.#addBoxOverlayStyles();
    }
    whenVisible(this.host as HTMLElement).then(() => {
      const input = this.host.shadowRoot?.querySelector('[autofocus]') as HTMLInputElement;
      input?.focus();
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
        await b4evtGlobal!.detail.wait;
      } catch (error) {
        console.error('before-open-overlay error', error);
      }
    }
    try {
      await b4evtHost!.detail.wait;
    } catch (error) {
      console.error('before-open-overlay error', error);
    }
    this.#beforeOpenOverlay();
    this.#initialize();
    this.#animateEntry();
    this.#opened = true;
    this.host.toggleAttribute('overlay:opened', true);
    if (!this.noAutoFocus) {
      requestAnimationFrame(() => this.host?.focus());
    }
    this.#dispatchEvent('overlay-opened', {
      overlayController: this,
      overlay: this.host,
    });
  }

  async close(opts?: { noAnimation?: boolean }) {
    const { noAnimation = false } = opts ?? {};
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

  handleOutsideClick(evt: MouseEvent) {
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
      if (this.stylesheets != null && this.host.shadowRoot) {
        adoptStyles(this.host.shadowRoot, this.stylesheets);
      }
      this.#initialized = true;
    }
  }

  #addBoxOverlayStyles() {
    if (this.host.shadowRoot) {
      adoptStyles(this.host.shadowRoot, [BoxOverlayStyles]);
    }
  }

  #attachToContainer() {
    if (!this.#attachedToContainer) {
      let { container } = this;
      const { host } = this;
      if (!container) {
        const evt = this.#dispatchEvent(
          'find-overlay-container',
          { overlay: host, overlayController: this, container: null },
          { target: window },
        );
        container = evt?.detail.container ?? document.body;
      }
      container!.append(host);
      this.#attachedToContainer = true;
    }
  }

  async #animateEntry(): Promise<void> {
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

  #animateExit(): Promise<void> {
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
      } catch (error) {
        console.error(error);
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
      const hostRectUpdated: Rect = {
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
        hostRectUpdated.left = hor.left as number;
        positionizeLeft = true;
      }
      if (ver.top !== null) {
        hostRectUpdated.top = ver.top as number;
        positionizeTop = true;
      }
      hostRectUpdated.bottom = ver.bottom as number;
      hostRectUpdated.right = hor.right as number;
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

  #getHorizontalPosition({ hostRect, targetRect }: { hostRect: Rect; targetRect: Rect }): {
    fitAtDesiredPosition: boolean;
    left: number | null;
    right: number | null;
  } {
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
    /** @type {number | null} */
    let left = null;
    /** @type {number | null} */
    let right = null;
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
      // case 'right':
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

  #getVerticalPosition({ hostRect, targetRect }: { hostRect: Rect; targetRect: Rect }): {
    fitAtDesiredPosition: boolean;
    top: number | null;
    bottom: number | null;
  } {
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
    let top: number | null = null;
    let bottom: number | null = null;
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

  #dispatchEvent<EventName extends Events>(
    eventName: EventName,
    detail: EventsMap<OverlayController>[EventName]['detail'],
    opts?: { target?: EventTarget; cancelable?: boolean },
  ): EventsMap<OverlayController>[EventName] | null {
    const { target, cancelable = false } = opts ?? {};
    try {
      const evt = new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        cancelable,
        detail,
      });
      (target ?? this.host).dispatchEvent(evt);
      return evt as EventsMap<OverlayController>[EventName];
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  #parsePositionValue(value: number | null): number | null {
    return typeof value === 'number' ? Math.max(Math.round(value), this.globalMargin) : null;
  }

  #getActiveElement(docOrShadow: Document | ShadowRoot = document): Element | null {
    let { activeElement } = docOrShadow;
    while (activeElement?.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }
    return activeElement;
  }

  #getPositionTargetRect(): Rect {
    if (this.positionRect) {
      return this.positionRect;
    }
    if (this.positionTarget) {
      let rect: Rect = this.positionTarget.getBoundingClientRect();
      if (this.positionTarget.ownerDocument !== document) {
        // In case the element is within a frame, getBoundingClientRect will
        // be relative to it's own view
        const ownerWindow = this.positionTarget.ownerDocument.defaultView;
        if (ownerWindow) {
          const { frameElement } = ownerWindow;
          if (frameElement) {
            const frameRect = frameElement.getBoundingClientRect();
            // Also, we consider that the iframe element itself could've been
            // scaled via transform scale. In that case, we can compute how much
            // by looking at the ownerDocument width and compare it with the frame
            const ownerWindowWidth =
              ownerWindow.visualViewport?.width ?? ownerWindow.document.body.offsetHeight;
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
    const { height: vvh, width: vvw } = window.visualViewport ?? {
      vvh: window.document.body.offsetHeight,
      vvw: window.document.body.offsetWidth,
    };
    return {
      bottom: vvh!,
      height: vvh!,
      left: 0,
      right: vvw!,
      top: 0,
      width: vvw!,
    };
  }

  get #isPositionedFromViewport() {
    return !this.positionRect && !this.positionTarget && !this.positionEvent;
  }

  #getAnimationPreset(animationName: AnimationKeys) {
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

  #computeSlideInAnimation({
    verticalAlign,
    horizontalAlign,
    noVerticalOverlap,
    isPositionedFromViewport,
  }: {
    verticalAlign: VerticalAlign;
    horizontalAlign: HorizontalAlign;
    noVerticalOverlap: boolean;
    isPositionedFromViewport: boolean;
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
