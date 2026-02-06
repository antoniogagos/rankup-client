import type { ChatMessageId } from '../../../engagement/shared/models/ids.js';
import type { TournamentId, UserId } from '../../../tournaments/shared/models/ids.js';
import type { MeSummary } from '../../../tournaments/shared/models/user.js';
import type { CreatorId } from '../../../creators/shared/models/ids.js';
import type { ReportId } from '../../shared/models/ids.js';

export type ReportType = 'chatMessage' | 'userProfile' | 'tournament' | 'creator' | 'other';
export type ReportReason = 'spam' | 'harassment' | 'hate' | 'violence' | 'sexualContent' | 'childSafety' | 'selfHarm' | 'impersonation' | 'other';
export type ReportStatus = 'submitted' | 'received' | 'underReview' | 'resolved';

export type ReportTarget = {
	type: ReportType;
	tournamentId?: TournamentId;
	messageId?: ChatMessageId;
	userId?: UserId;
	creatorId?: CreatorId;
	url?: string;
};

export type CreateReportRequest = {
	target: ReportTarget;
	reason: ReportReason;
	comment?: string;
	context?: Record<string, unknown>;
};

export type Report = {
	reportId: ReportId;
	target: ReportTarget;
	reason: ReportReason;
	comment?: string;
	status: ReportStatus;
	createdAt: string;
	updatedAt?: string;
};

export type ReportPage = {
	items: Report[];
	nextCursor?: string;
};

export type TrustBlockEntry = {
	user: MeSummary;
	blockedAt: string;
	reason?: string;
};

export type TrustBlockPage = {
	items: TrustBlockEntry[];
	nextCursor?: string;
};

export type ListMyReportsQuery = {
	status?: ReportStatus;
	type?: ReportType;
	cursor?: string;
	pageSize?: number;
};

export type GetMyReportParams = {
	reportId: ReportId;
};

export type ListMyTrustBlocksQuery = {
	cursor?: string;
	pageSize?: number;
};
