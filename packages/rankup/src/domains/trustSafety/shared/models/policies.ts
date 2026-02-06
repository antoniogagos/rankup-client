import type { TrustPolicyInclude } from './enums.js';
import type { TrustPolicyId } from './ids.js';

export type TrustPolicy = {
	policyId: TrustPolicyId;
	title: string;
	version: string;
	updatedAt: string;
	url: string;
	content?: string;
	summary?: string;
};

export type TrustPolicyList = {
	items: TrustPolicy[];
};

export type ListTrustPoliciesQuery = {
	include?: TrustPolicyInclude[];
};

export type GetTrustPolicyParams = {
	policyId: TrustPolicyId;
};
