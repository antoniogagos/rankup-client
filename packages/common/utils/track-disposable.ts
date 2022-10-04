import { Disposable, IDisposable } from './disposable.js';

const TRACK_DISPOSABLES = true; // env?

let disposableTracker: IDisposableTracker | null = null;

export interface IDisposableTracker {
	/**
	 * Is called on construction of a disposable.
	 */
	trackDisposable(disposable: IDisposable, target: Element): void;

	/**
	 * Is called after a disposable is disposed.
	 */
	markAsDisposed(disposable: IDisposable): void;
}

export function trackDisposable<T extends IDisposable>(x: T, element: Element): T {
	disposableTracker?.trackDisposable(x, element);
	return x;
}

export function markAsDisposed(disposable: IDisposable): void {
	disposableTracker?.markAsDisposed(disposable);
}

if (TRACK_DISPOSABLES) {
	const DISPOSABLE_TRACKED = Symbol('DISPOSABLE_TRACKED');

	disposableTracker = new (class implements IDisposableTracker {
		observers: WeakMap<IDisposable, MutationObserver> = new WeakMap();

		trackDisposable(disposable: IDisposable, element: Element): void {
			if (!(element instanceof Element)) {
				return;
			}
			const stack = new Error('Potentially leaked disposable').stack!;
			const obs = new MutationObserver(
				(mutations: MutationRecord[], observer: MutationObserver) => {
					const removedNodes = [...mutations[0].removedNodes];
					const targetRemoved = removedNodes.includes(element);
					if (targetRemoved) {
						observer.disconnect();
						setTimeout(() => {
							if (!(disposable as any)[DISPOSABLE_TRACKED]) {
								console.error(stack);
							}
						}, 1000);
					}
				},
			);
			const parent = element.parentElement ?? element.getRootNode();
			obs.observe(parent, { childList: true });
			this.observers.set(disposable, obs);
		}

		markAsDisposed(disposable: IDisposable): void {
			if (disposable && disposable !== Disposable.None) {
				// eslint-disable-next-line no-param-reassign
				(disposable as any)[DISPOSABLE_TRACKED] = true;
				const obs = this.observers.get(disposable);
				if (obs) {
					obs.disconnect();
					this.observers.delete(disposable);
				}
			}
		}
	})();
}
