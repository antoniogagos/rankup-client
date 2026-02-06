import type { ITrustAppealsService } from '../contracts/trustAppeals.js';
import type { ITrustAppealsGateway as TrustAppealsGateway } from '../contracts/trustAppealsGateway.js';
import { ITrustAppealsGateway } from '../contracts/trustAppealsGateway.js';
import type { Appeal, AppealPage, CreateAppealRequest, GetMyAppealParams, ListMyAppealsQuery } from '../contracts/types.js';

export class TrustAppealsService implements ITrustAppealsService {
	public constructor(@ITrustAppealsGateway private readonly gateway: TrustAppealsGateway) {}

	public async listMyAppeals(query?: ListMyAppealsQuery): Promise<AppealPage> {
		return this.gateway.listMyAppeals(query);
	}

	public async createMyAppeal(body: CreateAppealRequest): Promise<Appeal> {
		return this.gateway.createMyAppeal(body);
	}

	public async getMyAppeal(params: GetMyAppealParams): Promise<Appeal> {
		return this.gateway.getMyAppeal(params);
	}
}
