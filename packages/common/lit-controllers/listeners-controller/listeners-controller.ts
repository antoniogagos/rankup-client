import type { ReactiveController, ReactiveControllerHost } from 'lit';

export interface ListenerObject<T> {
  cb: string | ((evt: T) => void);
  passive?: boolean;
  capture?: boolean;
}

export type ListenersObject<EventsMap = void> = EventsMap extends void
  ? Partial<{
      [eventName: string]: ListenerObject<Event> | string | ((evt: Event) => void);
    }>
  : Partial<{
      [eventName in keyof EventsMap]:
        | ListenerObject<EventsMap[eventName]>
        | string
        | ((evt: EventsMap[eventName]) => void);
    }>;

export type TargetListenersPair<EventsMap = void> = [
  target: EventTarget,
  listeners: ListenersObject<EventsMap>,
];

type ReactiveControllerHostElement = ReactiveControllerHost & HTMLElement;

interface OptionsParameter {
  removeListenersOnHostDisconnected?: boolean;
  onListenersToggled?: (toggled: boolean) => void;
}

/**
 * Note:
 *   - the listeners are only added if the element is connected.
 *   - the controller is added until "detach" is called. So remove/append adds listeners again
 */
export class ListenersController<EventsMap> implements ReactiveController {
  constructor(
    host: ReactiveControllerHostElement,
    listeners: TargetListenersPair<EventsMap>[],
    opts?: OptionsParameter,
  ) {
    const { onListenersToggled, removeListenersOnHostDisconnected } = opts ?? {};
    this.host = host;
    this.#removeListenersOnHostDisconnected = removeListenersOnHostDisconnected ?? true;
    this.#listeners = listeners;
    this.#onListenersToggled = onListenersToggled;
    host.addController(this);
  }

  host: ReactiveControllerHostElement;

  #onListenersToggled: ((toggled: boolean) => void) | undefined;

  #listeners: TargetListenersPair<EventsMap>[];

  #listenersAdded = false;

  #listenersCallbacks: WeakMap<EventTarget, Map<string, () => void>> = new WeakMap();

  #removeListenersOnHostDisconnected = true;

  detach() {
    this.#toggleListeners(this.#listeners, false);
    this.#listenersCallbacks = new WeakMap();
    this.host.removeController(this);
  }

  updateListeners(listeners: TargetListenersPair<EventsMap>[]) {
    this.#toggleListeners(this.#listeners, false);
    this.#listeners = listeners;
    this.#listenersCallbacks = new WeakMap();
    if (this.host.isConnected) {
      this.#toggleListeners(this.#listeners, true);
    }
  }

  hostConnected() {
    this.#toggleListeners(this.#listeners, true);
  }

  hostDisconnected() {
    if (this.#removeListenersOnHostDisconnected) {
      this.#toggleListeners(this.#listeners, false);
      this.#listenersCallbacks = new WeakMap();
    }
  }

  #toggleListeners(listenersByTarget: TargetListenersPair<EventsMap>[], enable: boolean) {
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
        const callbacks: Map<string, () => void> = this.#listenersCallbacks.get(node) ?? new Map();
        this.#listenersCallbacks.set(node, callbacks);
        for (const [eventName, listener] of Object.entries(listeners)) {
          let cb = callbacks.get(eventName);
          if (cb) {
            if (!enable) {
              callbacks.delete(eventName);
            }
          } else {
            if (typeof listener === 'string') {
              if (this.host[listener as keyof ReactiveControllerHostElement] === 'function') {
                cb = this.host[listener as keyof ReactiveControllerHostElement] as () => void;
              } else {
                throw new TypeError('ListenersMixin.InvalidCallback');
              }
            } else if (typeof listener === 'function') {
              cb = listener;
            } else if (typeof listener.cb === 'string') {
              cb = this.host[listener.cb as keyof ReactiveControllerHostElement] as () => void;
            } else if (typeof listener.cb === 'function') {
              cb = listener.cb;
            } else {
              throw new TypeError('ListenersMixin.InvalidCallback');
            }
            callbacks.set(eventName, cb as () => void);
          }
          const m = enable ? 'addEventListener' : 'removeEventListener';
          const opts: AddEventListenerOptions = {};
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
            node.removeEventListener(eventName, cb as EventListenerOrEventListenerObject, opts);
          }
          node[m](eventName, cb as EventListenerOrEventListenerObject, opts);
        }
      } else {
        console.error("Invalid listener target. Maybe it's not ready yet", { node, listeners });
      }
    }
    this.#listenersAdded = enable;
    this.#onListenersToggled?.(enable);
  }
}
