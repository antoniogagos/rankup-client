import { mapProblemToDomainError } from '../problem/mapProblemToDomainError.js';
import { mapUserSummary } from '../tournaments/tournament-mappers.js';
import type * as Api from '@rankup/api';
import type { DomainError } from '@rankup/rankup/domains/shared/errors/domainError.js';
import type * as Domain from '@rankup/rankup/domains/scoring/results/contracts/types.js';

type ApiMatchdayResults = Api.paths['/tournaments/{tournamentId}/matchdays/{matchday}/results/me']['get']['responses']['200']['content']['application/json'];

type ApiScorePredictionMatchdayResults = {
	tournamentId: string;
	matchday: number;
	gameModeId: 'scorePrediction';
	user: Api.MeSummary;
	serverTime: string;
	state: 'provisional' | 'final';
	totalPoints: number;
	pointsState?: 'provisional' | 'final';
	lines: Api.ScorePredictionMatchResultLine[];
};

const mapScorePredictionResultBreakdown = (breakdown: Api.ScorePredictionResultBreakdown): Domain.ScorePredictionResultBreakdown => ({
	correctOutcome: breakdown.correctOutcome,
	exactScore: breakdown.exactScore,
	exactGoalsOneTeam: breakdown.exactGoalsOneTeam,
	penalties: breakdown.penalties,
	bonuses: breakdown.bonuses,
});

export const mapScorePredictionMatchResultLine = (line: Api.ScorePredictionMatchResultLine): Domain.ScorePredictionMatchResultLine => ({
	matchId: line.matchId,
	match: line.match,
	prediction: line.prediction
		? {
			homeScore: line.prediction.homeScore,
			awayScore: line.prediction.awayScore,
			visibility: line.prediction.visibility,
		}
		: undefined,
	actualScore: line.actualScore
		? {
			home: line.actualScore.home,
			away: line.actualScore.away,
		}
		: undefined,
	points: line.points,
	state: line.state,
	breakdown: line.breakdown ? mapScorePredictionResultBreakdown(line.breakdown) : undefined,
});

const isScorePredictionMatchdayResults = (results: ApiMatchdayResults): results is ApiScorePredictionMatchdayResults =>
	results.gameModeId === 'scorePrediction' && Array.isArray((results as { lines?: unknown }).lines);

const mapScorePredictionMatchdayResults = (
	results: ApiScorePredictionMatchdayResults,
): Domain.ScorePredictionMatchdayResults => ({
	tournamentId: results.tournamentId,
	matchday: results.matchday,
	gameModeId: 'scorePrediction',
	user: mapUserSummary(results.user),
	serverTime: results.serverTime,
	state: results.state,
	totalPoints: results.totalPoints,
	pointsState: results.pointsState,
	lines: results.lines.map(mapScorePredictionMatchResultLine),
});

const mapGenericMatchdayResults = (results: ApiMatchdayResults): Domain.GenericMatchdayResults => {
	const record = results as Record<string, unknown>;
	return {
		...record,
		tournamentId: record.tournamentId as string,
		matchday: record.matchday as number,
		gameModeId: record.gameModeId as string,
		user: mapUserSummary(record.user as Api.MeSummary),
		serverTime: record.serverTime as string,
	};
};

export const mapMatchdayResults = (results: ApiMatchdayResults): Domain.MatchdayResults => {
	if (isScorePredictionMatchdayResults(results)) {
		return mapScorePredictionMatchdayResults(results);
	}
	return mapGenericMatchdayResults(results);
};

export const mapLegacyUserMatchdayStatsToResults = (
	snapshot: Api.GetMyTournamentMatchdayStatsResponse,
): Domain.MatchdayResults => {
	if (snapshot.gameModeId === 'scorePrediction') {
		const scorePredictionSnapshot = snapshot as Api.ScorePredictionUserMatchdayStatsSnapshot;
		const lines = (scorePredictionSnapshot.breakdown ?? []).map(mapScorePredictionMatchResultLine);
		return {
			tournamentId: scorePredictionSnapshot.tournamentId,
			matchday: scorePredictionSnapshot.matchday,
			gameModeId: 'scorePrediction',
			user: mapUserSummary(scorePredictionSnapshot.user),
			serverTime: scorePredictionSnapshot.serverTime,
			state: scorePredictionSnapshot.state ?? 'provisional',
			totalPoints: lines.reduce((total, line) => total + (line.points ?? 0), 0),
			pointsState: scorePredictionSnapshot.state,
			lines,
		};
	}

	const genericSnapshot = snapshot as Api.GenericUserMatchdayStatsSnapshot;
	return {
		...genericSnapshot,
		tournamentId: genericSnapshot.tournamentId ?? 'unknown',
		matchday: genericSnapshot.matchday ?? 1,
		gameModeId: genericSnapshot.gameModeId,
		user: genericSnapshot.user ? mapUserSummary(genericSnapshot.user) : { userId: 'unknown', username: 'unknown' },
		serverTime: genericSnapshot.serverTime,
	};
};

export const mapScoringProblemToDomainError = (problem: unknown): DomainError => mapProblemToDomainError(problem);

export const mapScoringResultsProblemToDomainError = mapScoringProblemToDomainError;
