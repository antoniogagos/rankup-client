import type { GetTrustPolicyParams, ListTrustPoliciesQuery, TrustPolicy, TrustPolicyList } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITrustPoliciesGateway {
	listTrustPolicies(query?: ListTrustPoliciesQuery): Promise<TrustPolicyList>;
	getTrustPolicy(params: GetTrustPolicyParams): Promise<TrustPolicy>;
}

export const ITrustPoliciesGateway = createDecorator<ITrustPoliciesGateway>('trustPoliciesGateway');
