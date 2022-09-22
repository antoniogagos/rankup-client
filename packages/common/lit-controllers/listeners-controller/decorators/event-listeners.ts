import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { ReactiveElement } from 'lit';

import type { IDisposable } from '../../../utils/disposable';
import { listen } from '../events-listener-controller.js';

/**
 * @param eventName
 * @param target
 * @param once
 * @param passive
 * @param signal
 *
 * @category Decorator
 */
export function eventListener<T extends Record<string, any> | null = null>({
	eventName,
	target,
	once,
	passive,
	signal,
}: {
	eventName: keyof T;
	target?: Element;
	once?: boolean;
	passive?: boolean;
	signal?: AbortSignal;
}): <K extends PropertyKey>(
	protoOrDescriptor: ReactiveElement & Record<K, (evt: any) => void>,
	name?: K,
	// Note TypeScript requires the return type to be `void|any`
) => void | any {
	return decorateProperty({
		finisher: (ctor: typeof ReactiveElement, name: PropertyKey) => {
			ctor.addInitializer((element: ReactiveElement): void => {
				element.addController(
					new ListenerController(element, name, eventName as string, target, {
						once,
						passive,
						signal,
					}),
				);
			});
		},
	});
}

class ListenerController implements ReactiveController {
	constructor(
		public host: ReactiveControllerHost & HTMLElement,
		private name: PropertyKey,
		private eventName: string,
		private target?: Element,
		private opts?: AddEventListenerOptions,
	) {}

	private disposable: IDisposable | null = null;

	hostConnected() {
		const target = this.target ?? this.host;
		const callback = (this.host as any)[this.name];
		this.disposable = listen(target, this.eventName, callback, this.opts);
	}

	hostDisconnected() {
		this.disposable?.dispose();
	}
}
