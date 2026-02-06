export function calculateOddsHandicap(odds: unknown): boolean {
	if (typeof odds === 'string') {
		const [, , away] = odds.split('-');
		return Number(away) > 5;
	}
	if (typeof odds === 'object' && odds !== null) {
		const raw = (odds as { raw?: unknown }).raw;
		if (typeof raw === 'string') {
			const [, , away] = raw.split('-');
			return Number(away) > 5;
		}
	}
	return false;
}
