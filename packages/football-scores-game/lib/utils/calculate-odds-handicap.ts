export function calculateOddsHandicap(strOdds: string): boolean {
	const [, , /* home */ /* draw */ away] = strOdds.split('-');
	if (Number(away) > 5) {
		return true;
	}
	return false;
}
