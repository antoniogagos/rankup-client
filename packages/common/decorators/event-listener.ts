import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { ReactiveElement } from 'lit';
import { GlobalEventMap } from 'types/html-element-typed-events';

import type { IDisposable } from '../utils/disposable';
import { listen } from '../utils/events.js';

/**
 * @param eventName
 * @param target
 * @param once
 * @param passive
 * @param signal
 *
 * @category Decorator
 */
export function eventListener<T extends Record<string, any> = GlobalEventMap>({
	eventName,
	target,
	once,
	passive,
	signal,
}: {
	eventName: keyof T;
	target?: Element | Window | Document;
	once?: boolean;
	passive?: boolean;
	signal?: AbortSignal;
}): <K extends PropertyKey>(
	protoOrDescriptor: ReactiveElement /*  & Record<K, (evt: any) => void> */,
	name?: K,
	// Note TypeScript requires the return type to be `void|any`
) => void | any {
	return decorateProperty({
		finisher: (ctor: typeof ReactiveElement, name: PropertyKey) => {
			ctor.addInitializer((element: ReactiveElement): void => {
				element.addController(
					new ListenerController(
						element,
						name,
						eventName as string,
						{
							once,
							passive,
							signal,
						},
						target,
					),
				);
			});
		},
	});
}

class ListenerController implements ReactiveController, IDisposable {
	constructor(
		public host: ReactiveControllerHost & HTMLElement,
		private name: PropertyKey,
		private eventName: string,
		private opts?: AddEventListenerOptions,
		private target?: Element | Window | Document,
	) {}

	private disposable?: IDisposable;

	hostConnected() {
		const target = this.target ?? this.host;
		const callback = (this.host as any)[this.name];
		this.disposable = listen(target, this.eventName, callback.bind(this.host), this.opts);
	}

	hostDisconnected() {
		this.dispose();
	}

	dispose() {
		this.disposable?.dispose();
		this.disposable = undefined;
	}
}
