import type { PageItem } from './types';

export interface EventsMap {
  'page-changed': CustomEvent<{
    page: PageItem | null;
    oldPage: PageItem | null;
    route: PageJS.Context | null;
    entryAnimation?: Promise<Animation> | null;
  }>;
  /** App router can be updated by dispatching this event */
  'page-change': CustomEvent<{
    path: string;
  }>;
}

export interface AllEventsMap extends EventsMap, HTMLElementEventMap {}
