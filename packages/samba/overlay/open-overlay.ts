import type { HTMLElementEvenObject } from 'common/types/html-element-typed-events';
import { ReactiveElement } from 'lit';

import { OverlayController } from './overlay-controller.js';
import type { EventsMap as OverlayEventsMap, Options } from './types';

export class CustomElementClass extends ReactiveElement {
	overlayController?: OverlayController<this>;
}

/**
 * It's possible to infer the element class definition from the elementName by using HTMLElementTagNameMap because
 * we're  extending it with all of our elements. But ts (probably a bug) is just getting one of all extended elements:
 *
 * type HTMLElementTagNames = keyof HTMLElementTagNameMap; // includes all HTMLElements + one of our custom elements
 */

export function openOverlay<
	T extends CustomElementClass,
	Params = null,
	EventsMap extends Record<string, Event> = HTMLElementEvenObject,
>(
	elementName: string,
	params?: Params,
	overlayOptions?: Options<T, EventsMap & OverlayEventsMap<OverlayController<T>>>,
) {
	if (!customElements.get(elementName)) {
		throw new Error(`Open overlay: element ${elementName} is not registered`);
	}
	const view = document.createElement(elementName) as T;
	if (params) {
		for (const [paramName, paramValue] of Object.entries(params)) {
			view[paramName as keyof T] = paramValue as any;
		}
	}
	const overlayController = new OverlayController<T, EventsMap>(view, overlayOptions);
	view.overlayController = overlayController;
	return overlayController;
}
