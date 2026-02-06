import { defineSharedKeys, mapOptional, pickFields } from '../gateway-mapping.js';
import { mapRecapCard } from './recaps-mappers.js';
import type * as Api from '@rankup/api';
import type * as Domain from '@rankup/rankup/domains/engagement/stats/contracts/types.js';

const userSummaryKeys = defineSharedKeys<Domain.UserSummary, Api.MeSummary>()(['userId', 'username', 'pictureUrl']);
const statsWindowKeys = defineSharedKeys<Domain.StatsWindow, Api.StatsWindow>()(['from', 'to', 'timeframe']);
const statsSnapshotBaseKeys = defineSharedKeys<Domain.StatsSnapshotBase, Api.StatsSnapshotBase>()([
	'gameModeId',
	'sportId',
	'serverTime',
	'computedAt',
	'window',
	'state',
	'verifiedOnly',
]);
const scorePredictionAggregateCountersKeys = defineSharedKeys<Domain.ScorePredictionAggregateCounters, Api.ScorePredictionAggregateCounters>()([
	'matchesInScope',
	'predictionsSubmitted',
	'exactScores',
	'correctOutcomes',
	'exactGoalsOneTeam',
	'penalties',
	'bonuses',
]);
const scorePredictionAggregateRatesKeys = defineSharedKeys<Domain.ScorePredictionAggregateRates, Api.ScorePredictionAggregateRates>()([
	'predictionCompletionRate',
	'exactScoreRate',
	'correctOutcomeRate',
]);
const histogramBucketKeys = defineSharedKeys<Domain.IntegerHistogramBucket, Api.IntegerHistogramBucket>()(['from', 'to', 'count']);
const teamRefKeys = defineSharedKeys<Domain.TeamRef, Api.TeamRef>()(['teamId', 'name', 'shortName', 'crestUrl']);
const userMetricLineKeys = defineSharedKeys<Domain.UserMetricLine, Api.UserMetricLine>()(['value', 'valueLabel']);
const teamStatLineKeys = defineSharedKeys<Domain.TeamStatLine, Api.TeamStatLine>()(['value', 'valueLabel']);
const scorePredictionResultBreakdownKeys = defineSharedKeys<Domain.ScorePredictionResultBreakdown, Api.ScorePredictionResultBreakdown>()([
	'correctOutcome',
	'exactScore',
	'exactGoalsOneTeam',
	'penalties',
	'bonuses',
]);

export const mapUserSummary = (user: Api.MeSummary): Domain.UserSummary => pickFields(user, userSummaryKeys);

export const mapStatsWindow = (window: Api.StatsWindow): Domain.StatsWindow => pickFields(window, statsWindowKeys);

export const mapStatsSnapshotBase = (snapshot: Api.StatsSnapshotBase): Domain.StatsSnapshotBase => ({
	...pickFields(snapshot, statsSnapshotBaseKeys),
	window: mapOptional(snapshot.window, mapStatsWindow),
});

export const mapScorePredictionAggregateCounters = (
	counters: Api.ScorePredictionAggregateCounters,
): Domain.ScorePredictionAggregateCounters => pickFields(counters, scorePredictionAggregateCountersKeys);

export const mapScorePredictionAggregateRates = (rates: Api.ScorePredictionAggregateRates): Domain.ScorePredictionAggregateRates =>
	pickFields(rates, scorePredictionAggregateRatesKeys);

export const mapIntegerHistogramBucket = (bucket: Api.IntegerHistogramBucket): Domain.IntegerHistogramBucket =>
	pickFields(bucket, histogramBucketKeys);

export const mapIntegerHistogram = (histogram: Api.IntegerHistogram): Domain.IntegerHistogram => ({
	buckets: histogram.buckets.map(mapIntegerHistogramBucket),
});

export const mapTeamRef = (team: Api.TeamRef): Domain.TeamRef => pickFields(team, teamRefKeys);

export const mapUserMetricLine = (line: Api.UserMetricLine): Domain.UserMetricLine => ({
	...pickFields(line, userMetricLineKeys),
	user: mapUserSummary(line.user),
});

export const mapTeamStatLine = (line: Api.TeamStatLine): Domain.TeamStatLine => ({
	...pickFields(line, teamStatLineKeys),
	team: mapTeamRef(line.team),
});

export const mapScorePredictionResultBreakdown = (
	breakdown: Api.ScorePredictionResultBreakdown,
): Domain.ScorePredictionResultBreakdown => pickFields(breakdown, scorePredictionResultBreakdownKeys);

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
	breakdown: mapOptional(line.breakdown, mapScorePredictionResultBreakdown),
});

export const mapScorePredictionMyStatsSnapshot = (
	snapshot: Api.ScorePredictionMyStatsSnapshot,
): Domain.ScorePredictionMyStatsSnapshot => ({
	...mapStatsSnapshotBase(snapshot),
	gameModeId: 'scorePrediction',
	user: mapUserSummary(snapshot.user),
	totals: mapScorePredictionAggregateCounters(snapshot.totals),
	rates: mapScorePredictionAggregateRates(snapshot.rates),
	highlights: snapshot.highlights?.map(mapRecapCard),
	distributions: snapshot.distributions
		? {
			pointsPerMatchHistogram: mapOptional(snapshot.distributions.pointsPerMatchHistogram, mapIntegerHistogram),
			pointsPerMatchdayHistogram: mapOptional(snapshot.distributions.pointsPerMatchdayHistogram, mapIntegerHistogram),
		}
		: undefined,
	topTournaments: snapshot.topTournaments?.map(item => ({
		tournamentId: item.tournamentId,
		tournamentName: item.tournamentName,
		points: item.points,
	})),
});

export const mapScorePredictionPublicUserStatsSnapshot = (
	snapshot: Api.ScorePredictionPublicUserStatsSnapshot,
): Domain.ScorePredictionPublicUserStatsSnapshot => ({
	...mapStatsSnapshotBase(snapshot),
	gameModeId: 'scorePrediction',
	user: mapUserSummary(snapshot.user),
	totals: mapScorePredictionAggregateCounters(snapshot.totals),
	rates: mapScorePredictionAggregateRates(snapshot.rates),
	highlights: snapshot.highlights?.map(mapRecapCard),
});

export const mapScorePredictionTournamentStatsSnapshot = (
	snapshot: Api.ScorePredictionTournamentStatsSnapshot,
): Domain.ScorePredictionTournamentStatsSnapshot => ({
	...mapStatsSnapshotBase(snapshot),
	gameModeId: 'scorePrediction',
	tournamentId: snapshot.tournamentId,
	totals: mapScorePredictionAggregateCounters(snapshot.totals),
	topByMetric: snapshot.topByMetric
		? {
			byExactScores: snapshot.topByMetric.byExactScores?.map(mapUserMetricLine),
			byCorrectOutcomes: snapshot.topByMetric.byCorrectOutcomes?.map(mapUserMetricLine),
			byPoints: snapshot.topByMetric.byPoints?.map(mapUserMetricLine),
		}
		: undefined,
	topByTeam: snapshot.topByTeam?.map(item => ({
		team: mapTeamRef(item.team),
		leader: mapUserSummary(item.leader),
		value: item.value,
		valueLabel: item.valueLabel,
	})),
	distributions: snapshot.distributions
		? {
			totalPointsHistogram: mapOptional(snapshot.distributions.totalPointsHistogram, mapIntegerHistogram),
			exactScoresHistogram: mapOptional(snapshot.distributions.exactScoresHistogram, mapIntegerHistogram),
		}
		: undefined,
});

export const mapScorePredictionUserTournamentStatsSnapshot = (
	snapshot: Api.ScorePredictionUserTournamentStatsSnapshot,
): Domain.ScorePredictionUserTournamentStatsSnapshot => ({
	...mapStatsSnapshotBase(snapshot),
	gameModeId: 'scorePrediction',
	tournamentId: snapshot.tournamentId,
	user: mapUserSummary(snapshot.user),
	totals: mapScorePredictionAggregateCounters(snapshot.totals),
	rates: mapScorePredictionAggregateRates(snapshot.rates),
	comparisons: snapshot.comparisons
		? {
			percentilePoints: snapshot.comparisons.percentilePoints,
			percentileExactScores: snapshot.comparisons.percentileExactScores,
		}
		: undefined,
	bestWorstMatches: snapshot.bestWorstMatches
		? {
			best: snapshot.bestWorstMatches.best?.map(mapScorePredictionMatchResultLine),
			worst: snapshot.bestWorstMatches.worst?.map(mapScorePredictionMatchResultLine),
		}
		: undefined,
});

export const mapScorePredictionMatchdayStatsSnapshot = (
	snapshot: Api.ScorePredictionMatchdayStatsSnapshot,
): Domain.ScorePredictionMatchdayStatsSnapshot => ({
	...mapStatsSnapshotBase(snapshot),
	gameModeId: 'scorePrediction',
	tournamentId: snapshot.tournamentId,
	matchday: snapshot.matchday,
	totals: mapScorePredictionAggregateCounters(snapshot.totals),
	topByMetric: snapshot.topByMetric
		? {
			byPoints: snapshot.topByMetric.byPoints?.map(mapUserMetricLine),
			byExactScores: snapshot.topByMetric.byExactScores?.map(mapUserMetricLine),
		}
		: undefined,
	distributions: snapshot.distributions
		? {
			pointsHistogram: mapOptional(snapshot.distributions.pointsHistogram, mapIntegerHistogram),
		}
		: undefined,
});

export const mapScorePredictionUserMatchdayStatsSnapshot = (
	snapshot: Api.ScorePredictionUserMatchdayStatsSnapshot,
): Domain.ScorePredictionUserMatchdayStatsSnapshot => ({
	...mapStatsSnapshotBase(snapshot),
	gameModeId: 'scorePrediction',
	tournamentId: snapshot.tournamentId,
	matchday: snapshot.matchday,
	user: mapUserSummary(snapshot.user),
	totals: mapScorePredictionAggregateCounters(snapshot.totals),
	rates: mapScorePredictionAggregateRates(snapshot.rates),
	breakdown: snapshot.breakdown?.map(mapScorePredictionMatchResultLine),
	comparisons: snapshot.comparisons
		? {
			rankPosition: snapshot.comparisons.rankPosition,
			percentilePoints: snapshot.comparisons.percentilePoints,
		}
		: undefined,
});

export const mapGenericMyStatsSnapshot = (snapshot: Api.GenericMyStatsSnapshot): Domain.GenericMyStatsSnapshot => ({
	...snapshot,
	user: mapOptional(snapshot.user, mapUserSummary),
});

export const mapGenericPublicUserStatsSnapshot = (
	snapshot: Api.GenericPublicUserStatsSnapshot,
): Domain.GenericPublicUserStatsSnapshot => ({
	...snapshot,
	user: mapOptional(snapshot.user, mapUserSummary),
});

export const mapGenericTournamentStatsSnapshot = (
	snapshot: Api.GenericTournamentStatsSnapshot,
): Domain.GenericTournamentStatsSnapshot => ({
	...snapshot,
});

export const mapGenericUserTournamentStatsSnapshot = (
	snapshot: Api.GenericUserTournamentStatsSnapshot,
): Domain.GenericUserTournamentStatsSnapshot => ({
	...snapshot,
	user: mapOptional(snapshot.user, mapUserSummary),
});

export const mapGenericMatchdayStatsSnapshot = (
	snapshot: Api.GenericMatchdayStatsSnapshot,
): Domain.GenericMatchdayStatsSnapshot => ({
	...snapshot,
});

export const mapGenericUserMatchdayStatsSnapshot = (
	snapshot: Api.GenericUserMatchdayStatsSnapshot,
): Domain.GenericUserMatchdayStatsSnapshot => ({
	...snapshot,
	user: mapOptional(snapshot.user, mapUserSummary),
});

const isScorePredictionSnapshot = (snapshot: Api.StatsSnapshotBase): snapshot is Api.StatsSnapshotBase & { gameModeId: 'scorePrediction' } =>
	snapshot.gameModeId === 'scorePrediction';

export const mapMyStatsSnapshot = (snapshot: Api.MyStatsSnapshot): Domain.MyStatsSnapshot => {
	if (isScorePredictionSnapshot(snapshot)) {
		return mapScorePredictionMyStatsSnapshot(snapshot);
	}
	return mapGenericMyStatsSnapshot(snapshot);
};

export const mapPublicUserStatsSnapshot = (snapshot: Api.PublicUserStatsSnapshot): Domain.PublicUserStatsSnapshot => {
	if (isScorePredictionSnapshot(snapshot)) {
		return mapScorePredictionPublicUserStatsSnapshot(snapshot);
	}
	return mapGenericPublicUserStatsSnapshot(snapshot);
};

export const mapTournamentStatsSnapshot = (snapshot: Api.TournamentStatsSnapshot): Domain.TournamentStatsSnapshot => {
	if (isScorePredictionSnapshot(snapshot)) {
		return mapScorePredictionTournamentStatsSnapshot(snapshot);
	}
	return mapGenericTournamentStatsSnapshot(snapshot);
};

export const mapUserTournamentStatsSnapshot = (snapshot: Api.UserTournamentStatsSnapshot): Domain.UserTournamentStatsSnapshot => {
	if (isScorePredictionSnapshot(snapshot)) {
		return mapScorePredictionUserTournamentStatsSnapshot(snapshot);
	}
	return mapGenericUserTournamentStatsSnapshot(snapshot);
};

export const mapMatchdayStatsSnapshot = (snapshot: Api.MatchdayStatsSnapshot): Domain.MatchdayStatsSnapshot => {
	if (isScorePredictionSnapshot(snapshot)) {
		return mapScorePredictionMatchdayStatsSnapshot(snapshot);
	}
	return mapGenericMatchdayStatsSnapshot(snapshot);
};

export const mapUserMatchdayStatsSnapshot = (snapshot: Api.UserMatchdayStatsSnapshot): Domain.UserMatchdayStatsSnapshot => {
	if (isScorePredictionSnapshot(snapshot)) {
		return mapScorePredictionUserMatchdayStatsSnapshot(snapshot);
	}
	return mapGenericUserMatchdayStatsSnapshot(snapshot);
};
