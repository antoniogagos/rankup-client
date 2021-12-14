import { PageItem, Route } from './types.d';

export interface EventsMap {
  'page-changed': CustomEvent<{
    page: PageItem | null;
    oldPage: PageItem | null;
    route: Route | null;
    entryAnimation?: Promise<Animation> | null;
  }>;
  /** App router can be updated by dispatching this event */
  'page-change': CustomEvent<{
    path: string;
  }>;
}

export interface AllEventsMap extends EventsMap, HTMLElementEventMap {}
