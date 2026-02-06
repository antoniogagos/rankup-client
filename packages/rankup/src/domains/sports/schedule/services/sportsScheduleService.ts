import type { ISportsScheduleService } from '../contracts/sportsSchedule.js';
import type { ISportsScheduleGateway as SportsScheduleGateway } from '../contracts/sportsScheduleGateway.js';
import { ISportsScheduleGateway } from '../contracts/sportsScheduleGateway.js';
import type { GetMatchParams, ListMatchEventsParams, ListMatchEventsQuery, ListMatchdayMatchesParams, ListMatchdayMatchesQuery, ListMatchdaysParams, ListMatchdaysQuery, Match, MatchEventPage, MatchPage, MatchdayList, SearchMatchesQuery } from '../contracts/types.js';

export class SportsScheduleService implements ISportsScheduleService {
	public constructor(@ISportsScheduleGateway private readonly gateway: SportsScheduleGateway) {}

	public async listMatchdays(params: ListMatchdaysParams, query?: ListMatchdaysQuery): Promise<MatchdayList> {
		return this.gateway.listMatchdays(params, query);
	}

	public async listMatchdayMatches(params: ListMatchdayMatchesParams, query?: ListMatchdayMatchesQuery): Promise<MatchPage> {
		return this.gateway.listMatchdayMatches(params, query);
	}

	public async searchMatches(query?: SearchMatchesQuery): Promise<MatchPage> {
		return this.gateway.searchMatches(query);
	}

	public async getMatch(params: GetMatchParams): Promise<Match> {
		return this.gateway.getMatch(params);
	}

	public async listMatchEvents(params: ListMatchEventsParams, query?: ListMatchEventsQuery): Promise<MatchEventPage> {
		return this.gateway.listMatchEvents(params, query);
	}
}
