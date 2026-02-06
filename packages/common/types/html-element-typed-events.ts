export class HTMLElementTypedEvents<EventsMap extends HTMLElementEventMap> extends HTMLElement {
	public override addEventListener<T extends keyof EventsMap>(type: T, listener: (this: this, ev: EventsMap[T]) => unknown, options?: boolean | AddEventListenerOptions): void;

	public override addEventListener(type: string, listener: (this: this, ev: Event) => unknown, options?: boolean | AddEventListenerOptions): void {
		super.addEventListener(type, listener, options);
	}

	public override removeEventListener<T extends keyof EventsMap>(type: T, listener: (this: this, ev: EventsMap[T]) => unknown, options?: boolean | EventListenerOptions): void;

	public override removeEventListener(type: string, listener: (this: this, ev: Event) => unknown, options?: boolean | EventListenerOptions): void {
		super.removeEventListener(type, listener, options);
	}
}
