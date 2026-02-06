import { mapRecap, mapRecapSummary, mapRecapSummaryPage } from './recaps-mappers.js';
import type * as Api from '@rankup/api';
import type { IRecapsGateway } from '@rankup/rankup/domains/engagement/recaps/contracts/recapsGateway.js';
import type * as Domain from '@rankup/rankup/domains/engagement/recaps/contracts/types.js';

const mapListMyRecapsQuery = (query?: Domain.ListMyRecapsQuery): Api.ListMyRecapsQuery | undefined =>
	query
		? {
			type: query.type,
			status: query.status,
			tournamentId: query.tournamentId,
			includeHidden: query.includeHidden,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapCreateRecapRequest = (request: Domain.CreateRecapRequest): Api.RequestMyRecapRequest => ({
	type: request.type,
	context: request.context,
	view: request.view,
	clientContext: request.clientContext,
});

const mapListTournamentRecapsQuery = (
	query?: Domain.ListTournamentRecapsQuery,
): Api.ListTournamentRecapsQuery | undefined =>
	query
		? {
			type: query.type,
			status: query.status,
			matchday: query.matchday,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetTournamentRecapQuery = (query?: Domain.GetTournamentRecapQuery): Api.GetTournamentRecapQuery | undefined =>
	query
		? {
			view: query.view,
		}
		: undefined;

export class RecapsGateway implements IRecapsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyRecaps(query?: Domain.ListMyRecapsQuery): Promise<Domain.RecapSummaryPage> {
		const response = await this.apiClient.listMyRecaps(mapListMyRecapsQuery(query));
		return mapRecapSummaryPage(response);
	}

	public async requestMyRecap(request: Domain.CreateRecapRequest): Promise<Domain.RecapSummary> {
		const response = await this.apiClient.requestMyRecap(mapCreateRecapRequest(request));
		return mapRecapSummary(response);
	}

	public async getMyRecap(params: Domain.GetMyRecapParams): Promise<Domain.Recap> {
		const response = await this.apiClient.getMyRecap({ recapId: params.recapId });
		return mapRecap(response);
	}

	public async hideMyRecap(params: Domain.HideMyRecapParams): Promise<void> {
		await this.apiClient.hideMyRecap({ recapId: params.recapId });
	}

	public async listTournamentRecaps(
		params: Domain.ListTournamentRecapsParams,
		query?: Domain.ListTournamentRecapsQuery,
	): Promise<Domain.RecapSummaryPage> {
		const response = await this.apiClient.listTournamentRecaps(
			{ tournamentId: params.tournamentId },
			mapListTournamentRecapsQuery(query),
		);
		return mapRecapSummaryPage(response);
	}

	public async getTournamentRecap(params: Domain.GetTournamentRecapParams, query?: Domain.GetTournamentRecapQuery): Promise<Domain.Recap> {
		const response = await this.apiClient.getTournamentRecap(
			{ tournamentId: params.tournamentId, recapId: params.recapId },
			mapGetTournamentRecapQuery(query),
		);
		return mapRecap(response);
	}
}
