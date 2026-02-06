import { mapVerifiedHub } from './verified-mappers.js';
import type * as Api from '@rankup/api';
import type { IVerifiedHubGateway } from '@rankup/rankup/domains/verified/hub/contracts/hubGateway.js';
import type * as Domain from '@rankup/rankup/domains/verified/hub/contracts/types.js';

const mapGetVerifiedHubQuery = (query?: Domain.GetVerifiedHubQuery): Api.GetVerifiedHubQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class VerifiedHubGateway implements IVerifiedHubGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getVerifiedHub(query?: Domain.GetVerifiedHubQuery): Promise<Domain.VerifiedHub> {
		const response = await this.apiClient.getVerifiedHub(mapGetVerifiedHubQuery(query));
		return mapVerifiedHub(response);
	}
}
