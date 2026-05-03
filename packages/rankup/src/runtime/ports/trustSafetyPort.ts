import type { AuthorizationAction, AuthorizationResource } from './authorizationPort.js';

export type TrustSafetyResource = AuthorizationResource;

export type TrustSafetyDecisionTrace = {
	policyId: 'adr0067.trust-safety.v1';
	action: AuthorizationAction;
	actorId: string;
	blockedByActorList: boolean;
	blockedByActionList: boolean;
	blockedByActorActionList: boolean;
};

export type TrustSafetyDecision = {
	allowed: boolean;
	reason?: 'forbiddenRole' | 'notMember';
	trace: TrustSafetyDecisionTrace;
};

export interface TrustSafetyPort {
	canProceed(action: AuthorizationAction, actorId: string, resource: TrustSafetyResource): Promise<TrustSafetyDecision>;
}
