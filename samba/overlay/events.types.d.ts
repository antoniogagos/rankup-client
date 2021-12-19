import { ReactiveElement } from 'lit';
import { OverlayController } from './overlay-controller.js';

interface IEventsMap {
  [eventName: string]: CustomEvent;
}

export interface EventsMap<
  Controller extends OverlayController<ReactiveElement, {}> = OverlayController<ReactiveElement>,
> {
  'before-close-overlay': CustomEvent<{
    overlayController: Controller;
    overlay: Controller['host'];
  }>;
  'before-open-overlay': CustomEvent<{
    overlayController: Controller;
    overlay: Controller['host'];
    wait: Promise<any> | null;
  }>;
  'close-transition-end': CustomEvent<{
    overlayController: Controller;
    overlay: Controller['host'];
  }>;
  'find-overlay-container': CustomEvent<{
    overlayController: Controller;
    overlay: Controller['host'];
    container: HTMLElement | null;
  }>;
  'open-transition-end': CustomEvent<{
    overlayController: Controller;
    overlay: Controller['host'];
  }>;
  'overlay-closed': CustomEvent<{
    overlayController: Controller;
    overlay: Controller['host'];
  }>;
  'overlay-opened': CustomEvent<{
    overlayController: Controller;
    overlay: Controller['host'];
  }>;
}

// export interface EventsMap<
//   T extends ReactiveElement = ReactiveElement,
//   HostEventsMap extends IEventsMap = {},
// > {
//   'before-close-overlay': CustomEvent<{
//     overlayController: OverlayController<T, HostEventsMap>;
//     overlay: T;
//   }>;
//   'before-open-overlay': CustomEvent<{
//     overlayController: OverlayController<T, HostEventsMap>;
//     overlay: T;
//     wait: Promise<any> | null;
//   }>;
//   'close-transition-end': CustomEvent<{
//     overlayController: OverlayController<T, HostEventsMap>;
//     overlay: T;
//   }>;
//   'find-overlay-container': CustomEvent<{
//     overlayController: OverlayController<T, HostEventsMap>;
//     overlay: T;
//     container: HTMLElement | null;
//   }>;
//   'open-transition-end': CustomEvent<{
//     overlayController: OverlayController<T, HostEventsMap>;
//     overlay: T;
//   }>;
//   'overlay-closed': CustomEvent<{
//     overlayController: OverlayController<T, HostEventsMap>;
//     overlay: T;
//   }>;
//   'overlay-opened': CustomEvent<{
//     overlayController: OverlayController<T, HostEventsMap>;
//     overlay: T;
//   }>;
// }

// export type Listener<EvtName extends keyof EventsMap, T extends ReactiveElement> = (
//   evt: EventsMap<T>[EvtName],
// ) => any;

declare global {
  interface WindowEventMap {
    'before-close-overlay': EventsMap['before-close-overlay'];
    'before-open-overlay': EventsMap['before-open-overlay'];
    'close-transition-end': EventsMap['close-transition-end'];
    'find-overlay-container': EventsMap['find-overlay-container'];
    'open-transition-end': EventsMap['open-transition-end'];
    'overlay-closed': EventsMap['overlay-closed'];
    'overlay-opened': EventsMap['overlay-opened'];
  }
}
