import { mapAppeal, mapAppealPage, mapCreateAppealRequest } from './trust-mappers.js';
import type * as Api from '@rankup/api';
import type { ITrustAppealsGateway } from '@rankup/rankup/domains/trustSafety/appeals/contracts/trustAppealsGateway.js';
import type * as Domain from '@rankup/rankup/domains/trustSafety/appeals/contracts/types.js';

const mapListMyAppealsQuery = (query?: Domain.ListMyAppealsQuery): Api.ListMyAppealsQuery | undefined =>
	query
		? {
			status: query.status,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class TrustAppealsGateway implements ITrustAppealsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyAppeals(query?: Domain.ListMyAppealsQuery): Promise<Domain.AppealPage> {
		const response = await this.apiClient.listMyAppeals(mapListMyAppealsQuery(query));
		return mapAppealPage(response);
	}

	public async createMyAppeal(body: Domain.CreateAppealRequest): Promise<Domain.Appeal> {
		const response = await this.apiClient.createMyAppeal(mapCreateAppealRequest(body));
		return mapAppeal(response);
	}

	public async getMyAppeal(params: Domain.GetMyAppealParams): Promise<Domain.Appeal> {
		const response = await this.apiClient.getMyAppeal({ appealId: params.appealId });
		return mapAppeal(response);
	}
}
