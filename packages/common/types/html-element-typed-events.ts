export class HTMLElementTypedEvents<EventsMap extends HTMLElementEventMap> extends HTMLElement {
	public addEventListener<T extends keyof EventsMap>(
		type: T,
		listener: (this: this, ev: EventsMap[T]) => unknown,
		options?: boolean | AddEventListenerOptions,
	): void;

	public addEventListener(
		type: string,
		listener: (this: this, ev: Event) => unknown,
		options?: boolean | AddEventListenerOptions,
	): void {
		super.addEventListener(type, listener, options);
	}

	public removeEventListener<T extends keyof EventsMap>(
		type: T,
		listener: (this: this, ev: EventsMap[T]) => unknown,
		options?: boolean | EventListenerOptions,
	): void;

	public removeEventListener(
		type: string,
		listener: (this: this, ev: Event) => unknown,
		options?: boolean | EventListenerOptions,
	): void {
		super.addEventListener(type, listener, options);
	}
}
