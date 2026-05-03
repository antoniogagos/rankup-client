import type { GetMyMatchdayResultsParams, GetMyMatchdayResultsQuery, MatchdayResults } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITournamentResultsService {
	getMyMatchdayResults(params: GetMyMatchdayResultsParams, query?: GetMyMatchdayResultsQuery): Promise<MatchdayResults>;
}

export const ITournamentResultsService = createDecorator<ITournamentResultsService>('tournamentResultsService');
