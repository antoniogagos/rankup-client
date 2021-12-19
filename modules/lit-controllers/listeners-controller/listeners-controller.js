/** @typedef {import('lit').ReactiveController} ReactiveController */
/** @typedef {import('lit').ReactiveElement} ReactiveElement */
/** @template T @typedef {import('./types').TargetListenersPair<T>} TargetListenersPair<T> */

/**
 * Note:
 *   - the listeners are only added if the element is connected.
 *   - the controller is added until "detach" is called. So remove/append adds listeners again
 *
 * @template EventsMap
 * @implements {ReactiveController}
 */
export class ListenersController {
  /**
   * @param {ReactiveElement} host
   * @param {TargetListenersPair<EventsMap>[]} listeners
   * @param {Object} [p2]
   * @param {function(boolean):void} [p2.onListenersToggled]
   * @param {boolean} [p2.removeListenersOnHostDisconnected=true]
   */
  constructor(host, listeners, { onListenersToggled, removeListenersOnHostDisconnected } = {}) {
    this.host = host;
    this.removeListenersOnHostDisconnected = removeListenersOnHostDisconnected ?? true;
    this.#listeners = listeners;
    this.#onListenersToggled = onListenersToggled;
    host.addController(this);
  }

  /** @type {ReactiveElement} */
  host = null;

  /** @type {Function} */
  #onListenersToggled = null;

  /** @type {TargetListenersPair<EventsMap>[]} */
  #listeners = null;

  /** @type {boolean} */
  #listenersAdded = false;

  /** @type {WeakMap<EventTarget, Map<string, Function>>} */
  #listenersCallbacks = new WeakMap();

  detach() {
    this.#toggleListeners(this.#listeners, { enable: false });
    this.#listenersCallbacks = new WeakMap();
    this.host.removeController(this);
  }

  /** @param {TargetListenersPair<EventsMap>[]} listeners */
  updateListeners(listeners) {
    this.#toggleListeners(this.#listeners, { enable: false });
    this.#listeners = listeners;
    this.#listenersCallbacks = new WeakMap();
    // @ts-ignore we using it for customElement, we should have a ReactiveElement<HTMLElement>
    if (this.host.isConnected) {
      this.#toggleListeners(this.#listeners, { enable: true });
    }
  }

  hostConnected() {
    this.#toggleListeners(this.#listeners, { enable: true });
  }

  hostDisconnected() {
    if (this.removeListenersOnHostDisconnected) {
      this.#toggleListeners(this.#listeners, { enable: false });
      this.#listenersCallbacks = new WeakMap();
    }
  }

  /**
   * @param {TargetListenersPair<EventsMap>[]} listenersByTarget
   * @param {{ enable: boolean }} param1
   */
  #toggleListeners(listenersByTarget, { enable }) {
    if (enable && this.#listenersAdded) {
      return;
    }
    if (!enable && !this.#listenersAdded) {
      return;
    }
    if (!listenersByTarget) {
      this.#onListenersToggled?.(enable);
      return;
    }
    if (!Array.isArray(listenersByTarget)) return;
    for (const [node, listeners] of listenersByTarget) {
      if (node) {
        /** @type {Map<string, Function>} */
        const callbacks = this.#listenersCallbacks.get(node) ?? new Map();
        this.#listenersCallbacks.set(node, callbacks);
        for (const [eventName, listener] of Object.entries(listeners)) {
          let cb = callbacks.get(eventName);
          if (cb) {
            if (!enable) {
              callbacks.delete(eventName);
            }
          } else {
            if (typeof listener === 'string') {
              if (/** @type {any} */ (this.host)[listener] === 'function') {
                cb = /** @type {any} */ (this.host)[listener];
              } else {
                throw new Error('ListenersMixin.InvalidCallback');
              }
            } else if (typeof listener === 'function') {
              cb = listener;
            } else if (typeof listener.cb === 'string') {
              cb = /** @type {any} */ (this.host)[listener.cb];
            } else if (typeof listener.cb === 'function') {
              cb = listener.cb;
            } else {
              throw new Error('ListenersMixin.InvalidCallback');
            }
            callbacks.set(eventName, cb);
          }
          const m = enable ? 'addEventListener' : 'removeEventListener';
          /** @type {AddEventListenerOptions} */
          const opts = {};
          if (typeof listener === 'object') {
            if (listener.passive != null) {
              opts.passive = listener.passive;
            }
            if (listener.capture != null) {
              opts.capture = listener.capture;
            }
          }
          if (enable) {
            // avoid duplication
            node.removeEventListener(
              eventName,
              /** @type {EventListenerOrEventListenerObject} */ (cb),
              opts,
            );
          }
          // if (this.host.nodeName === 'PKG-NODE-EXPLORER')
          //   console.log(this.host.nodeName, enable, m, eventName, {cb, opts});
          node[m](eventName, /** @type {EventListenerOrEventListenerObject} */ (cb), opts);
        }
      } else {
        console.error("Invalid listener target. Maybe it's not ready yet", { node, listeners });
      }
    }
    this.#listenersAdded = enable;
    this.#onListenersToggled?.(enable);
  }
}
