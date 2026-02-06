import type { GetTrustPolicyParams, ListTrustPoliciesQuery, TrustPolicy, TrustPolicyList } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITrustPoliciesService {
	listTrustPolicies(query?: ListTrustPoliciesQuery): Promise<TrustPolicyList>;
	getTrustPolicy(params: GetTrustPolicyParams): Promise<TrustPolicy>;
}

export const ITrustPoliciesService = createDecorator<ITrustPoliciesService>('trustPoliciesService');
