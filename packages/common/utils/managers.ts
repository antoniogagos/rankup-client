/**
 * All "managers" must extends this class.
 * The appShell will only accept registering this type of managers.
 */

import { ReactiveController, ReactiveControllerHost } from 'lit';

import { IDisposable } from './disposable.js';
import { listen } from './events.js';

export class ManagerClass<
	Host extends HTMLElement & ReactiveControllerHost,
	EventsMap extends Record<string, Event> = any,
> implements ReactiveController, EventTarget
{
	host: Host;

	constructor(host: Host) {
		this.host = host;
		this.host.addController(this);
	}

	hostConnected?(): void;

	hostDisconnected?(): void;

	hostUpdate?(): void;

	hostUpdated?(): void;

	/**
	 * @param trackDisposableContext disposable will be tracked for disposal when this element is disconnected
	 */
	listen(
		type: keyof EventsMap,
		callback: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions | null,
		trackDisposableContext?: Element,
	): IDisposable {
		return listen(this.host, type as string, callback, options, trackDisposableContext);
	}

	addEventListener(
		type: string,
		callback: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	): void {
		this.host.addEventListener(type, callback, options);
	}

	removeEventListener(
		type: string,
		callback: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	): void {
		this.host.removeEventListener(type, callback, options);
	}

	dispatchEvent(event: Event): boolean {
		return this.host.dispatchEvent(event);
	}
}
