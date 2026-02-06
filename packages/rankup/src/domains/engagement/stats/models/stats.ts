import type { GameModeId, MatchId, SportId, TournamentId } from '../../shared/models/ids.js';
import type { RecapCard } from '../../shared/models/recap.js';
import type { UserSummary } from '../../shared/models/user.js';

export type StatsTimeframe = 'allTime' | 'last7d' | 'last30d' | 'seasonToDate';

export type MyStatsInclude = 'highlights' | 'distributions' | 'topTournaments';

export type TournamentStatsInclude = 'distributions' | 'topByTeam' | 'topByMetric';

export type UserTournamentStatsInclude = 'comparisons' | 'bestWorstMatches';

export type MatchdayStatsInclude = 'distributions' | 'topByMetric';

export type UserMatchdayStatsInclude = 'breakdown' | 'comparisons';

export type StatsWindow = {
	from?: string;
	to?: string;
	timeframe?: StatsTimeframe;
};

export type ScorePredictionAggregateCounters = {
	matchesInScope: number;
	predictionsSubmitted: number;
	exactScores: number;
	correctOutcomes: number;
	exactGoalsOneTeam?: number;
	penalties?: number;
	bonuses?: number;
};

export type ScorePredictionAggregateRates = {
	predictionCompletionRate?: number;
	exactScoreRate?: number;
	correctOutcomeRate?: number;
};

export type IntegerHistogramBucket = {
	from: number;
	to: number;
	count: number;
};

export type IntegerHistogram = {
	buckets: IntegerHistogramBucket[];
};

export type TeamRef = {
	teamId: string;
	name: string;
	shortName?: string;
	crestUrl?: string;
};

export type TeamStatLine = {
	team: TeamRef;
	value: number;
	valueLabel?: string;
};

export type UserMetricLine = {
	user: UserSummary;
	value: number;
	valueLabel?: string;
};

export type RankingState = 'provisional' | 'final';

export type StatsSnapshotBase = {
	gameModeId: GameModeId;
	sportId: SportId;
	serverTime: string;
	computedAt: string;
	window?: StatsWindow;
	state?: RankingState;
	verifiedOnly?: boolean;
};

export type SubmissionVisibility = 'visible' | 'redacted';

export type ResultState = 'pending' | 'provisional' | 'final' | 'void';

export type ScorePredictionResultBreakdown = {
	correctOutcome?: number;
	exactScore?: number;
	exactGoalsOneTeam?: number;
	penalties?: number;
	bonuses?: number;
};

export type ScorePredictionMatchResultLine = {
	matchId: MatchId;
	match?: Record<string, unknown>;
	prediction?: {
		homeScore?: number | null;
		awayScore?: number | null;
		visibility?: SubmissionVisibility;
	};
	actualScore?: {
		home?: number | null;
		away?: number | null;
	};
	points?: number | null;
	state: ResultState;
	breakdown?: ScorePredictionResultBreakdown;
};

export type MyStatsSnapshot = ScorePredictionMyStatsSnapshot | GenericMyStatsSnapshot;

export type PublicUserStatsSnapshot = ScorePredictionPublicUserStatsSnapshot | GenericPublicUserStatsSnapshot;

export type TournamentStatsSnapshot = ScorePredictionTournamentStatsSnapshot | GenericTournamentStatsSnapshot;

export type UserTournamentStatsSnapshot = ScorePredictionUserTournamentStatsSnapshot | GenericUserTournamentStatsSnapshot;

export type MatchdayStatsSnapshot = ScorePredictionMatchdayStatsSnapshot | GenericMatchdayStatsSnapshot;

export type UserMatchdayStatsSnapshot = ScorePredictionUserMatchdayStatsSnapshot | GenericUserMatchdayStatsSnapshot;

export type ScorePredictionMyStatsSnapshot = StatsSnapshotBase & {
	gameModeId: 'scorePrediction';
	user: UserSummary;
	totals: ScorePredictionAggregateCounters;
	rates: ScorePredictionAggregateRates;
	highlights?: RecapCard[];
	distributions?: {
		pointsPerMatchHistogram?: IntegerHistogram;
		pointsPerMatchdayHistogram?: IntegerHistogram;
	};
	topTournaments?: {
		tournamentId: TournamentId;
		tournamentName: string;
		points: number;
	}[];
};

export type ScorePredictionPublicUserStatsSnapshot = StatsSnapshotBase & {
	gameModeId: 'scorePrediction';
	user: UserSummary;
	totals: ScorePredictionAggregateCounters;
	rates: ScorePredictionAggregateRates;
	highlights?: RecapCard[];
};

export type ScorePredictionTournamentStatsSnapshot = StatsSnapshotBase & {
	gameModeId: 'scorePrediction';
	tournamentId: TournamentId;
	totals: ScorePredictionAggregateCounters;
	topByMetric?: {
		byExactScores?: UserMetricLine[];
		byCorrectOutcomes?: UserMetricLine[];
		byPoints?: UserMetricLine[];
	};
	topByTeam?: {
		team: TeamRef;
		leader: UserSummary;
		value: number;
		valueLabel?: string;
	}[];
	distributions?: {
		totalPointsHistogram?: IntegerHistogram;
		exactScoresHistogram?: IntegerHistogram;
	};
};

export type ScorePredictionUserTournamentStatsSnapshot = StatsSnapshotBase & {
	gameModeId: 'scorePrediction';
	tournamentId: TournamentId;
	user: UserSummary;
	totals: ScorePredictionAggregateCounters;
	rates: ScorePredictionAggregateRates;
	comparisons?: {
		percentilePoints?: number;
		percentileExactScores?: number;
	};
	bestWorstMatches?: {
		best?: ScorePredictionMatchResultLine[];
		worst?: ScorePredictionMatchResultLine[];
	};
};

export type ScorePredictionMatchdayStatsSnapshot = StatsSnapshotBase & {
	gameModeId: 'scorePrediction';
	tournamentId: TournamentId;
	matchday: number;
	totals: ScorePredictionAggregateCounters;
	topByMetric?: {
		byPoints?: UserMetricLine[];
		byExactScores?: UserMetricLine[];
	};
	distributions?: {
		pointsHistogram?: IntegerHistogram;
	};
};

export type ScorePredictionUserMatchdayStatsSnapshot = StatsSnapshotBase & {
	gameModeId: 'scorePrediction';
	tournamentId: TournamentId;
	matchday: number;
	user: UserSummary;
	totals: ScorePredictionAggregateCounters;
	rates: ScorePredictionAggregateRates;
	breakdown?: ScorePredictionMatchResultLine[];
	comparisons?: {
		rankPosition?: number;
		percentilePoints?: number;
	};
};

export type GenericMyStatsSnapshot = StatsSnapshotBase & {
	user?: UserSummary;
	[key: string]: unknown;
};

export type GenericPublicUserStatsSnapshot = StatsSnapshotBase & {
	user?: UserSummary;
	[key: string]: unknown;
};

export type GenericTournamentStatsSnapshot = StatsSnapshotBase & {
	tournamentId?: TournamentId;
	[key: string]: unknown;
};

export type GenericUserTournamentStatsSnapshot = StatsSnapshotBase & {
	tournamentId?: TournamentId;
	user?: UserSummary;
	[key: string]: unknown;
};

export type GenericMatchdayStatsSnapshot = StatsSnapshotBase & {
	tournamentId?: TournamentId;
	matchday?: number;
	[key: string]: unknown;
};

export type GenericUserMatchdayStatsSnapshot = StatsSnapshotBase & {
	tournamentId?: TournamentId;
	matchday?: number;
	user?: UserSummary;
	[key: string]: unknown;
};

export type GetMyStatsQuery = {
	gameModeId?: GameModeId;
	sportId?: SportId;
	verifiedOnly?: boolean;
	timeframe?: StatsTimeframe;
	from?: string;
	to?: string;
	include?: MyStatsInclude[];
};

export type GetUserStatsParams = {
	userId: string;
};

export type GetUserStatsQuery = {
	gameModeId?: GameModeId;
	sportId?: SportId;
	verifiedOnly?: boolean;
	timeframe?: StatsTimeframe;
};

export type GetTournamentStatsParams = {
	tournamentId: TournamentId;
};

export type GetTournamentStatsQuery = {
	verifiedOnly?: boolean;
	include?: TournamentStatsInclude[];
};

export type GetMyTournamentStatsParams = {
	tournamentId: TournamentId;
};

export type GetMyTournamentStatsQuery = {
	include?: UserTournamentStatsInclude[];
};

export type GetTournamentMatchdayStatsParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetTournamentMatchdayStatsQuery = {
	include?: MatchdayStatsInclude[];
};

export type GetMyTournamentMatchdayStatsParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetMyTournamentMatchdayStatsQuery = {
	include?: UserMatchdayStatsInclude[];
};
