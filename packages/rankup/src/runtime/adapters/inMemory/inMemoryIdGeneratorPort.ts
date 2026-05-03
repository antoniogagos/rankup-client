import type { IdGeneratorPort } from '../../ports/idGeneratorPort.js';

export class InMemoryIdGeneratorPort implements IdGeneratorPort {
	private counter = 0;

	public nextId(prefix: string): string {
		this.counter += 1;
		return `${prefix}_${String(this.counter).padStart(6, '0')}`;
	}
}
