import { type IDisposable, DisposableStore } from '../common/lifecycle.js';

export interface ReactiveController {
	hostConnected?(): void;
	hostDisconnected?(): void;
	hostUpdate?(): void;
	hostUpdated?(): void;
}

export interface ReactiveControllerHost {
	addController(controller: ReactiveController): void;
	removeController?(controller: ReactiveController): void;
}

export class DisposableStoreController implements ReactiveController, IDisposable {
	private readonly store = new DisposableStore();

	private isDisposed = false;

	public constructor(private readonly host: ReactiveControllerHost) {
		host.addController(this);
	}

	public add<T extends IDisposable>(disposable: T): T {
		if (this.isDisposed) {
			disposable.dispose();
			return disposable;
		}
		return this.store.add(disposable);
	}

	public clear(): void {
		this.store.clear();
	}

	public dispose(): void {
		if (this.isDisposed) {
			return;
		}
		this.isDisposed = true;
		this.store.dispose();
		this.host.removeController?.(this);
	}

	public hostDisconnected(): void {
		this.store.clear();
	}
}
