export function validateMatchdayNumber(value: number): void {
	if (!Number.isInteger(value) || value < 1) {
		throw new Error('matchday must be a positive integer.');
	}
}
