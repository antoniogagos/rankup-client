import type { RankingTieBreaker } from '../../domains/tournaments/shared/models/enums.js';
import { stableHash } from '../../shared/validation/stableHash.js';

export type ScorePredictionRankingMetrics = {
	exactScores: number;
	correctOutcomes: number;
	exactGoalsOneTeam: number;
	earliestSubmission: string | null;
	randomSeed: string;
};

export type RankingCandidate = {
	userId: string;
	points: number;
	metrics: ScorePredictionRankingMetrics;
};

function compareDatesAsc(left: string | null, right: string | null): number {
	if (!left && !right) {
		return 0;
	}
	if (!left) {
		return 1;
	}
	if (!right) {
		return -1;
	}
	return left.localeCompare(right);
}

function compareRandom(left: string, right: string): number {
	const leftHash = stableHash(left);
	const rightHash = stableHash(right);
	return leftHash.localeCompare(rightHash);
}

export function compareRankingCandidates(
	left: RankingCandidate,
	right: RankingCandidate,
	tieBreakers: RankingTieBreaker[],
): number {
	if (left.points !== right.points) {
		return right.points - left.points;
	}

	for (const tieBreaker of tieBreakers) {
		switch (tieBreaker) {
			case 'mostExactScores':
				if (left.metrics.exactScores !== right.metrics.exactScores) {
					return right.metrics.exactScores - left.metrics.exactScores;
				}
				break;
			case 'mostCorrectOutcomes':
				if (left.metrics.correctOutcomes !== right.metrics.correctOutcomes) {
					return right.metrics.correctOutcomes - left.metrics.correctOutcomes;
				}
				break;
			case 'mostExactGoalsOneTeam':
				if (left.metrics.exactGoalsOneTeam !== right.metrics.exactGoalsOneTeam) {
					return right.metrics.exactGoalsOneTeam - left.metrics.exactGoalsOneTeam;
				}
				break;
			case 'earliestSubmission': {
				const comparison = compareDatesAsc(left.metrics.earliestSubmission, right.metrics.earliestSubmission);
				if (comparison !== 0) {
					return comparison;
				}
				break;
			}
			case 'random': {
				const comparison = compareRandom(left.metrics.randomSeed, right.metrics.randomSeed);
				if (comparison !== 0) {
					return comparison;
				}
				break;
			}
			default:
				break;
		}
	}

	return left.userId.localeCompare(right.userId);
}
