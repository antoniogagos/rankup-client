import type { RankingState } from '../../../tournaments/shared/models/enums.js';
import type { MatchId, TournamentId } from '../../../tournaments/shared/models/ids.js';
import type { MeSummary } from '../../../tournaments/shared/models/user.js';

export type ResultInclude = 'breakdown';

export type ResultState = 'pending' | 'provisional' | 'final' | 'void';

export type SubmissionVisibility = 'visible' | 'redacted';

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

export type ScorePredictionMatchdayResults = {
	tournamentId: TournamentId;
	matchday: number;
	gameModeId: 'scorePrediction';
	user: MeSummary;
	serverTime: string;
	state: RankingState;
	totalPoints: number;
	pointsState?: RankingState;
	lines: ScorePredictionMatchResultLine[];
};

export type GenericMatchdayResults = {
	tournamentId: TournamentId;
	matchday: number;
	gameModeId: string;
	user: MeSummary;
	serverTime: string;
	[key: string]: unknown;
};

export type MatchdayResults = ScorePredictionMatchdayResults | GenericMatchdayResults;

export type GetMyMatchdayResultsParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type GetMyMatchdayResultsQuery = {
	include?: ResultInclude[];
};
