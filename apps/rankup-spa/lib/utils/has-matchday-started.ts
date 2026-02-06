import type { Match, MatchStatus } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';

//  /** not started */
//  NS = 'NS',
// /** postponed */
//   POSTP = 'POSTP',
// /** The game does not have a confirmed date and time yet. It will be announced later on */
//   TBA = 'TBA',
// /** The game is delayed so it will start later */
//   DELAYED = 'DELAYED',
const matchHasNotStarted = new Set<MatchStatus>(['NS', 'POSTP', 'TBA', 'DELAYED']);
export function hasMatchdayStarted(matches: Match[]): boolean {
	const unstartedMatchday = matches.every(match => matchHasNotStarted.has(match.status));
	return !unstartedMatchday;
}
