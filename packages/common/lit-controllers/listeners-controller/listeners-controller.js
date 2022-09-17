/**
 * Note:
 *   - the listeners are only added if the element is connected.
 *   - the controller is added until "detach" is called. So remove/append adds listeners again
 */
export class ListenersController {
    constructor(host, listeners, opts) {
        const { onListenersToggled, removeListenersOnHostDisconnected } = opts ?? {};
        this.host = host;
        this.#removeListenersOnHostDisconnected = removeListenersOnHostDisconnected ?? true;
        this.#listeners = listeners;
        this.#onListenersToggled = onListenersToggled;
        host.addController(this);
    }
    host;
    #onListenersToggled;
    #listeners;
    #listenersAdded = false;
    #listenersCallbacks = new WeakMap();
    #removeListenersOnHostDisconnected = true;
    detach() {
        this.#toggleListeners(this.#listeners, false);
        this.#listenersCallbacks = new WeakMap();
        this.host.removeController(this);
    }
    updateListeners(listeners) {
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
    #toggleListeners(listenersByTarget, enable) {
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
        if (!Array.isArray(listenersByTarget))
            return;
        for (const [node, listeners] of listenersByTarget) {
            if (node) {
                const callbacks = this.#listenersCallbacks.get(node) ?? new Map();
                this.#listenersCallbacks.set(node, callbacks);
                for (const [eventName, listener] of Object.entries(listeners)) {
                    let cb = callbacks.get(eventName);
                    if (cb) {
                        if (!enable) {
                            callbacks.delete(eventName);
                        }
                    }
                    else {
                        if (typeof listener === 'string') {
                            if (this.host[listener] === 'function') {
                                cb = this.host[listener];
                            }
                            else {
                                throw new TypeError('ListenersMixin.InvalidCallback');
                            }
                        }
                        else if (typeof listener === 'function') {
                            cb = listener;
                        }
                        else if (typeof listener.cb === 'string') {
                            cb = this.host[listener.cb];
                        }
                        else if (typeof listener.cb === 'function') {
                            cb = listener.cb;
                        }
                        else {
                            throw new TypeError('ListenersMixin.InvalidCallback');
                        }
                        callbacks.set(eventName, cb);
                    }
                    const m = enable ? 'addEventListener' : 'removeEventListener';
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
                        node.removeEventListener(eventName, cb, opts);
                    }
                    node[m](eventName, cb, opts);
                }
            }
            else {
                console.error("Invalid listener target. Maybe it's not ready yet", { node, listeners });
            }
        }
        this.#listenersAdded = enable;
        this.#onListenersToggled?.(enable);
    }
}
//# sourceMappingURL=listeners-controller.js.map