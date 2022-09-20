export type HTMLElementEvenObject = {
	[K in keyof HTMLElementEventMap]: HTMLElementEventMap[K];
};

/**
 * Returns a new type that extends Element with addEventListener / removeEventListener with custom events
 */
export type WithEvents<
	Element extends HTMLElement,
	EventsMap extends Record<string, Event>,
> = HTMLElementTypedEvents<EventsMap> & Element;

interface HTMLElementTypedEvents<EventsMap extends Record<string, Event>> {
	addEventListener<T extends keyof EventsMap>(
		type: T,
		listener:
			| ((this: this, ev: EventsMap[T]) => void)
			| { handleEvent(object: EventsMap[T]): void },
		options?: boolean | AddEventListenerOptions,
	): void;

	addEventListener<T extends keyof HTMLElementEvenObject>(
		type: T,
		listener:
			| ((this: this, ev: HTMLElementEvenObject[T]) => void)
			| { handleEvent(object: HTMLElementEvenObject[T]): void },
		options?: boolean | AddEventListenerOptions,
	): void;

	addEventListener(
		type: string,
		listener: (this: this, ev: Event) => void | EventListenerObject,
		options?: boolean | AddEventListenerOptions,
	): void;

	removeEventListener<T extends keyof EventsMap>(
		type: T,
		listener:
			| ((this: this, ev: EventsMap[T]) => void)
			| { handleEvent(object: EventsMap[T]): void },
		options?: boolean | EventListenerOptions,
	): void;

	removeEventListener<T extends keyof HTMLElementEvenObject>(
		type: T,
		listener:
			| ((this: this, ev: HTMLElementEvenObject[T]) => void)
			| { handleEvent(object: HTMLElementEvenObject[T]): void },
		options?: boolean | EventListenerOptions,
	): void;

	removeEventListener(
		type: string,
		listener: (this: this, ev: Event) => void,
		options?: boolean | EventListenerOptions,
	): void;
}
