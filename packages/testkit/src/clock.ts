export interface Clock {
	now(): Date;
}

export class FixedClock implements Clock {
	public constructor(private readonly fixedNow: Date) {}

	public now(): Date {
		return new Date(this.fixedNow.getTime());
	}
}
