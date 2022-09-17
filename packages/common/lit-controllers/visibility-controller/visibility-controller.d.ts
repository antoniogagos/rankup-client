import type { ReactiveController, ReactiveElement } from 'lit';
export declare class VisibilityController implements ReactiveController {
    #private;
    constructor(host: ReactiveElement, callback: (isVisible: boolean) => void);
    host: ReactiveElement;
    get visible(): boolean;
    hostConnected(): void;
    hostDisconnected(): void;
    detach(): void;
}
