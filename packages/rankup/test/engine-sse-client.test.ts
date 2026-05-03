import { Emitter } from '@rankup/base/common/event.js';
import { OperationalSseClient, type ISseConnection, type SseConnectOptions } from '@rankup/base/common/sseClient.js';
import { FakeSseServer, type StreamEvent } from '@rankup/testkit/streaming/fakeSseServer.js';
import { describe, expect, it } from 'vitest';

function createConnection(server: FakeSseServer, options: SseConnectOptions): ISseConnection<StreamEvent> {
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

function createClient(server: FakeSseServer): OperationalSseClient<StreamEvent> {
	return new OperationalSseClient(options => createConnection(server, options));
}

describe('engine sse client operational behavior', () => {
	it('dedupes by eventId', () => {
		const server = new FakeSseServer();
		const client = createClient(server);
		const receivedIds: string[] = [];
		client.onEvent(event => {
			receivedIds.push(event.eventId);
		});

		client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });

		expect(receivedIds).toEqual(['e1']);
		client.dispose();
		expect(server.openConnections).toBe(0);
	});

	it('reconnects with sinceCursor and resumes without loss', () => {
		const server = new FakeSseServer();
		const client = createClient(server);
		const receivedCursors: string[] = [];
		client.onEvent(event => {
			receivedCursors.push(event.cursor);
		});

		client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });
		client.disconnect();
		expect(server.openConnections).toBe(0);

		server.emit({ eventId: 'e2', cursor: 'c2', aggregateId: 't1', aggregateVersion: 2 });
		client.connect({ sinceCursor: 'c1' });

		expect(receivedCursors).toEqual(['c1', 'c2']);
		client.dispose();
		expect(server.openConnections).toBe(0);
	});

	it('orders events by aggregateVersion', () => {
		const server = new FakeSseServer();
		const client = createClient(server);
		const versions: number[] = [];
		client.onEvent(event => {
			versions.push(event.aggregateVersion);
		});

		client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e2', cursor: 'c2', aggregateId: 't1', aggregateVersion: 2 });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });

		expect(versions).toEqual([1, 2]);
		client.dispose();
		expect(server.openConnections).toBe(0);
	});

	it('stops delivering events after dispose', () => {
		const server = new FakeSseServer();
		const client = createClient(server);
		const receivedIds: string[] = [];
		client.onEvent(event => {
			receivedIds.push(event.eventId);
		});

		client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });
		client.dispose();
		server.emit({ eventId: 'e2', cursor: 'c2', aggregateId: 't1', aggregateVersion: 2 });

		expect(receivedIds).toEqual(['e1']);
		expect(server.openConnections).toBe(0);
	});
});
