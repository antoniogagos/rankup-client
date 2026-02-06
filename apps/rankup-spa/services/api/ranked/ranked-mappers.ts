import { mapOptional } from '../gateway-mapping.js';
import { mapUserSummary } from '../tourney/tourney-mappers.js';
import type * as Api from '@rankup/api';
import type * as Leaderboards from '@rankup/rankup/domains/ranked/leaderboards/contracts/types.js';
import type * as Seasons from '@rankup/rankup/domains/ranked/seasons/contracts/types.js';

export function mapRankedEligibilityPolicy(policy: Api.RankedEligibilityPolicy): Seasons.RankedEligibilityPolicy {
	return {
		requiresVerified: policy.requiresVerified,
		requiresEloEnabled: policy.requiresEloEnabled,
		allowedVerifiedEventIds: policy.allowedVerifiedEventIds,
		notes: policy.notes,
	};
}

export function mapRankedTierRewardPreview(preview: Api.RankedTierRewardPreview): Seasons.RankedTierRewardPreview {
	return {
		rewardType: preview.rewardType,
		rewardId: preview.rewardId,
		label: preview.label,
		imageUrl: preview.imageUrl,
	};
}

export function mapRankedTierDefinition(definition: Api.RankedTierDefinition): Seasons.RankedTierDefinition {
	return {
		tierId: definition.tierId,
		name: definition.name,
		description: definition.description,
		iconUrl: definition.iconUrl,
		minRating: definition.minRating,
		maxRating: definition.maxRating,
		rewards: definition.rewards?.map(mapRankedTierRewardPreview),
	};
}

export function mapRankedTrackScope(scope: Api.RankedTrackScope): Seasons.RankedTrackScope {
	return {
		scopeKind: scope.scopeKind,
		gameModeId: scope.gameModeId,
		sportId: scope.sportId,
		formatId: scope.formatId,
		region: scope.region,
	};
}

export function mapRankedTrackSummary(summary: Api.RankedTrackSummary): Seasons.RankedTrackSummary {
	return {
		rankedTrackId: summary.rankedTrackId,
		status: summary.status,
		name: summary.name,
		description: summary.description,
		ratingModel: summary.ratingModel,
		cadence: summary.cadence,
		scope: mapRankedTrackScope(summary.scope),
		activeSeasonId: summary.activeSeasonId,
		featured: summary.featured,
		heroImageUrl: summary.heroImageUrl,
	};
}

export function mapRankedSeasonSummary(summary: Api.RankedSeasonSummary): Seasons.RankedSeasonSummary {
	return {
		rankedSeasonId: summary.rankedSeasonId,
		status: summary.status,
		title: summary.title,
		startsAt: summary.startsAt,
		endsAt: summary.endsAt,
		joinOpensAt: summary.joinOpensAt,
		joinClosesAt: summary.joinClosesAt,
	};
}

export function mapRankedSeason(season: Api.RankedSeason): Seasons.RankedSeason {
	return {
		rankedSeasonId: season.rankedSeasonId,
		status: season.status,
		title: season.title,
		startsAt: season.startsAt,
		endsAt: season.endsAt,
		joinOpensAt: season.joinOpensAt,
		joinClosesAt: season.joinClosesAt,
		eligibility: mapOptional(season.eligibility, mapRankedEligibilityPolicy),
		recapRecapType: season.recapRecapType,
	};
}

export function mapRankedTrack(track: Api.RankedTrack): Seasons.RankedTrack {
	return {
		rankedTrackId: track.rankedTrackId,
		status: track.status,
		name: track.name,
		description: track.description,
		ratingModel: track.ratingModel,
		cadence: track.cadence,
		scope: mapRankedTrackScope(track.scope),
		activeSeasonId: track.activeSeasonId,
		featured: track.featured,
		heroImageUrl: track.heroImageUrl,
		eligibility: mapOptional(track.eligibility, mapRankedEligibilityPolicy),
		tiers: track.tiers?.map(mapRankedTierDefinition),
		activeSeason: mapOptional(track.activeSeason, mapRankedSeason),
	};
}

export function mapRankedTrackPage(page: Api.RankedTrackPage): Seasons.RankedTrackPage {
	return {
		items: page.items.map(mapRankedTrackSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapRankedSeasonPage(page: Api.RankedSeasonPage): Seasons.RankedSeasonPage {
	return {
		items: page.items.map(mapRankedSeasonSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapRankedMeta(meta: Api.RankedMeta): Seasons.RankedMeta {
	return {
		serverTime: meta.serverTime,
		defaultTrackId: meta.defaultTrackId,
		tracks: meta.tracks?.map(mapRankedTrackSummary),
		notes: meta.notes,
	};
}

export function mapRankedTierProgress(progress: Api.RankedTierProgress): Leaderboards.RankedTierProgress {
	return {
		tierId: progress.tierId,
		rating: progress.rating,
		nextTierId: progress.nextTierId,
		nextTierAtRating: progress.nextTierAtRating,
		progressToNextTier: progress.progressToNextTier,
	};
}

const mapRankedStandingBase = (standing: Api.RankedStandingBase): Leaderboards.RankedStandingBase => ({
	rankedTrackId: standing.rankedTrackId,
	seasonId: standing.seasonId,
	rating: standing.rating,
	tier: mapRankedTierProgress(standing.tier),
	provisional: standing.provisional,
	updatedAt: standing.updatedAt,
});

export function mapRankedLeaderboardEntry(entry: Api.RankedLeaderboardEntry): Leaderboards.RankedLeaderboardEntry {
	return {
		position: entry.position,
		user: mapOptional(entry.user, mapUserSummary),
		rating: entry.rating,
		tierId: entry.tierId,
		deltaSinceYesterday: entry.deltaSinceYesterday,
		percentile: entry.percentile,
	};
}

export function mapRankedLeaderboard(board: Api.RankedLeaderboard): Leaderboards.RankedLeaderboard {
	return {
		serverTime: board.serverTime,
		rankedTrackId: board.rankedTrackId,
		seasonId: board.seasonId,
		view: board.view,
		region: board.region,
		items: board.items.map(mapRankedLeaderboardEntry),
		nextCursor: board.nextCursor,
		myEntry: mapOptional(board.myEntry, mapRankedLeaderboardEntry),
		tiers: board.tiers?.map(mapRankedTierDefinition),
	};
}

export function mapRankedSettings(settings: Api.RankedSettings): Leaderboards.RankedSettings {
	return {
		defaultVisibility: settings.defaultVisibility,
		perTrackVisibility: settings.perTrackVisibility,
		showOnPublicLeaderboards: settings.showOnPublicLeaderboards,
		allowFriendComparisons: settings.allowFriendComparisons,
	};
}

export function mapRankedHistorySource(source: Api.RankedHistorySource): Leaderboards.RankedHistorySource {
	return {
		type: source.type,
		tournamentId: source.tournamentId,
		matchday: source.matchday,
		verifiedEventId: source.verifiedEventId,
		note: source.note,
	};
}

export function mapRankedHistoryEvent(event: Api.RankedHistoryEvent): Leaderboards.RankedHistoryEvent {
	return {
		eventId: event.eventId,
		rankedTrackId: event.rankedTrackId,
		seasonId: event.seasonId,
		occurredAt: event.occurredAt,
		deltaRating: event.deltaRating,
		newRating: event.newRating,
		oldTierId: event.oldTierId,
		newTierId: event.newTierId,
		source: mapRankedHistorySource(event.source),
		provisional: event.provisional,
	};
}

export function mapRankedHistoryPage(page: Api.RankedHistoryPage): Leaderboards.RankedHistoryPage {
	return {
		items: page.items.map(mapRankedHistoryEvent),
		nextCursor: page.nextCursor,
	};
}

export function mapMyRankedTrackStanding(standing: Api.MyRankedTrackStanding): Leaderboards.MyRankedTrackStanding {
	return {
		...mapRankedStandingBase(standing),
		me: mapUserSummary(standing.me),
		position: standing.position,
		percentile: standing.percentile,
		lastDelta: mapOptional(standing.lastDelta, mapRankedHistoryEvent),
	};
}

export function mapPublicRankedTrackStanding(standing: Api.PublicRankedTrackStanding): Leaderboards.PublicRankedTrackStanding {
	return {
		...mapRankedStandingBase(standing),
		user: mapOptional(standing.user, mapUserSummary),
		position: standing.position,
		percentile: standing.percentile,
	};
}

export function mapMyRankedProfile(profile: Api.MyRankedProfile): Leaderboards.MyRankedProfile {
	return {
		serverTime: profile.serverTime,
		user: mapUserSummary(profile.user),
		tracks: profile.tracks.map(mapMyRankedTrackStanding),
	};
}

export function mapPublicRankedProfile(profile: Api.PublicRankedProfile): Leaderboards.PublicRankedProfile {
	return {
		user: mapUserSummary(profile.user),
		tracks: profile.tracks.map(mapPublicRankedTrackStanding),
	};
}
