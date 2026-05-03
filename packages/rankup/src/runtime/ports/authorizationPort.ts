import type { EngineRole } from '../types.js';

export type AuthorizationAction =
	| 'joinTournament'
	| 'upsertMatchdaySubmission'
	| 'clearMatchdaySubmission'
	| 'cancelTournamentLifecycle'
	| 'lockTournamentLifecycle'
	| 'unlockTournamentLifecycle'
	| 'archiveTournamentLifecycle'
	| 'unarchiveTournamentLifecycle'
	| 'transferTournamentOwnership';

export type AuthorizationResource = {
	tournamentId: string;
	matchday?: number;
	actorRole?: EngineRole;
	membershipRole?: Exclude<EngineRole, 'staff'>;
	targetUserId?: string;
};

export type AuthorizationDecisionTrace = {
	policyId: 'adr0067.roles-permissions.v1';
	action: AuthorizationAction;
	actorId: string;
	actorRole: EngineRole;
	requiredRoles: EngineRole[];
	membershipRequired: boolean;
	membershipRole: Exclude<EngineRole, 'staff'> | null;
	denyActionOverride: boolean;
};

export type AuthorizationDecision = {
	allowed: boolean;
	reason?: 'forbiddenRole' | 'notMember';
	trace: AuthorizationDecisionTrace;
};

export interface AuthorizationPort {
	canPerform(action: AuthorizationAction, actorId: string, resource: AuthorizationResource): Promise<AuthorizationDecision>;
}
