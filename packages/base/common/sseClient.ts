import { Emitter, type Event } from './event.js';
import { Disposable, DisposableStore, MutableDisposable, type IDisposable } from './lifecycle.js';

export type SseConnectOptions = {
	sinceCursor?: string;
};

export type SseStreamEvent<TPayload = unknown> = {
	eventId: string;
	cursor: string;
	aggregateId: string;
	aggregateVersion: number;
	payload?: TPayload;
};

export interface ISseConnection<TEvent extends SseStreamEvent = SseStreamEvent> extends IDisposable {
	readonly onEvent: Event<TEvent>;
}

export type SseConnectionFactory<TEvent extends SseStreamEvent = SseStreamEvent> = (
	options: SseConnectOptions,
) => ISseConnection<TEvent>;

export class OperationalSseClient<TEvent extends SseStreamEvent = SseStreamEvent> extends Disposable {
	private readonly onEventEmitter = this._register(new Emitter<TEvent>());

	private readonly activeConnection = this._register(new MutableDisposable<DisposableStore>());

	private readonly seenEventIds = new Set<string>();

	private readonly deliveredVersionByAggregate = new Map<string, number>();

	private readonly pendingByAggregate = new Map<string, TEvent[]>();

	private lastCursor: string | undefined;

	private isDisposed = false;

	public readonly onEvent: Event<TEvent> = this.onEventEmitter.event;

	public constructor(private readonly createConnection: SseConnectionFactory<TEvent>) {
		super();
	}

	public get cursor(): string | undefined {
		return this.lastCursor;
	}

	public connect(options: SseConnectOptions = {}): void {
		if (this.isDisposed) {
			return;
		}
		const connectionStore = new DisposableStore();
		const sinceCursor = options.sinceCursor ?? this.lastCursor;
		const connection = this.createConnection({ sinceCursor });
		connectionStore.add(connection);
		connectionStore.add(connection.onEvent(event => this.handleIncomingEvent(event)));
		this.activeConnection.value = connectionStore;
	}

	public disconnect(): void {
		this.activeConnection.clear();
	}

	public override dispose(): void {
		if (this.isDisposed) {
			return;
		}
		this.isDisposed = true;
		this.disconnect();
		this.pendingByAggregate.clear();
		this.deliveredVersionByAggregate.clear();
		this.seenEventIds.clear();
		super.dispose();
	}

	private handleIncomingEvent(event: TEvent): void {
		if (this.seenEventIds.has(event.eventId)) {
			return;
		}
		this.seenEventIds.add(event.eventId);
		const pending = this.pendingByAggregate.get(event.aggregateId) ?? [];
		pending.push(event);
		pending.sort((left, right) => left.aggregateVersion - right.aggregateVersion);
		this.pendingByAggregate.set(event.aggregateId, pending);
		this.flushAggregate(event.aggregateId);
	}

	private flushAggregate(aggregateId: string): void {
		const pending = this.pendingByAggregate.get(aggregateId);
		if (!pending || pending.length === 0) {
			return;
		}

		let expectedVersion = this.resolveExpectedVersion(aggregateId, pending);
		let flushed = false;

		while (pending.length > 0 && pending[0]?.aggregateVersion === expectedVersion) {
			const next = pending.shift();
			if (!next) {
				break;
			}
			this.deliveredVersionByAggregate.set(aggregateId, next.aggregateVersion);
			this.lastCursor = next.cursor;
			this.onEventEmitter.fire(next);
			expectedVersion = next.aggregateVersion + 1;
			flushed = true;
		}

		if (pending.length === 0) {
			this.pendingByAggregate.delete(aggregateId);
		} else if (flushed) {
			this.flushAggregate(aggregateId);
		}
	}

	private resolveExpectedVersion(aggregateId: string, pending: readonly TEvent[]): number {
		const deliveredVersion = this.deliveredVersionByAggregate.get(aggregateId);
		if (typeof deliveredVersion === 'number') {
			return deliveredVersion + 1;
		}
		return 1;
	}
}
