import type { JoinByInvitationCodeResult } from '../../codes/models/invitationCodes.js';
import type { TournamentMemberRole, TournamentMemberStatus, TournamentMemberView } from '../../shared/models/enums.js';
import type { TournamentId, UserId } from '../../shared/models/ids.js';
import type { UserSummary } from '../../shared/models/user.js';

export type TournamentMember = {
	user: UserSummary;
	role: TournamentMemberRole;
	status: TournamentMemberStatus;
	joinedAt: string;
	leftAt?: string;
	removedAt?: string;
};

export type TournamentMemberPage = {
	items: TournamentMember[];
	nextCursor?: string;
};

export type ListTournamentMembersParams = {
	tournamentId: TournamentId;
};

export type ListTournamentMembersQuery = {
	role?: TournamentMemberRole;
	status?: TournamentMemberStatus;
	q?: string;
	view?: TournamentMemberView;
	cursor?: string;
	pageSize?: number;
};

export type JoinTournamentParams = {
	tournamentId: TournamentId;
	idempotencyKey?: string;
};

export type JoinTournamentRequest = {
	invitationCode?: string;
	acceptTournamentRules?: boolean;
	clientContext?: Record<string, unknown>;
};

export type JoinTournamentResult = JoinByInvitationCodeResult;

export type LeaveTournamentParams = {
	tournamentId: TournamentId;
};

export type UpdateTournamentMemberParams = {
	tournamentId: TournamentId;
	userId: UserId;
};

export type UpdateTournamentMemberRequest = {
	role?: TournamentMemberRole;
	note?: string;
};

export type RemoveTournamentMemberParams = {
	tournamentId: TournamentId;
	userId: UserId;
};

export type RemoveTournamentMemberRequest = {
	reason?: string;
};
