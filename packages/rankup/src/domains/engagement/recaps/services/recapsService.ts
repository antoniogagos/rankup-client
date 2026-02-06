import type { IRecapsService } from '../contracts/recaps.js';
import type { IRecapsGateway as RecapsGateway } from '../contracts/recapsGateway.js';
import { IRecapsGateway } from '../contracts/recapsGateway.js';
import type { CreateRecapRequest, GetMyRecapParams, GetTournamentRecapParams, GetTournamentRecapQuery, HideMyRecapParams, ListMyRecapsQuery, ListTournamentRecapsParams, ListTournamentRecapsQuery, Recap, RecapSummary, RecapSummaryPage } from '../contracts/types.js';

export class RecapsService implements IRecapsService {
	public constructor(@IRecapsGateway private readonly gateway: RecapsGateway) {}

	public async listMyRecaps(query?: ListMyRecapsQuery): Promise<RecapSummaryPage> {
		return this.gateway.listMyRecaps(query);
	}

	public async requestMyRecap(request: CreateRecapRequest): Promise<RecapSummary> {
		return this.gateway.requestMyRecap(request);
	}

	public async getMyRecap(params: GetMyRecapParams): Promise<Recap> {
		return this.gateway.getMyRecap(params);
	}

	public async hideMyRecap(params: HideMyRecapParams): Promise<void> {
		return this.gateway.hideMyRecap(params);
	}

	public async listTournamentRecaps(
		params: ListTournamentRecapsParams,
		query?: ListTournamentRecapsQuery,
	): Promise<RecapSummaryPage> {
		return this.gateway.listTournamentRecaps(params, query);
	}

	public async getTournamentRecap(params: GetTournamentRecapParams, query?: GetTournamentRecapQuery): Promise<Recap> {
		return this.gateway.getTournamentRecap(params, query);
	}
}
