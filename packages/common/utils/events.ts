import { IDisposable } from './disposable.js';
import { markAsDisposed, trackDisposable } from './track-disposable.js';

/**
 * @param target
 * @param evtName
 * @param handleEvent
 * @param opts
 * @param trackDisposableContext disposable will be tracked for disposal when this element is disconnected
 */
export function listen(
	target: EventTarget,
	evtName: string,
	handleEvent: EventListenerOrEventListenerObject,
	opts?: AddEventListenerOptions | boolean | null,
	trackDisposableContext?: Element,
): IDisposable {
	// prettier-ignore
	// console.log('addListener::\t', evtName, '::\t\tadded-to::', (target as Element)?.localName ?? target, '::tracked-for::', trackDisposableContext?.localName);
	target.addEventListener(evtName, handleEvent, opts ?? undefined);
	const disposable: IDisposable = {
		dispose() {
			// prettier-ignore
			// console.log('removeListener::\t', evtName, '::\t\tadded-to::', (target as Element)?.localName, '::tracked-for::', trackDisposableContext?.localName);
			markAsDisposed(disposable);
			target.removeEventListener(evtName, handleEvent, opts ?? undefined);
		},
	};
	return trackDisposable(disposable, trackDisposableContext ?? (target as Element));
}
