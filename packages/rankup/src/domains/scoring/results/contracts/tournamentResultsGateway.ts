import type { GetMyMatchdayResultsParams, GetMyMatchdayResultsQuery, MatchdayResults } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITournamentResultsGateway {
	getMyMatchdayResults(params: GetMyMatchdayResultsParams, query?: GetMyMatchdayResultsQuery): Promise<MatchdayResults>;
}

export const ITournamentResultsGateway = createDecorator<ITournamentResultsGateway>('tournamentResultsGateway');
