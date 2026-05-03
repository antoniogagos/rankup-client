import type { EventBusPort } from '../../ports/eventBusPort.js';
import type { DomainEvent } from '../../types.js';

export class InMemoryEventBusPort implements EventBusPort {
	private readonly events: DomainEvent[] = [];

	public async publish(event: DomainEvent): Promise<void> {
		this.events.push({
			...event,
			payload: { ...event.payload },
		});
	}

	public listEvents(): DomainEvent[] {
		return this.events.map(event => ({
			...event,
			payload: { ...event.payload },
		}));
	}
}
