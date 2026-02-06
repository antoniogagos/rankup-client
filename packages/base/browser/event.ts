import { type Event as EventFn, Emitter } from '../common/event.js';
import { type IDisposable, DisposableStore, toDisposable } from '../common/lifecycle.js';
import { type ReactiveController, type ReactiveControllerHost } from './disposableController.js';

export function listen<T extends Event>(target: EventTarget, type: string, listener: (event: T) => void, options?: AddEventListenerOptions | boolean, disposables?: IDisposable[] | DisposableStore): IDisposable {
	target.addEventListener(type, listener as EventListener, options);
	const disposable = toDisposable(() => target.removeEventListener(type, listener as EventListener, options));
	if (Array.isArray(disposables)) {
		disposables.push(disposable);
	} else if (disposables) {
		disposables.add(disposable);
	}
	return disposable;
}

export class DomEmitter<T extends Event> implements IDisposable {
	private readonly emitter: Emitter<T>;

	private listener?: (event: Event) => void;

	public readonly event: EventFn<T>;

	public constructor(private readonly target: EventTarget, private readonly type: string, private readonly options?: AddEventListenerOptions | boolean) {
		this.emitter = new Emitter<T>({
			onFirstListenerAdd: () => this.start(),
			onLastListenerRemove: () => this.stop(),
		});
		this.event = this.emitter.event;
	}

	public dispose(): void {
		this.stop();
		this.emitter.dispose();
	}

	private start(): void {
		if (this.listener) {
			return;
		}
		this.listener = event => this.emitter.fire(event as T);
		this.target.addEventListener(this.type, this.listener as EventListener, this.options);
	}

	private stop(): void {
		if (!this.listener) {
			return;
		}
		this.target.removeEventListener(this.type, this.listener as EventListener, this.options);
		this.listener = undefined;
	}
}

export type EventEmitterMap = Record<string, CustomEvent<unknown>>;

export class EventEmitter<TEvents extends EventEmitterMap> implements IDisposable {
	private readonly pending = new Map<keyof TEvents, ReturnType<typeof setTimeout>>();

	public constructor(private readonly target: EventTarget, private readonly defaults?: CustomEventInit) {}

	public dispatch<K extends keyof TEvents>(type: K, detail: TEvents[K] extends CustomEvent<infer D> ? D : never, init?: CustomEventInit): boolean {
		const eventInit = { bubbles: true, composed: true, detail, ...this.defaults, ...init };
		return this.target.dispatchEvent(new CustomEvent(String(type), eventInit));
	}

	public debouncedDispatch<K extends keyof TEvents>(type: K, detail: TEvents[K] extends CustomEvent<infer D> ? D : never, delay = 0, init?: CustomEventInit): void {
		const key = type as keyof TEvents;
		const existing = this.pending.get(key);
		if (existing) {
			clearTimeout(existing);
		}
		const handle = setTimeout(() => {
			this.pending.delete(key);
			this.dispatch(type, detail, init);
		}, delay);
		this.pending.set(key, handle);
	}

	public dispose(): void {
		for (const handle of this.pending.values()) {
			clearTimeout(handle);
		}
		this.pending.clear();
	}
}

export class EventEmitterController<TEvents extends EventEmitterMap> implements ReactiveController, IDisposable {
	private readonly emitter: EventEmitter<TEvents>;

	public constructor(private readonly host: ReactiveControllerHost, target: EventTarget = host as unknown as EventTarget) {
		this.emitter = new EventEmitter<TEvents>(target);
		host.addController(this);
	}

	public dispatch<K extends keyof TEvents>(type: K, detail: TEvents[K] extends CustomEvent<infer D> ? D : never, init?: CustomEventInit): boolean {
		return this.emitter.dispatch(type, detail, init);
	}

	public debouncedDispatch<K extends keyof TEvents>(type: K, detail: TEvents[K] extends CustomEvent<infer D> ? D : never, delay = 0, init?: CustomEventInit): void {
		this.emitter.debouncedDispatch(type, detail, delay, init);
	}

	public dispose(): void {
		this.emitter.dispose();
		this.host.removeController?.(this);
	}

	public hostDisconnected(): void {
		this.dispose();
	}
}
