import type { GetMatchParams, ListMatchEventsParams, ListMatchEventsQuery, ListMatchdayMatchesParams, ListMatchdayMatchesQuery, ListMatchdaysParams, ListMatchdaysQuery, Match, MatchEventPage, MatchPage, MatchdayList, SearchMatchesQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ISportsScheduleGateway {
	listMatchdays(params: ListMatchdaysParams, query?: ListMatchdaysQuery): Promise<MatchdayList>;
	listMatchdayMatches(params: ListMatchdayMatchesParams, query?: ListMatchdayMatchesQuery): Promise<MatchPage>;
	searchMatches(query?: SearchMatchesQuery): Promise<MatchPage>;
	getMatch(params: GetMatchParams): Promise<Match>;
	listMatchEvents(params: ListMatchEventsParams, query?: ListMatchEventsQuery): Promise<MatchEventPage>;
}

export const ISportsScheduleGateway = createDecorator<ISportsScheduleGateway>('sportsScheduleGateway');
