import type { GetMatchdayMatchesParams, GetMatchdayMatchesQuery, GetTournamentMatchdayAvailabilityParams, GetTournamentMatchdayParams, ListTournamentMatchdaysParams, ListTournamentMatchdaysQuery, MatchdayAvailability, TournamentMatchday, TournamentMatchdayPage, TournamentMatchPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITourneyMatchdaysService {
	listTournamentMatchdays(params: ListTournamentMatchdaysParams, query?: ListTournamentMatchdaysQuery): Promise<TournamentMatchdayPage>;
	getTournamentMatchday(params: GetTournamentMatchdayParams): Promise<TournamentMatchday>;
	getTournamentMatchdayAvailability(params: GetTournamentMatchdayAvailabilityParams): Promise<MatchdayAvailability>;
	getMatchdayMatches(params: GetMatchdayMatchesParams, query?: GetMatchdayMatchesQuery): Promise<TournamentMatchPage>;
}

export const ITourneyMatchdaysService = createDecorator<ITourneyMatchdaysService>('tourneyMatchdaysService');
