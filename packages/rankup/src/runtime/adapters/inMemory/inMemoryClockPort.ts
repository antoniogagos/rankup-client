import type { ClockPort } from '../../ports/clockPort.js';

export class InMemoryClockPort implements ClockPort {
	private now: Date;

	public constructor(now: Date = new Date()) {
		this.now = new Date(now);
	}

	public nowIso(): string {
		return this.now.toISOString();
	}

	public setNow(next: Date): void {
		this.now = new Date(next);
	}
}
