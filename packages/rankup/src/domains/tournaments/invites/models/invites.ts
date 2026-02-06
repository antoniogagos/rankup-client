import type { CreateTournamentInviteFailureReason, MyTournamentInviteInclude, MyTournamentInviteSort, TournamentInviteKind, TournamentInviteStatus } from '../../shared/models/enums.js';
import type { TournamentId, TournamentInviteId, UserId } from '../../shared/models/ids.js';
import type { JoinByInvitationCodeResult } from '../../codes/models/invitationCodes.js';
import type { HeadsUpFormatConfig } from '../../core/models/tournament.js';
import type { TournamentPreview } from '../../core/models/preview.js';
import type { UserSummary } from '../../shared/models/user.js';

export type HeadsUpInvitePayload = {
	challengerUserId: UserId;
	opponentUserId: UserId;
	formatConfigSummary?: HeadsUpFormatConfig;
};

export type TournamentInvite = {
	inviteId: TournamentInviteId;
	tournamentId: TournamentId;
	kind: TournamentInviteKind;
	status: TournamentInviteStatus;
	invitedUser: UserSummary;
	invitedBy: UserSummary;
	message?: string;
	headsUpPayload?: HeadsUpInvitePayload;
	createdAt: string;
	expiresAt?: string;
	respondedAt?: string;
};

export type TournamentInvitePage = {
	items: TournamentInvite[];
	nextCursor?: string;
};

export type CreateTournamentInvitesParams = {
	tournamentId: TournamentId;
};

export type CreateTournamentInvitesRequest = {
	recipientUserIds: UserId[];
	message?: string;
	expiresAt?: string;
	sendNotification?: boolean;
	clientContext?: Record<string, unknown>;
};

export type CreateTournamentInviteFailure = {
	recipientUserId: UserId;
	reason: CreateTournamentInviteFailureReason;
};

export type CreateTournamentInvitesResult = {
	created: TournamentInvite[];
	failures: CreateTournamentInviteFailure[];
};

export type ListTournamentInvitesParams = {
	tournamentId: TournamentId;
};

export type ListTournamentInvitesQuery = {
	status?: TournamentInviteStatus;
	invitedUserId?: UserId;
	cursor?: string;
	pageSize?: number;
};

export type CancelTournamentInviteParams = {
	tournamentId: TournamentId;
	inviteId: TournamentInviteId;
};

export type MyTournamentInvite = {
	inviteId: TournamentInviteId;
	tournamentId: TournamentId;
	kind: TournamentInviteKind;
	status: TournamentInviteStatus;
	invitedUser: UserSummary;
	invitedBy: UserSummary;
	message?: string;
	headsUpPayload?: HeadsUpInvitePayload;
	createdAt: string;
	expiresAt?: string;
	respondedAt?: string;
	seenAt?: string;
	hiddenAt?: string;
	tournamentPreview?: TournamentPreview;
};

export type MyTournamentInvitePage = {
	items: MyTournamentInvite[];
	nextCursor?: string;
};

export type ListMyTournamentInvitesQuery = {
	status?: TournamentInviteStatus;
	includeHidden?: boolean;
	include?: MyTournamentInviteInclude[];
	sort?: MyTournamentInviteSort;
	cursor?: string;
	pageSize?: number;
};

export type GetMyTournamentInviteParams = {
	inviteId: TournamentInviteId;
};

export type GetMyTournamentInviteQuery = {
	include?: MyTournamentInviteInclude[];
};

export type HideMyTournamentInviteParams = {
	inviteId: TournamentInviteId;
};

export type MarkMyTournamentInviteSeenParams = {
	inviteId: TournamentInviteId;
};

export type AcceptTournamentInviteRequest = {
	acceptTournamentRules?: boolean;
	clientContext?: Record<string, unknown>;
};

export type AcceptTournamentInviteResult = {
	invite: MyTournamentInvite;
	join: JoinByInvitationCodeResult;
};

export type DeclineTournamentInviteRequest = {
	reason?: string;
	clientContext?: Record<string, unknown>;
};

export type AcceptMyTournamentInviteParams = {
	inviteId: TournamentInviteId;
};

export type DeclineMyTournamentInviteParams = {
	inviteId: TournamentInviteId;
};

export type UnreadCount = {
	count: number;
};
