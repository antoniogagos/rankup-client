import type { AuthorizationAction, AuthorizationDecision, AuthorizationPort, AuthorizationResource } from '../../ports/authorizationPort.js';
import type { EngineRole } from '../../types.js';

type AuthorizationRule = {
	allowedRoles: EngineRole[];
	membershipRequired: boolean;
};

const AUTHORIZATION_RULES: Record<AuthorizationAction, AuthorizationRule> = {
	joinTournament: {
		allowedRoles: ['player', 'moderator', 'admin', 'owner', 'staff'],
		membershipRequired: false,
	},
	upsertMatchdaySubmission: {
		allowedRoles: ['player', 'moderator', 'admin', 'owner', 'staff'],
		membershipRequired: true,
	},
	clearMatchdaySubmission: {
		allowedRoles: ['player', 'moderator', 'admin', 'owner', 'staff'],
		membershipRequired: true,
	},
	cancelTournamentLifecycle: {
		allowedRoles: ['staff'],
		membershipRequired: false,
	},
	lockTournamentLifecycle: {
		allowedRoles: ['owner', 'admin', 'staff'],
		membershipRequired: false,
	},
	unlockTournamentLifecycle: {
		allowedRoles: ['owner', 'admin', 'staff'],
		membershipRequired: false,
	},
	archiveTournamentLifecycle: {
		allowedRoles: ['owner', 'admin', 'staff'],
		membershipRequired: false,
	},
	unarchiveTournamentLifecycle: {
		allowedRoles: ['owner', 'admin', 'staff'],
		membershipRequired: false,
	},
	transferTournamentOwnership: {
		allowedRoles: ['owner', 'admin', 'staff'],
		membershipRequired: false,
	},
};

export type InMemoryAuthorizationPolicyConfig = {
	denyActions?: ReadonlySet<AuthorizationAction>;
	roleByActorId?: Readonly<Record<string, EngineRole>>;
};

function resolveActorRole(actorId: string, resource: AuthorizationResource, roleByActorId: Readonly<Record<string, EngineRole>>): EngineRole {
	return resource.actorRole ?? roleByActorId[actorId] ?? resource.membershipRole ?? 'player';
}

export class InMemoryAuthorizationPort implements AuthorizationPort {
	private readonly denyActions: Set<AuthorizationAction>;
	private readonly roleByActorId: Readonly<Record<string, EngineRole>>;

	public constructor(config: InMemoryAuthorizationPolicyConfig = {}) {
		this.denyActions = new Set(config.denyActions ?? []);
		this.roleByActorId = { ...(config.roleByActorId ?? {}) };
	}

	public async canPerform(action: AuthorizationAction, actorId: string, resource: AuthorizationResource): Promise<AuthorizationDecision> {
		const rule = AUTHORIZATION_RULES[action];
		const actorRole = resolveActorRole(actorId, resource, this.roleByActorId);
		const membershipRole = resource.membershipRole ?? null;
		const denyActionOverride = this.denyActions.has(action);

		if (denyActionOverride) {
			return {
				allowed: false,
				reason: 'forbiddenRole',
				trace: {
					policyId: 'adr0067.roles-permissions.v1',
					action,
					actorId,
					actorRole,
					requiredRoles: [...rule.allowedRoles],
					membershipRequired: rule.membershipRequired,
					membershipRole,
					denyActionOverride: true,
				},
			};
		}

		if (rule.membershipRequired && !membershipRole) {
			return {
				allowed: false,
				reason: 'notMember',
				trace: {
					policyId: 'adr0067.roles-permissions.v1',
					action,
					actorId,
					actorRole,
					requiredRoles: [...rule.allowedRoles],
					membershipRequired: true,
					membershipRole: null,
					denyActionOverride: false,
				},
			};
		}

		if (!rule.allowedRoles.includes(actorRole)) {
			return {
				allowed: false,
				reason: 'forbiddenRole',
				trace: {
					policyId: 'adr0067.roles-permissions.v1',
					action,
					actorId,
					actorRole,
					requiredRoles: [...rule.allowedRoles],
					membershipRequired: rule.membershipRequired,
					membershipRole,
					denyActionOverride: false,
				},
			};
		}

		return {
			allowed: true,
			trace: {
				policyId: 'adr0067.roles-permissions.v1',
				action,
				actorId,
				actorRole,
				requiredRoles: [...rule.allowedRoles],
				membershipRequired: rule.membershipRequired,
				membershipRole,
				denyActionOverride: false,
			},
		};
	}
}
