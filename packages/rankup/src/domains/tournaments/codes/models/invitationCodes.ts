import type { InvitationCodeJoinNotAllowedReason, InvitationCodeStatus } from '../../shared/models/enums.js';
import type { TournamentId } from '../../shared/models/ids.js';
import type { TournamentPreview } from '../../core/models/preview.js';
import type { MyMembershipSummary, TournamentSummary } from '../../core/models/tournament.js';

export type InvitationCode = {
	code: string;
	tournamentId: TournamentId;
	status: InvitationCodeStatus;
	createdAt: string;
	createdByUserId?: string;
	label?: string;
	expiresAt?: string;
	revokedAt?: string;
	maxUses?: number;
	useCount?: number;
};

export type InvitationCodePage = {
	items: InvitationCode[];
	nextCursor?: string;
};

export type CreateInvitationCodeRequest = {
	revokeExisting?: boolean;
	expiresAt?: string;
	maxUses?: number;
	label?: string;
	reason?: string;
};

export type InvitationCodeResolution = {
	code: string;
	codeStatus: InvitationCodeStatus;
	joinable: boolean;
	joinNotAllowedReason?: InvitationCodeJoinNotAllowedReason;
	alreadyMember?: boolean;
	tournament: TournamentPreview;
};

export type JoinByInvitationCodeRequest = {
	acceptTournamentRules?: boolean;
	clientContext?: Record<string, unknown>;
};

export type JoinByInvitationCodeResult = {
	tournamentId: TournamentId;
	joined: boolean;
	membership: MyMembershipSummary;
	tournament: TournamentSummary;
};

export type ListTournamentInvitationCodesParams = {
	tournamentId: TournamentId;
};

export type ListTournamentInvitationCodesQuery = {
	status?: InvitationCodeStatus;
	cursor?: string;
	pageSize?: number;
};

export type CreateTournamentInvitationCodeParams = {
	tournamentId: TournamentId;
};

export type ResolveInvitationCodeParams = {
	code: string;
};

export type JoinTournamentByInvitationCodeParams = {
	code: string;
};
