import type { ReactiveController, ReactiveControllerHost } from 'lit';

import type { DOMEventObject } from '../../types/html-element-typed-events';
import { DisposableStore, IDisposable } from '../../utils/disposable.js';

interface ListenerObject<T> {
	cb: (evt: T) => void;
	passive?: boolean;
	capture?: boolean;
}

export type Listener<Evt> = ListenerObject<Evt> | ((evt: Evt) => void);

export type Listeners<EventsMap> = {
	[eventName in keyof EventsMap]: Listener<EventsMap[eventName]>;
} & {
	[eventName in keyof DOMEventObject]: Listener<DOMEventObject[eventName]>;
} & {
	[eventName: string]: Listener<any>;
};

export function listen(
	target: Element,
	evtName: string,
	handleEvent: (evt: Event) => void | Promise<void>,
	opts?: AddEventListenerOptions,
): IDisposable {
	console.log('addEventListener::', { evtName, target, handleEvent, opts });
	target.addEventListener(evtName, handleEvent, opts);
	return {
		dispose() {
			console.log('removeEventListener::', { evtName, target, handleEvent, opts });
			target.removeEventListener(evtName, handleEvent, opts);
		},
	};
}

/**
 * Listeners are added on connectedCallback, and removed on disconnectedCallback
 *
 * Optionally, you can pass "removeListenersOnHostDisconnected: false" and call the "detach" method
 * to remove the controller and listeners
 */
export class EventsListenerController<
	EventsMap,
	K extends Record<string, Listener<any> | undefined> = Partial<Listeners<EventsMap>>,
> implements ReactiveController
{
	constructor(
		public host: ReactiveControllerHost & HTMLElement,
		private listeners: K,
		opts?: {
			removeListenersOnHostDisconnected?: boolean;
			target?: Element;
			onListenersToggled?: (toggled: boolean) => void;
		},
	) {
		const { onListenersToggled, removeListenersOnHostDisconnected } = opts ?? {};
		this.#removeListenersOnHostDisconnected = removeListenersOnHostDisconnected ?? true;
		this.#onListenersToggled = onListenersToggled;
		this.#target = opts?.target ?? this.host;
		host.addController(this);
	}

	#onListenersToggled: ((toggled: boolean) => void) | undefined;

	#target: Element;

	#listenersAdded = false;

	#disposables = new DisposableStore();

	#removeListenersOnHostDisconnected = true;

	detach() {
		this.#toggleListeners(this.listeners, false);
		this.host.removeController(this);
	}

	hostConnected() {
		this.#toggleListeners(this.listeners, true);
	}

	hostDisconnected() {
		if (this.#removeListenersOnHostDisconnected) {
			this.#toggleListeners(this.listeners, false);
		}
	}

	private _getCallback(listener: Listener<any>): (evt: Event) => void {
		if (typeof listener === 'function') {
			return listener;
		}
		if (typeof listener.cb === 'function') {
			return listener.cb;
		}
		throw new TypeError('Invalid listener');
	}

	#toggleListeners(listeners: K, enable: boolean) {
		if (this.#listenersAdded === enable) return;
		this.#disposables.clear();
		if (enable) {
			for (const [eventName, listener] of Object.entries(listeners)) {
				if (listener) {
					const cb = this._getCallback(listener);
					const opts: AddEventListenerOptions = {};
					if (typeof listener === 'object') {
						if (listener.passive != null) {
							opts.passive = listener.passive;
						}
						if (listener.capture != null) {
							opts.capture = listener.capture;
						}
					}
					this.#disposables.add(listen(this.#target, eventName, cb, opts));
				}
			}
		}
		this.#listenersAdded = enable;
		this.#onListenersToggled?.(enable);
	}
}
