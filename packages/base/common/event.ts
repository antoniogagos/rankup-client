import { type IDisposable, DisposableNone, DisposableStore, toDisposable } from './lifecycle.js';

export type Listener<T> = (event: T) => unknown;

export interface Event<T> {
	(listener: Listener<T>, thisArgs?: unknown, disposables?: IDisposable[] | DisposableStore): IDisposable;
}

export interface EmitterOptions {
	leakWarningThreshold?: number;
	onFirstListenerAdd?: () => void;
	onLastListenerRemove?: () => void;
}

let globalLeakWarningThreshold = 175;

export function setGlobalLeakWarningThreshold(threshold: number): void {
	globalLeakWarningThreshold = threshold;
}

export class Emitter<T> implements IDisposable {
	private readonly listeners: Array<{ listener: Listener<T>; thisArgs?: unknown }> = [];

	private readonly options?: EmitterOptions;

	private isDisposed = false;

	private leakWarned = false;

	public readonly event: Event<T> = (listener, thisArgs, disposables) => {
		if (this.isDisposed) {
			console.warn('Attempted to listen on a disposed emitter.');
			return DisposableNone;
		}
		if (this.listeners.length === 0) {
			this.options?.onFirstListenerAdd?.();
		}
		const entry = { listener, thisArgs };
		this.listeners.push(entry);
		this.checkLeak();
		const disposable = toDisposable(() => this.removeListener(entry));
		if (Array.isArray(disposables)) {
			disposables.push(disposable);
		} else if (disposables) {
			disposables.add(disposable);
		}
		return disposable;
	};

	public constructor(options?: EmitterOptions) {
		this.options = options;
	}

	public fire(event: T): void {
		if (this.isDisposed) {
			return;
		}
		const queue = this.listeners.slice();
		for (const { listener, thisArgs } of queue) {
			try {
				if (thisArgs !== undefined) {
					listener.call(thisArgs, event);
				} else {
					listener(event);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	public dispose(): void {
		if (this.isDisposed) {
			return;
		}
		const hadListeners = this.listeners.length > 0;
		this.isDisposed = true;
		this.listeners.length = 0;
		if (hadListeners) {
			this.options?.onLastListenerRemove?.();
		}
	}

	private removeListener(entry: { listener: Listener<T>; thisArgs?: unknown }): void {
		const index = this.listeners.indexOf(entry);
		if (index === -1) {
			return;
		}
		this.listeners.splice(index, 1);
		if (this.listeners.length === 0) {
			this.options?.onLastListenerRemove?.();
		}
	}

	private checkLeak(): void {
		const threshold = this.options?.leakWarningThreshold ?? globalLeakWarningThreshold;
		if (!this.leakWarned && threshold > 0 && this.listeners.length > threshold) {
			this.leakWarned = true;
			console.warn('Possible listener leak detected.');
		}
	}
}

export namespace Event {
	export const None: Event<any> = () => DisposableNone;

	export function once<T>(event: Event<T>): Event<T> {
		return (listener, thisArgs, disposables) => {
			let didFire = false;
			const disposable = event(
				e => {
					if (didFire) {
						return;
					}
					didFire = true;
					disposable.dispose();
					if (thisArgs !== undefined) {
						listener.call(thisArgs, e);
					} else {
						listener(e);
					}
				},
				undefined,
				disposables,
			);
			return disposable;
		};
	}

	export function onceIf<T>(event: Event<T>, predicate: (e: T) => boolean): Event<T> {
		return (listener, thisArgs, disposables) => {
			const disposable = event(
				e => {
					if (!predicate(e)) {
						return;
					}
					disposable.dispose();
					if (thisArgs !== undefined) {
						listener.call(thisArgs, e);
					} else {
						listener(e);
					}
				},
				undefined,
				disposables,
			);
			return disposable;
		};
	}

	export function map<T, R>(event: Event<T>, mapFn: (e: T) => R, thisArgs?: unknown, disposables?: DisposableStore): Event<R> {
		let subscription: IDisposable | undefined;
		const emitter = new Emitter<R>({
			onFirstListenerAdd: () => {
				subscription = event(e => emitter.fire(mapFn.call(thisArgs, e)));
			},
			onLastListenerRemove: () => {
				subscription?.dispose();
				subscription = undefined;
			},
		});
		disposables?.add(emitter);
		return emitter.event;
	}

	export function forEach<T>(event: Event<T>, fn: (e: T) => void, thisArgs?: unknown, disposables?: DisposableStore): Event<T> {
		return map(
			event,
			e => {
				fn.call(thisArgs, e);
				return e;
			},
			undefined,
			disposables,
		);
	}

	export function filter<T>(event: Event<T>, filterFn: (e: T) => boolean, thisArgs?: unknown, disposables?: DisposableStore): Event<T> {
		let subscription: IDisposable | undefined;
		const emitter = new Emitter<T>({
			onFirstListenerAdd: () => {
				subscription = event(e => {
					if (filterFn.call(thisArgs, e)) {
						emitter.fire(e);
					}
				});
			},
			onLastListenerRemove: () => {
				subscription?.dispose();
				subscription = undefined;
			},
		});
		disposables?.add(emitter);
		return emitter.event;
	}

	export function any<T>(...events: Event<T>[]): Event<T> {
		if (events.length === 0) {
			return None;
		}
		let subscriptions: IDisposable[] = [];
		const emitter = new Emitter<T>({
			onFirstListenerAdd: () => {
				subscriptions = events.map(event => event(e => emitter.fire(e)));
			},
			onLastListenerRemove: () => {
				for (const disposable of subscriptions) {
					disposable.dispose();
				}
				subscriptions = [];
			},
		});
		return emitter.event;
	}

	export function reduce<T, R>(event: Event<T>, merge: (last: R | undefined, e: T) => R, initial?: R, disposables?: DisposableStore): Event<R> {
		let subscription: IDisposable | undefined;
		let last = initial;
		const emitter = new Emitter<R>({
			onFirstListenerAdd: () => {
				subscription = event(e => {
					last = merge(last, e);
					emitter.fire(last);
				});
			},
			onLastListenerRemove: () => {
				subscription?.dispose();
				subscription = undefined;
			},
		});
		disposables?.add(emitter);
		return emitter.event;
	}

	export function latch<T>(event: Event<T>, equals: (a: T, b: T) => boolean = Object.is, disposables?: DisposableStore): Event<T> {
		let subscription: IDisposable | undefined;
		let hasLast = false;
		let last: T;
		const emitter = new Emitter<T>({
			onFirstListenerAdd: () => {
				subscription = event(e => {
					if (!hasLast || !equals(last!, e)) {
						hasLast = true;
						last = e;
						emitter.fire(e);
					}
				});
			},
			onLastListenerRemove: () => {
				subscription?.dispose();
				subscription = undefined;
				hasLast = false;
			},
		});
		disposables?.add(emitter);
		return emitter.event;
	}

	export function debounce<T>(event: Event<T>, merge: (last: T | undefined, e: T) => T, delay: number, leading = false, flushOnListenerRemove = false, thisArgs?: unknown, disposables?: DisposableStore): Event<T> {
		let subscription: IDisposable | undefined;
		let output: T | undefined;
		let handle: ReturnType<typeof setTimeout> | undefined;
		let calls = 0;
		const emitter = new Emitter<T>({
			onFirstListenerAdd: () => {
				subscription = event(e => {
					calls += 1;
					output = merge.call(thisArgs, output, e);
					if (leading && calls === 1) {
						emitter.fire(output);
						output = undefined;
					}
					if (handle) {
						clearTimeout(handle);
					}
					handle = setTimeout(() => {
						handle = undefined;
						const shouldEmit = !leading || output !== undefined;
						if (shouldEmit && output !== undefined) {
							emitter.fire(output);
						}
						output = undefined;
						calls = 0;
					}, delay);
				});
			},
			onLastListenerRemove: () => {
				subscription?.dispose();
				subscription = undefined;
				if (flushOnListenerRemove && output !== undefined) {
					emitter.fire(output);
				}
				output = undefined;
				calls = 0;
				if (handle) {
					clearTimeout(handle);
					handle = undefined;
				}
			},
		});
		disposables?.add(emitter);
		return emitter.event;
	}

	export function accumulate<T>(event: Event<T>, disposables?: DisposableStore): Event<T[]> {
		let subscription: IDisposable | undefined;
		let buffer: T[] = [];
		let scheduled = false;
		const emitter = new Emitter<T[]>({
			onFirstListenerAdd: () => {
				subscription = event(e => {
					buffer.push(e);
					if (scheduled) {
						return;
					}
					scheduled = true;
					queueMicrotask(() => {
						scheduled = false;
						if (buffer.length > 0) {
							const toEmit = buffer;
							buffer = [];
							emitter.fire(toEmit);
						}
					});
				});
			},
			onLastListenerRemove: () => {
				subscription?.dispose();
				subscription = undefined;
				buffer = [];
				scheduled = false;
			},
		});
		disposables?.add(emitter);
		return emitter.event;
	}

	export function buffer<T>(event: Event<T>, nextTick = false, disposables?: DisposableStore): Event<T> {
		let buffer: T[] | null = [];
		const emitter = new Emitter<T>();
		const subscription = event(e => {
			if (buffer) {
				buffer.push(e);
				return;
			}
			emitter.fire(e);
		});
		const flush = () => {
			if (!buffer || buffer.length === 0) {
				buffer = null;
				return;
			}
			const toEmit = buffer;
			buffer = null;
			for (const item of toEmit) {
				emitter.fire(item);
			}
		};
		const bufferedEvent: Event<T> = (listener, thisArgs, eventDisposables) => {
			if (buffer) {
				if (nextTick) {
					queueMicrotask(flush);
				} else {
					flush();
				}
			}
			return emitter.event(listener, thisArgs, eventDisposables);
		};
		disposables?.add(emitter);
		disposables?.add(subscription);
		return bufferedEvent;
	}
}
