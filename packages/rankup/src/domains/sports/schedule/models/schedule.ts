import type { CompetitionId, MatchId, SeasonId, SportId, TeamId } from '../../shared/models/ids.js';
import type { MatchEventType, MatchFinalOutcomeType, MatchInclude, MatchStatus, MatchdayStatus } from '../../shared/models/enums.js';

export type Matchday = {
	matchday: number;
	status: MatchdayStatus;
	startsAt?: string;
	endsAt?: string;
	matchCount?: number;
};

export type MatchdayList = {
	items: Matchday[];
};

export type TeamRef = {
	teamId: TeamId;
	name: string;
	shortName?: string;
	crestUrl?: string;
};

export type MatchScore = {
	home?: number;
	away?: number;
	isFinal?: boolean;
};

export type PenaltyShootout = {
	home: number;
	away: number;
	winner: 'home' | 'away';
};

export type MatchEventCounters = {
	goals?: number;
	redCards?: number;
	yellowCards?: number;
	lastEventAt?: string;
};

export type Match = {
	matchId: MatchId;
	sportId: SportId;
	competitionId?: CompetitionId;
	seasonId?: SeasonId;
	matchday?: number;
	status: MatchStatus;
	scheduledAt: string;
	startedAt?: string;
	endedAt?: string;
	homeTeam?: TeamRef;
	awayTeam?: TeamRef;
	score?: MatchScore;
	finalOutcomeType?: MatchFinalOutcomeType;
	penaltyShootout?: PenaltyShootout;
	isDerby?: boolean;
	weather?: Record<string, unknown>;
	odds?: Record<string, unknown>;
	eventCounters?: MatchEventCounters;
	lastUpdatedAt?: string;
};

export type MatchPage = {
	items: Match[];
	nextCursor?: string;
};

export type MatchEvent = {
	eventId: string;
	matchId: MatchId;
	type: MatchEventType;
	occurredAt: string;
	minute?: number;
	teamId?: TeamId;
	playerName?: string;
	payload?: Record<string, unknown>;
};

export type MatchEventPage = {
	items: MatchEvent[];
	nextCursor?: string;
};

export type ListMatchdaysParams = {
	competitionId: CompetitionId;
	seasonId: SeasonId;
};

export type ListMatchdaysQuery = {
	status?: MatchdayStatus;
};

export type ListMatchdayMatchesParams = {
	competitionId: CompetitionId;
	seasonId: SeasonId;
	matchday: number;
};

export type ListMatchdayMatchesQuery = {
	status?: MatchStatus;
	include?: MatchInclude[];
};

export type SearchMatchesQuery = {
	sportId?: SportId;
	competitionId?: CompetitionId;
	seasonId?: SeasonId;
	matchday?: number;
	teamId?: TeamId;
	status?: MatchStatus;
	from?: string;
	to?: string;
	cursor?: string;
	pageSize?: number;
};

export type GetMatchParams = {
	matchId: MatchId;
};

export type ListMatchEventsParams = {
	matchId: MatchId;
};

export type ListMatchEventsQuery = {
	since?: string;
	order?: 'asc' | 'desc';
	cursor?: string;
	pageSize?: number;
};
