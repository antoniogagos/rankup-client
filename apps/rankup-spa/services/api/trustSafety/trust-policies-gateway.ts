import { mapTrustPolicy, mapTrustPolicyList } from './trust-mappers.js';
import type * as Api from '@rankup/api';
import type { ITrustPoliciesGateway } from '@rankup/rankup/domains/trustSafety/shared/contracts/trustPoliciesGateway.js';
import type * as Domain from '@rankup/rankup/domains/trustSafety/shared/contracts/types.js';

const mapListTrustPoliciesQuery = (query?: Domain.ListTrustPoliciesQuery): Api.ListTrustPoliciesQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class TrustPoliciesGateway implements ITrustPoliciesGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listTrustPolicies(query?: Domain.ListTrustPoliciesQuery): Promise<Domain.TrustPolicyList> {
		const response = await this.apiClient.listTrustPolicies(mapListTrustPoliciesQuery(query));
		return mapTrustPolicyList(response);
	}

	public async getTrustPolicy(params: Domain.GetTrustPolicyParams): Promise<Domain.TrustPolicy> {
		const response = await this.apiClient.getTrustPolicy({ policyId: params.policyId });
		return mapTrustPolicy(response);
	}
}
