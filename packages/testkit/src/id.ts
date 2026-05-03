export interface IdGenerator {
	next(prefix?: string): string;
}

export class DeterministicIdGenerator implements IdGenerator {
	private counter = 0;

	public constructor(private readonly seed: string = 'test') {}

	public next(prefix?: string): string {
		this.counter += 1;
		const safePrefix = prefix ?? 'id';
		return `${safePrefix}-${this.seed}-${String(this.counter).padStart(4, '0')}`;
	}
}
