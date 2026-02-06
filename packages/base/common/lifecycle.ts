export interface IDisposable {
	dispose(): void;
}

export const DisposableNone: IDisposable = Object.freeze({ dispose() {} });

export function isDisposable(value: unknown): value is IDisposable {
	return typeof (value as IDisposable | undefined)?.dispose === 'function';
}

export function dispose<T extends IDisposable>(disposables: Iterable<T> | undefined): T[] {
	if (!disposables) {
		return [];
	}
	const errors: unknown[] = [];
	for (const disposable of disposables) {
		try {
			disposable.dispose();
		} catch (error) {
			errors.push(error);
		}
	}
	if (errors.length === 1) {
		throw errors[0];
	}
	if (errors.length > 1) {
		throw new AggregateError(errors, 'Errors occurred during dispose');
	}
	return [];
}

export function toDisposable(fn: () => void): IDisposable {
	let isDisposed = false;
	return {
		dispose: () => {
			if (isDisposed) {
				return;
			}
			isDisposed = true;
			fn();
		},
	};
}

export function combinedDisposable(...disposables: IDisposable[]): IDisposable {
	return toDisposable(() => dispose(disposables));
}

export function disposeOnReturn<T>(fn: (store: DisposableStore) => T): T {
	const store = new DisposableStore();
	try {
		return fn(store);
	} finally {
		store.dispose();
	}
}

export class DisposableStore implements IDisposable {
	private readonly toDispose = new Set<IDisposable>();

	private isDisposed = false;

	public get size(): number {
		return this.toDispose.size;
	}

	public add<T extends IDisposable>(disposable: T): T {
		if (disposable === DisposableNone) {
			return disposable;
		}
		if (this.isDisposed) {
			console.warn('Attempted to add a disposable to a disposed store.');
			disposable.dispose();
			return disposable;
		}
		this.toDispose.add(disposable);
		return disposable;
	}

	public delete(disposable: IDisposable): boolean {
		const removed = this.toDispose.delete(disposable);
		if (removed) {
			disposable.dispose();
		}
		return removed;
	}

	public deleteAndLeak(disposable: IDisposable): boolean {
		return this.toDispose.delete(disposable);
	}

	public clear(): void {
		if (this.toDispose.size === 0) {
			return;
		}
		const disposables = Array.from(this.toDispose);
		this.toDispose.clear();
		dispose(disposables);
	}

	public dispose(): void {
		if (this.isDisposed) {
			return;
		}
		this.isDisposed = true;
		this.clear();
	}
}

export abstract class Disposable implements IDisposable {
	protected readonly _store = new DisposableStore();

	public dispose(): void {
		this._store.dispose();
	}

	protected _register<T extends IDisposable>(disposable: T): T {
		return this._store.add(disposable);
	}
}

export class SafeDisposable implements IDisposable {
	private isDisposed = false;

	private disposable: IDisposable | undefined;

	public dispose(): void {
		if (this.isDisposed) {
			return;
		}
		this.isDisposed = true;
		this.disposable?.dispose();
		this.disposable = undefined;
	}

	protected _register<T extends IDisposable>(disposable: T): T {
		this.disposable?.dispose();
		this.disposable = disposable;
		return disposable;
	}
}

export class MutableDisposable<T extends IDisposable> implements IDisposable {
	private _value?: T;

	private isDisposed = false;

	public get value(): T | undefined {
		return this._value;
	}

	public set value(value: T | undefined) {
		if (this.isDisposed) {
			value?.dispose();
			return;
		}
		if (this._value) {
			this._value.dispose();
		}
		this._value = value;
	}

	public clear(): void {
		this.value = undefined;
	}

	public dispose(): void {
		if (this.isDisposed) {
			return;
		}
		this.isDisposed = true;
		this.clear();
	}
}

export class MandatoryMutableDisposable<T extends IDisposable> extends MutableDisposable<T> {
	public override get value(): T {
		const value = super.value;
		if (!value) {
			throw new Error('MandatoryMutableDisposable has not been set.');
		}
		return value;
	}
}

export class RefCountedDisposable<T extends IDisposable> implements IDisposable {
	private counter = 1;

	public constructor(private readonly disposable: T) {}

	public acquire(): IDisposable {
		this.counter += 1;
		return toDisposable(() => this.release());
	}

	public release(): void {
		this.counter -= 1;
		if (this.counter === 0) {
			this.disposable.dispose();
		}
	}

	public dispose(): void {
		this.release();
	}
}

export class DisposableMap<K, V extends IDisposable> implements IDisposable {
	private readonly entries = new Map<K, V>();

	private isDisposed = false;

	public get size(): number {
		return this.entries.size;
	}

	public has(key: K): boolean {
		return this.entries.has(key);
	}

	public get(key: K): V | undefined {
		return this.entries.get(key);
	}

	public set(key: K, value: V): this {
		if (this.isDisposed) {
			value.dispose();
			return this;
		}
		this.entries.get(key)?.dispose();
		this.entries.set(key, value);
		return this;
	}

	public delete(key: K): boolean {
		const value = this.entries.get(key);
		if (!value) {
			return false;
		}
		this.entries.delete(key);
		value.dispose();
		return true;
	}

	public clear(): void {
		dispose(this.entries.values());
		this.entries.clear();
	}

	public dispose(): void {
		if (this.isDisposed) {
			return;
		}
		this.isDisposed = true;
		this.clear();
	}
}

export interface IReference<T> extends IDisposable {
	readonly object: T;
}

export abstract class ReferenceCollection<K, T> {
	private readonly references = new Map<K, { object: T; counter: number }>();

	protected abstract createReferencedObject(key: K): T;

	protected destroyReferencedObject(_key: K, object: T): void {
		if (isDisposable(object)) {
			object.dispose();
		}
	}

	public acquire(key: K): IReference<T> {
		let reference = this.references.get(key);
		if (!reference) {
			reference = { object: this.createReferencedObject(key), counter: 0 };
			this.references.set(key, reference);
		}
		reference.counter += 1;
		return {
			object: reference.object,
			dispose: () => {
				reference!.counter -= 1;
				if (reference!.counter === 0) {
					this.references.delete(key);
					this.destroyReferencedObject(key, reference!.object);
				}
			},
		};
	}
}

export abstract class AsyncReferenceCollection<K, T> {
	private readonly references = new Map<K, { object: Promise<T>; counter: number }>();

	protected abstract createReferencedObject(key: K): Promise<T>;

	protected async destroyReferencedObject(_key: K, object: Promise<T>): Promise<void> {
		const value = await object;
		if (isDisposable(value)) {
			value.dispose();
		}
	}

	public async acquire(key: K): Promise<IReference<T>> {
		let reference = this.references.get(key);
		if (!reference) {
			reference = { object: this.createReferencedObject(key), counter: 0 };
			this.references.set(key, reference);
		}
		reference.counter += 1;
		const object = await reference.object;
		return {
			object,
			dispose: () => {
				reference!.counter -= 1;
				if (reference!.counter === 0) {
					this.references.delete(key);
					this.destroyReferencedObject(key, reference!.object);
				}
			},
		};
	}
}
