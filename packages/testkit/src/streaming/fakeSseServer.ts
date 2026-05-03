export type StreamEvent = {
	eventId: string;
	cursor: string;
	aggregateId: string;
	aggregateVersion: number;
	payload?: unknown;
};

type Listener = (event: StreamEvent) => void;

export class FakeSseServer {
	private readonly listeners = new Set<Listener>();
	private readonly history: StreamEvent[] = [];

	public get openConnections(): number {
		return this.listeners.size;
	}

	public emit(event: StreamEvent): void {
		this.history.push(event);
		for (const listener of this.listeners) {
			listener(event);
		}
	}

	public subscribe(listener: Listener, sinceCursor?: string): () => void {
		const replay = this.getEventsSince(sinceCursor);
		for (const event of replay) {
			listener(event);
		}
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private getEventsSince(sinceCursor?: string): StreamEvent[] {
		if (!sinceCursor) {
			return this.history.slice();
		}
		const cursorIndex = this.history.findIndex(event => event.cursor === sinceCursor);
		if (cursorIndex === -1) {
			return this.history.slice();
		}
		return this.history.slice(cursorIndex + 1);
	}
}
