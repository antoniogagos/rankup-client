export interface EventsMap<T = string> {
  change: CustomEvent<{
    old: boolean;
    value: boolean;
  }>;
  'change-prevented': CustomEvent;
}

export type Listener<EvtName extends keyof EventsMap, T> = (evt: EventsMap<T>[EvtName]) => any;
