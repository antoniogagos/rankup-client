import type { TournamentId } from '../../../tournaments/shared/models/ids.js';
import type { EnforcementActionId, TrustPolicyId } from '../../shared/models/ids.js';

export type EnforcementActionType = 'chatMuteGlobal' | 'chatMuteTournament' | 'contentRestriction' | 'profileRestriction' | 'rankedRestriction' | 'suspension' | 'ban';

export type EnforcementScope = {
	tournamentId?: TournamentId;
	chatOnly?: boolean;
	featureFlags?: string[];
};

export type EnforcementAction = {
	actionId: EnforcementActionId;
	type: EnforcementActionType;
	scope?: EnforcementScope;
	reasonCode?: string;
	reasonText?: string;
	createdAt: string;
	startsAt?: string;
	endsAt?: string;
	appealable?: boolean;
	policyId?: TrustPolicyId;
};

export type EnforcementStatus = {
	serverTime: string;
	isRestricted: boolean;
	actions: EnforcementAction[];
};
