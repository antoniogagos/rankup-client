import type { ITrustPoliciesService } from '../contracts/trustPolicies.js';
import type { ITrustPoliciesGateway as TrustPoliciesGateway } from '../contracts/trustPoliciesGateway.js';
import { ITrustPoliciesGateway } from '../contracts/trustPoliciesGateway.js';
import type { GetTrustPolicyParams, ListTrustPoliciesQuery, TrustPolicy, TrustPolicyList } from '../contracts/types.js';

export class TrustPoliciesService implements ITrustPoliciesService {
	public constructor(@ITrustPoliciesGateway private readonly gateway: TrustPoliciesGateway) {}

	public async listTrustPolicies(query?: ListTrustPoliciesQuery): Promise<TrustPolicyList> {
		return this.gateway.listTrustPolicies(query);
	}

	public async getTrustPolicy(params: GetTrustPolicyParams): Promise<TrustPolicy> {
		return this.gateway.getTrustPolicy(params);
	}
}
