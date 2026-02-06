import type { CreateRecapRequest, GetMyRecapParams, GetTournamentRecapParams, GetTournamentRecapQuery, HideMyRecapParams, ListMyRecapsQuery, ListTournamentRecapsParams, ListTournamentRecapsQuery, Recap, RecapSummary, RecapSummaryPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IRecapsService {
	listMyRecaps(query?: ListMyRecapsQuery): Promise<RecapSummaryPage>;
	requestMyRecap(request: CreateRecapRequest): Promise<RecapSummary>;
	getMyRecap(params: GetMyRecapParams): Promise<Recap>;
	hideMyRecap(params: HideMyRecapParams): Promise<void>;
	listTournamentRecaps(params: ListTournamentRecapsParams, query?: ListTournamentRecapsQuery): Promise<RecapSummaryPage>;
	getTournamentRecap(params: GetTournamentRecapParams, query?: GetTournamentRecapQuery): Promise<Recap>;
}

export const IRecapsService = createDecorator<IRecapsService>('recapsService');
