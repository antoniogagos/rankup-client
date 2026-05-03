export type RecordedEvent = {
	topic: string;
	payload: unknown;
};

export class FakeEventBus {
	public readonly published: RecordedEvent[] = [];

	public publish(topic: string, payload: unknown): void {
		this.published.push({ topic, payload });
	}
}
