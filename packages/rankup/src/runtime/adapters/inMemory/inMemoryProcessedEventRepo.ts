import type { ProcessedEventRepo } from '../../ports/processedEventRepo.js';

export class InMemoryProcessedEventRepo implements ProcessedEventRepo {
	private readonly keys = new Set<string>();

	public async has(eventKey: string): Promise<boolean> {
		return this.keys.has(eventKey);
	}

	public async mark(eventKey: string): Promise<void> {
		this.keys.add(eventKey);
	}

	public async markIfAbsent(eventKey: string): Promise<boolean> {
		if (this.keys.has(eventKey)) {
			return false;
		}
		this.keys.add(eventKey);
		return true;
	}
}
