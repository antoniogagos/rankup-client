import type { MatchdayAvailabilityReason, MatchdayAvailabilityState, MatchdayStatus, MatchInclude, MatchLockState, MatchStatus, TournamentMatchdayInclude } from '../../shared/models/enums.js';
import type { CompetitionId, MatchId, SeasonId, SportId, TeamId, TournamentId } from '../../shared/models/ids.js';

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

export type MatchFinalOutcomeType = 'regular' | 'extra_time' | 'penalty_shootout';

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

export type TournamentMatch = Match & {
	lockState: MatchLockState;
	lockAt?: string;
	lockReason?: string;
};

export type TournamentMatchPage = {
	serverTime: string;
	items: TournamentMatch[];
	nextCursor?: string;
};

export type MatchdayAvailability = {
	tournamentId: TournamentId;
	matchday: number;
	serverTime: string;
	state: MatchdayAvailabilityState;
	canSubmit: boolean;
	reason?: MatchdayAvailabilityReason;
	opensAt?: string;
	locksAt?: string;
	closesAt?: string;
	message?: string;
};

export type TournamentMatchdaySummary = {
	matchday: number;
	label?: string;
	status: MatchdayStatus;
	startsAt: string;
	endsAt: string;
	matchCount: number;
	isCurrent?: boolean;
	availabilitySummary?: MatchdayAvailability;
};

export type TournamentMatchday = TournamentMatchdaySummary & {
	tournamentId: TournamentId;
	serverTime: string;
	previousMatchday?: number;
	nextMatchday?: number;
};

export type TournamentMatchdayPage = {
	serverTime: string;
	items: TournamentMatchdaySummary[];
	nextCursor?: string;
};

export type ListTournamentMatchdaysParams = {
	tournamentId: TournamentId;
};

export type ListTournamentMatchdaysQuery = {
	status?: MatchdayStatus;
	fromMatchday?: number;
	toMatchday?: number;
	include?: TournamentMatchdayInclude[];
	cursor?: string;
	pageSize?: number;
};

export type GetTournamentMatchdayParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetTournamentMatchdayAvailabilityParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetMatchdayMatchesParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetMatchdayMatchesQuery = {
	status?: MatchStatus;
	include?: MatchInclude[];
};
