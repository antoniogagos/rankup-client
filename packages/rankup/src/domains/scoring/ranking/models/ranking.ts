import type { RankingInclude, RankingScope, RankingState, RankingTieBreaker, RankingView } from '../../../tournaments/shared/models/enums.js';
import type { RulesetId, TournamentId, UserId } from '../../../tournaments/shared/models/ids.js';
import type { UserSummary } from '../../../tournaments/shared/models/user.js';

export type RankingEntry = {
	position: number;
	user: UserSummary;
	points: number;
	pointsState?: RankingState;
	metrics?: Record<string, number>;
	lastUpdatedAt?: string;
};

export type HeadsUpScoreboardEntry = {
	position: number;
	user: UserSummary;
	points: number;
	pointsState?: RankingState;
	metrics?: Record<string, number>;
	lastUpdatedAt?: string;
};

export type HeadsUpRoundSummary = {
	matchday?: number;
	state?: RankingState;
	pointsA?: number;
	pointsB?: number;
	winnerUserId?: UserId;
};

export type HeadsUpOverallSummary = {
	winnerUserId?: UserId;
	roundWinsA?: number;
	roundWinsB?: number;
	totalPointsA?: number;
	totalPointsB?: number;
	outcome?: 'win' | 'loss' | 'draw';
};

export type HeadsUpScoreboard = {
	players: HeadsUpScoreboardEntry[];
	rounds?: HeadsUpRoundSummary[];
	overall?: HeadsUpOverallSummary;
};

export type TournamentRankingMeta = {
	tournamentId: TournamentId;
	scope: RankingScope;
	state: RankingState;
	serverTime: string;
	computedAt: string;
	totalPlayers: number;
	matchday?: number;
	rulesetId?: RulesetId;
	tieBreakers?: RankingTieBreaker[];
};

export type TournamentRankingPage = {
	meta: TournamentRankingMeta;
	items: RankingEntry[];
	headsup?: HeadsUpScoreboard;
	myEntry?: RankingEntry;
	nextCursor?: string;
};

export type TournamentRankingWindow = {
	meta: TournamentRankingMeta;
	headsup?: HeadsUpScoreboard;
	center: RankingEntry;
	items: RankingEntry[];
};

export type GetTournamentRankingParams = {
	tournamentId: TournamentId;
};

export type GetTournamentRankingQuery = {
	view?: RankingView;
	include?: RankingInclude[];
	cursor?: string;
	pageSize?: number;
};

export type GetTournamentMatchdayRankingParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetTournamentMatchdayRankingQuery = GetTournamentRankingQuery;

export type GetTournamentRankingWindowParams = {
	tournamentId: TournamentId;
};

export type GetTournamentRankingWindowQuery = {
	window?: number;
	view?: RankingView;
};

export type GetTournamentMatchdayRankingWindowParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetTournamentMatchdayRankingWindowQuery = GetTournamentRankingWindowQuery;
