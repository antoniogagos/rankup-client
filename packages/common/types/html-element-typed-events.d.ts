export declare class HTMLElementTypedEvents<EventsMap extends HTMLElementEventMap> extends HTMLElement {
    addEventListener<T extends keyof EventsMap>(type: T, listener: (this: this, ev: EventsMap[T]) => unknown, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<T extends keyof EventsMap>(type: T, listener: (this: this, ev: EventsMap[T]) => unknown, options?: boolean | EventListenerOptions): void;
}
