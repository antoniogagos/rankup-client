import type { AuthorizationAction } from '../../ports/authorizationPort.js';
import type { TrustSafetyDecision, TrustSafetyPort, TrustSafetyResource } from '../../ports/trustSafetyPort.js';

export type InMemoryTrustSafetyPolicyConfig = {
	blockedActorIds?: ReadonlySet<string>;
	blockedActions?: ReadonlySet<AuthorizationAction>;
	blockedActorActions?: Readonly<Record<string, ReadonlyArray<AuthorizationAction>>>;
};

export class InMemoryTrustSafetyPort implements TrustSafetyPort {
	private readonly blockedActorIds: Set<string>;
	private readonly blockedActions: Set<AuthorizationAction>;
	private readonly blockedActorActions: Readonly<Record<string, ReadonlyArray<AuthorizationAction>>>;

	public constructor(config: InMemoryTrustSafetyPolicyConfig = {}) {
		this.blockedActorIds = new Set(config.blockedActorIds ?? []);
		this.blockedActions = new Set(config.blockedActions ?? []);
		this.blockedActorActions = { ...(config.blockedActorActions ?? {}) };
	}

	public async canProceed(action: AuthorizationAction, actorId: string, _resource: TrustSafetyResource): Promise<TrustSafetyDecision> {
		const blockedByActorList = this.blockedActorIds.has(actorId);
		const blockedByActionList = this.blockedActions.has(action);
		const blockedByActorActionList = (this.blockedActorActions[actorId] ?? []).includes(action);
		const blocked = blockedByActorList || blockedByActionList || blockedByActorActionList;
		return {
			allowed: !blocked,
			reason: blocked ? 'forbiddenRole' : undefined,
			trace: {
				policyId: 'adr0067.trust-safety.v1',
				action,
				actorId,
				blockedByActorList,
				blockedByActionList,
				blockedByActorActionList,
			},
		};
	}
}
