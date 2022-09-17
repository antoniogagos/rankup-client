import type { ReactiveController, ReactiveControllerHost } from 'lit';
export interface ListenerObject<T> {
    cb: string | ((evt: T) => void);
    passive?: boolean;
    capture?: boolean;
}
export declare type ListenersObject<EventsMap = void> = EventsMap extends void ? Partial<{
    [eventName: string]: ListenerObject<Event> | string | ((evt: Event) => void);
}> : Partial<{
    [eventName in keyof EventsMap]: ListenerObject<EventsMap[eventName]> | string | ((evt: EventsMap[eventName]) => void);
}>;
export declare type TargetListenersPair<EventsMap = void> = [
    target: EventTarget,
    listeners: ListenersObject<EventsMap>
];
declare type ReactiveControllerHostElement = ReactiveControllerHost & HTMLElement;
interface OptionsParameter {
    removeListenersOnHostDisconnected?: boolean;
    onListenersToggled?: (toggled: boolean) => void;
}
/**
 * Note:
 *   - the listeners are only added if the element is connected.
 *   - the controller is added until "detach" is called. So remove/append adds listeners again
 */
export declare class ListenersController<EventsMap> implements ReactiveController {
    #private;
    constructor(host: ReactiveControllerHostElement, listeners: TargetListenersPair<EventsMap>[], opts?: OptionsParameter);
    host: ReactiveControllerHostElement;
    detach(): void;
    updateListeners(listeners: TargetListenersPair<EventsMap>[]): void;
    hostConnected(): void;
    hostDisconnected(): void;
}
export {};
