export interface ListenerObject<T> {
  cb: string | ((evt: T) => void);
  // node?: EventTarget;
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
