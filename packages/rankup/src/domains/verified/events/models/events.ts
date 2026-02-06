import type { TournamentPreview } from '../../../tournaments/core/models/preview.js';
import type { GameModeId, SportId, TournamentId } from '../../../tournaments/shared/models/ids.js';
import type { VerifiedEventId } from '../../shared/models/ids.js';
import type { VerifiedEventInclude, VerifiedEventSort, VerifiedEventStatus, VerifiedTournamentInclude, VerifiedTournamentSort, VerifiedTournamentStatus } from '../../shared/models/enums.js';
import type { VerifiedBranding, VerifiedEligibility, VerifiedEventSchedule, VerifiedJoinInfo } from '../../shared/models/verified.js';

export type VerifiedEvent = {
	eventId: VerifiedEventId;
	status: VerifiedEventStatus;
	branding: VerifiedBranding;
	eligibility?: VerifiedEligibility;
	schedule?: VerifiedEventSchedule;
	sportId?: SportId;
	gameModeId?: GameModeId;
	description?: string;
	tournaments?: VerifiedTournamentPreview[];
	tags?: string[];
};

export type VerifiedEventSummary = {
	eventId: VerifiedEventId;
	status: VerifiedEventStatus;
	branding: VerifiedBranding;
	schedule?: VerifiedEventSchedule;
	sportId?: SportId;
	gameModeId?: GameModeId;
};

export type VerifiedEventPage = {
	items: VerifiedEventSummary[];
	nextCursor?: string;
};

export type VerifiedTournamentPreview = TournamentPreview & {
	verified: true;
	verifiedEventId?: VerifiedEventId;
	branding?: VerifiedBranding;
	eligibility?: VerifiedEligibility;
	joinInfo?: VerifiedJoinInfo;
};

export type VerifiedTournamentSummary = {
	tournament: VerifiedTournamentPreview;
	status: VerifiedTournamentStatus;
};

export type VerifiedTournamentPage = {
	items: VerifiedTournamentSummary[];
	nextCursor?: string;
};

export type ListVerifiedEventsQuery = {
	status?: VerifiedEventStatus;
	sportId?: SportId;
	gameModeId?: GameModeId;
	region?: string;
	include?: VerifiedEventInclude[];
	sort?: VerifiedEventSort;
	cursor?: string;
	pageSize?: number;
};

export type GetVerifiedEventParams = {
	eventId: VerifiedEventId;
};

export type GetVerifiedEventQuery = {
	include?: VerifiedEventInclude[];
};

export type ListVerifiedEventTournamentsParams = {
	eventId: VerifiedEventId;
};

export type ListVerifiedEventTournamentsQuery = {
	status?: VerifiedTournamentStatus;
	include?: VerifiedTournamentInclude[];
	sort?: VerifiedTournamentSort;
	cursor?: string;
	pageSize?: number;
};

export type ListVerifiedTournamentsQuery = {
	status?: VerifiedTournamentStatus;
	sportId?: SportId;
	gameModeId?: GameModeId;
	eventId?: VerifiedEventId;
	include?: VerifiedTournamentInclude[];
	sort?: VerifiedTournamentSort;
	cursor?: string;
	pageSize?: number;
};

export type GetVerifiedTournamentParams = {
	tournamentId: TournamentId;
};
