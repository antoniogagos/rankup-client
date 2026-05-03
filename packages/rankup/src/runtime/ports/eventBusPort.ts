import type { DomainEvent } from '../types.js';

export interface EventBusPort {
	publish(event: DomainEvent): Promise<void>;
}
