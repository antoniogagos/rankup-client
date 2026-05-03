import { FakeEventStreamClient } from '@rankup/testkit/streaming/fakeEventStreamClient.js';
import { FakeSseServer } from '@rankup/testkit/streaming/fakeSseServer.js';
import { describe, expect, it } from 'vitest';

describe('[P0] event stream reconnect + dedupe + ordering', () => {
	it('dedupes events by eventId', async () => {
		const server = new FakeSseServer();
		const client = new FakeEventStreamClient(server);
		const received: string[] = [];
		client.onEvent(event => {
			received.push(event.eventId);
		});

		await client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });

		expect(received).toEqual(['e1']);
		client.dispose();
		expect(server.openConnections).toBe(0);
	});

	it('reconnects using sinceCursor and resumes without gaps', async () => {
		const server = new FakeSseServer();
		const client = new FakeEventStreamClient(server);
		const receivedCursors: string[] = [];
		client.onEvent(event => {
			receivedCursors.push(event.cursor);
		});

		await client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });
		await client.disconnect();
		expect(server.openConnections).toBe(0);

		server.emit({ eventId: 'e2', cursor: 'c2', aggregateId: 't1', aggregateVersion: 2 });
		await client.connect({ sinceCursor: 'c1' });

		expect(receivedCursors).toContain('c1');
		expect(receivedCursors).toContain('c2');
		client.dispose();
		expect(server.openConnections).toBe(0);
	});

	it('enforces ordering by aggregateVersion', async () => {
		const server = new FakeSseServer();
		const client = new FakeEventStreamClient(server);
		const versions: number[] = [];
		client.onEvent(event => {
			versions.push(event.aggregateVersion);
		});

		await client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e2', cursor: 'c2', aggregateId: 't1', aggregateVersion: 2 });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });

		expect(versions).toEqual([1, 2]);
		client.dispose();
		expect(server.openConnections).toBe(0);
	});

	it('stops delivering events after dispose', async () => {
		const server = new FakeSseServer();
		const client = new FakeEventStreamClient(server);
		const received: string[] = [];
		client.onEvent(event => {
			received.push(event.eventId);
		});

		await client.connect({ sinceCursor: undefined });
		server.emit({ eventId: 'e1', cursor: 'c1', aggregateId: 't1', aggregateVersion: 1 });
		client.dispose();
		server.emit({ eventId: 'e2', cursor: 'c2', aggregateId: 't1', aggregateVersion: 2 });

		expect(received).toEqual(['e1']);
		expect(server.openConnections).toBe(0);
	});
});
