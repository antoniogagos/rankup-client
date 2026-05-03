import { Emitter } from '@rankup/base/common/event.js';
import type { IDisposable } from '@rankup/base/common/lifecycle.js';
import { OperationalSseClient, type ISseConnection, type SseConnectOptions } from '@rankup/base/common/sseClient.js';
import type { FakeSseServer, StreamEvent } from './fakeSseServer.js';

export type ConnectOptions = SseConnectOptions;

function createFakeSseConnection(server: FakeSseServer, options: ConnectOptions): ISseConnection<StreamEvent> {
	let unsubscribe: (() => void) | undefined;
	const emitter = new Emitter<StreamEvent>();
	const onEvent: ISseConnection<StreamEvent>['onEvent'] = (listener, thisArgs, disposables) => {
		const disposable = emitter.event(listener, thisArgs, disposables);
		if (!unsubscribe) {
			unsubscribe = server.subscribe(event => emitter.fire(event), options.sinceCursor);
		}
		return disposable;
	};
	return {
		onEvent,
		dispose: () => {
			unsubscribe?.();
			unsubscribe = undefined;
			emitter.dispose();
		},
	};
}

export class FakeEventStreamClient {
	private readonly client: OperationalSseClient<StreamEvent>;

	private eventSubscription: IDisposable | undefined;

	public constructor(private readonly server: FakeSseServer) {
		this.client = new OperationalSseClient(options => createFakeSseConnection(this.server, options));
	}

	public onEvent(handler: (event: StreamEvent) => void): void {
		this.eventSubscription?.dispose();
		this.eventSubscription = this.client.onEvent(handler);
	}

	public async connect(options: ConnectOptions): Promise<void> {
		this.client.connect(options);
	}

	public async disconnect(): Promise<void> {
		this.client.disconnect();
	}

	public dispose(): void {
		this.eventSubscription?.dispose();
		this.eventSubscription = undefined;
		this.client.dispose();
	}
}
