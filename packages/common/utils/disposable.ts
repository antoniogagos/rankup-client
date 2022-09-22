/* eslint-disable max-classes-per-file */
export interface IDisposable {
	dispose(): void;
}

export abstract class Disposable implements IDisposable {
	static readonly None = Object.freeze<IDisposable>({
		dispose() {
			// something for eslint
		},
	});

	private readonly _store = new DisposableStore();

	public dispose(): void {
		this._store.dispose();
	}

	protected _register<T extends IDisposable>(o: T): T {
		if ((o as unknown as Disposable) === this) {
			throw new Error('Cannot register a disposable on itself!');
		}
		return this._store.add(o);
	}
}

export function isDisposable<E extends object>(thing: E): thing is E & IDisposable {
	return (
		typeof (<IDisposable>thing).dispose === 'function' && (<IDisposable>thing).dispose.length === 0
	);
}

export function isIterable<T = any>(thing: any): thing is IterableIterator<T> {
	return thing && typeof thing === 'object' && typeof thing[Symbol.iterator] === 'function';
}

export function dispose<T extends IDisposable>(disposable: T): T;
export function dispose<T extends IDisposable>(disposable: T | undefined): T | undefined;
export function dispose<T extends IDisposable, A extends IterableIterator<T> = IterableIterator<T>>(
	disposables: IterableIterator<T>,
): A;
export function dispose<T extends IDisposable>(disposables: Array<T>): Array<T>;
export function dispose<T extends IDisposable>(disposables: ReadonlyArray<T>): ReadonlyArray<T>;
export function dispose<T extends IDisposable>(arg: T | IterableIterator<T> | undefined): any {
	if (isIterable(arg)) {
		const errors: any[] = [];
		for (const d of arg) {
			if (d) {
				try {
					d.dispose();
				} catch (e) {
					errors.push(e);
				}
			}
		}
		if (errors.length === 1) {
			throw errors[0];
		} else if (errors.length > 1) {
			throw new MultiDisposeError(errors);
		}
		return Array.isArray(arg) ? [] : arg;
	}
	if (arg) {
		arg.dispose();
		return arg;
	}
}

export class MultiDisposeError extends Error {
	constructor(public readonly errors: any[]) {
		super(`Encountered errors while disposing of store. Errors: [${errors.join(', ')}]`);
	}
}

export class DisposableStore implements IDisposable {
	static DISABLE_DISPOSED_WARNING = false;

	private _toDispose = new Set<IDisposable>();

	private _isDisposed = false;

	/**
	 * Dispose of all registered disposables and mark this object as disposed.
	 *
	 * Any future disposables added to this object will be disposed of on `add`.
	 */
	public dispose(): void {
		if (this._isDisposed) {
			return;
		}
		this._isDisposed = true;
		this.clear();
	}

	/**
	 * Dispose of all registered disposables but do not mark this object as disposed.
	 */
	public clear(): void {
		try {
			dispose(this._toDispose.values());
		} finally {
			this._toDispose.clear();
		}
	}

	public add<T extends IDisposable>(o: T): T {
		if (!o) {
			return o;
		}
		if ((o as unknown as DisposableStore) === this) {
			throw new Error('Cannot register a disposable on itself!');
		}
		if (this._isDisposed) {
			if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
				console.warn(
					new Error(
						'Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!',
					).stack,
				);
			}
		} else {
			this._toDispose.add(o);
		}

		return o;
	}
}
