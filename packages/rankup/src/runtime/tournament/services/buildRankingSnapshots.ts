import { evaluateScorePrediction } from '../../../algorithms/scoring/index.js';
import { type RankingCandidate,compareRankingCandidates } from '../../../algorithms/tieBreakers/index.js';
import { resolveRulesetDefinition } from '../../../registry/index.js';
import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import type { EngineRankingSnapshot, EngineTournament } from '../../types.js';

function isRankingStateFinal(matchStates: Array<'pending' | 'provisional' | 'final' | 'void'>): 'provisional' | 'final' {
	return matchStates.every(state => state === 'final' || state === 'void') ? 'final' : 'provisional';
}

function toCandidateSeed(tournamentId: string, userId: string, rulesetId: string): string {
	return `${tournamentId}:${userId}:${rulesetId}`;
}

export async function buildMatchdaySnapshot(
	context: EngineRuntimeContext,
	tournament: EngineTournament,
	matchday: number,
	reason: string,
): Promise<EngineRankingSnapshot> {
	const ruleset = resolveRulesetDefinition(tournament.gameModeId, tournament.rulesetId);
	const matches = await context.sportsSchedulePort.listMatchdayMatches(tournament.tournamentId, matchday);
	const submissions = await context.submissionRepo.listByTournamentMatchday(tournament.tournamentId, matchday);
	const candidates: RankingCandidate[] = submissions.map(submission => {
		let points = 0;
		const metrics = {
			exactScores: 0,
			correctOutcomes: 0,
			exactGoalsOneTeam: 0,
			earliestSubmission: submission.submissionCompleteAt,
			randomSeed: toCandidateSeed(tournament.tournamentId, submission.userId, tournament.rulesetId),
		};
		for (const match of matches) {
			const prediction = submission.predictions[match.matchId]
				? {
					homeScore: submission.predictions[match.matchId].homeScore,
					awayScore: submission.predictions[match.matchId].awayScore,
				}
				: null;
			const evaluation = evaluateScorePrediction(ruleset, prediction, {
				home: match.score.home,
				away: match.score.away,
				status: match.status,
				finalOutcomeType: match.finalOutcomeType,
			});
			points += evaluation.points ?? 0;
			metrics.exactScores += evaluation.metrics.exactScores;
			metrics.correctOutcomes += evaluation.metrics.correctOutcomes;
			metrics.exactGoalsOneTeam += evaluation.metrics.exactGoalsOneTeam;
		}
		return {
			userId: submission.userId,
			points,
			metrics,
		};
	});

	candidates.sort((left, right) => compareRankingCandidates(left, right, ruleset.tieBreakers));
	const computedAt = context.clockPort.nowIso();
	const latestSnapshot = await context.scoringRepo.getLatestSnapshot(tournament.tournamentId, 'matchday', matchday);
	return {
		snapshotId: context.idGeneratorPort.nextId('rank_matchday'),
		parentSnapshotId: latestSnapshot?.snapshotId ?? null,
		tournamentId: tournament.tournamentId,
		scope: 'matchday',
		matchday,
		state: isRankingStateFinal(matches.map(match => match.status)),
		computedAt,
		reason,
		rulesetId: tournament.rulesetId,
		entries: candidates.map((candidate, index) => ({
			position: index + 1,
			userId: candidate.userId,
			points: candidate.points,
			metrics: {
				exactScores: candidate.metrics.exactScores,
				correctOutcomes: candidate.metrics.correctOutcomes,
				exactGoalsOneTeam: candidate.metrics.exactGoalsOneTeam,
				earliestSubmission: candidate.metrics.earliestSubmission,
				randomSeed: candidate.metrics.randomSeed,
			},
		})),
	};
}

export async function buildSeasonSnapshot(
	context: EngineRuntimeContext,
	tournament: EngineTournament,
	reason: string,
): Promise<EngineRankingSnapshot> {
	const ruleset = resolveRulesetDefinition(tournament.gameModeId, tournament.rulesetId);
	const matchdays = await context.sportsSchedulePort.listTournamentMatchdays(tournament.tournamentId);
	const seasonMatchStates: Array<'pending' | 'provisional' | 'final' | 'void'> = [];
	const aggregated = new Map<
		string,
		{
			points: number;
			metrics: {
				exactScores: number;
				correctOutcomes: number;
				exactGoalsOneTeam: number;
				earliestSubmission: string | null;
				randomSeed: string;
			};
		}
	>();

	for (const matchday of matchdays) {
		const matchdayMatches = await context.sportsSchedulePort.listMatchdayMatches(tournament.tournamentId, matchday);
		for (const match of matchdayMatches) {
			seasonMatchStates.push(match.status);
		}
		const snapshot = await context.scoringRepo.getLatestSnapshot(tournament.tournamentId, 'matchday', matchday);
		if (!snapshot) {
			continue;
		}
		for (const entry of snapshot.entries) {
			const existing = aggregated.get(entry.userId);
			if (!existing) {
				aggregated.set(entry.userId, {
					points: entry.points,
					metrics: {
						exactScores: entry.metrics.exactScores,
						correctOutcomes: entry.metrics.correctOutcomes,
						exactGoalsOneTeam: entry.metrics.exactGoalsOneTeam,
						earliestSubmission: entry.metrics.earliestSubmission,
						randomSeed: entry.metrics.randomSeed,
					},
				});
				continue;
			}
			existing.points += entry.points;
			existing.metrics.exactScores += entry.metrics.exactScores;
			existing.metrics.correctOutcomes += entry.metrics.correctOutcomes;
			existing.metrics.exactGoalsOneTeam += entry.metrics.exactGoalsOneTeam;
			if (!existing.metrics.earliestSubmission || (entry.metrics.earliestSubmission && entry.metrics.earliestSubmission < existing.metrics.earliestSubmission)) {
				existing.metrics.earliestSubmission = entry.metrics.earliestSubmission;
			}
		}
	}

	const candidates: RankingCandidate[] = [...aggregated.entries()].map(([userId, value]) => ({
		userId,
		points: value.points,
		metrics: {
			exactScores: value.metrics.exactScores,
			correctOutcomes: value.metrics.correctOutcomes,
			exactGoalsOneTeam: value.metrics.exactGoalsOneTeam,
			earliestSubmission: value.metrics.earliestSubmission,
			randomSeed: value.metrics.randomSeed || toCandidateSeed(tournament.tournamentId, userId, tournament.rulesetId),
		},
	}));
	candidates.sort((left, right) => compareRankingCandidates(left, right, ruleset.tieBreakers));

	const latestSnapshot = await context.scoringRepo.getLatestSnapshot(tournament.tournamentId, 'season');
	const computedAt = context.clockPort.nowIso();
	return {
		snapshotId: context.idGeneratorPort.nextId('rank_season'),
		parentSnapshotId: latestSnapshot?.snapshotId ?? null,
		tournamentId: tournament.tournamentId,
		scope: 'season',
		state: seasonMatchStates.length > 0 ? isRankingStateFinal(seasonMatchStates) : 'provisional',
		computedAt,
		reason,
		rulesetId: tournament.rulesetId,
		entries: candidates.map((candidate, index) => ({
			position: index + 1,
			userId: candidate.userId,
			points: candidate.points,
			metrics: {
				exactScores: candidate.metrics.exactScores,
				correctOutcomes: candidate.metrics.correctOutcomes,
				exactGoalsOneTeam: candidate.metrics.exactGoalsOneTeam,
				earliestSubmission: candidate.metrics.earliestSubmission,
				randomSeed: candidate.metrics.randomSeed,
			},
		})),
	};
}
