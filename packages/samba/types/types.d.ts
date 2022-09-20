export interface IEventsMap extends Record<string, CustomEvent> {}

export type HTMLElementEvents = {
	[K in keyof HTMLElementEventMap]: HTMLElementEventMap[K];
};

/** Extracts 'detail' object of an event if it's a CustomEvent */
type EventDetail<C extends Event> = C extends CustomEvent ? C['detail'] : undefined;
