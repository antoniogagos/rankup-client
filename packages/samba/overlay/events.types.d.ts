import { OverlayController } from './overlay-controller.js';

export type EventsMap<T extends OverlayController = OverlayController> = {
	'before-close-overlay': CustomEvent<{
		overlayController: T;
		overlay: T['host'];
	}>;
	'before-open-overlay': CustomEvent<{
		overlayController: T;
		overlay: T['host'];
		wait: Promise<void> | null;
	}>;
	'close-transition-end': CustomEvent<{
		overlayController: T;
		overlay: T['host'];
	}>;
	'find-overlay-container': CustomEvent<{
		overlayController: T;
		overlay: T['host'];
		container: HTMLElement | null;
	}>;
	'open-transition-end': CustomEvent<{
		overlayController: T;
		overlay: T['host'];
	}>;
	'overlay-closed': CustomEvent<{
		overlayController: T;
		overlay: T['host'];
	}>;
	'overlay-opened': CustomEvent<{
		overlayController: T;
		overlay: T['host'];
	}>;
};

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
