import type { Match, MatchStatus } from '../rk-data-service/api-service';

//  /** not started */
//  NS = 'NS',
// /** postponed */
//   POSTP = 'POSTP',
// /** The game does not have a confirmed date and time yet. It will be announced later on */
//   TBA = 'TBA',
// /** The game is delayed so it will start later */
//   DELAYED = 'DELAYED',
const matchHasNotStarted = ['NS', 'POSTP', 'TBA', 'DELAYED'];
export function hasMatchdayStarted(matches: Match[]): Boolean {
  const unstartedMatchday = matches.every(match =>
    matchHasNotStarted.includes(match.status as MatchStatus),
  );
  return !unstartedMatchday;
}
