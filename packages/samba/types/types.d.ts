export interface IEventsMap extends Record<string, Event | CustomEvent> {}

export type HTMLElementEvents = {
	[K in keyof HTMLElementEventMap]: HTMLElementEventMap[K];
};
