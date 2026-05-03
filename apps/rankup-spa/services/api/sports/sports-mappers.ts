import { mapProblemToDomainError } from '../problem/mapProblemToDomainError.js';
import type * as Api from '@rankup/api';
import type { DomainError } from '@rankup/rankup/domains/shared/errors/domainError.js';
import type * as Catalog from '@rankup/rankup/domains/sports/catalog/contracts/types.js';
import type * as Schedule from '@rankup/rankup/domains/sports/schedule/contracts/types.js';

export function mapSportList(response: Api.ListSportsResponse): Catalog.SportList {
	return {
		items: response.items.map(item => ({
			sportId: item.sportId,
			name: item.name,
			status: item.status,
			iconUrl: item.iconUrl,
		})),
	};
}

export function mapCompetitionPage(response: Api.ListCompetitionsResponse): Catalog.CompetitionPage {
	return {
		items: response.items.map(mapCompetitionItem),
		nextCursor: response.nextCursor,
	};
}

export function mapCompetition(response: Api.GetCompetitionResponse): Catalog.Competition {
	return mapCompetitionItem(response);
}

function mapCompetitionItem(item: Api.ListCompetitionsResponse['items'][number]): Catalog.Competition {
	return {
		competitionId: item.competitionId,
		sportId: item.sportId,
		name: item.name,
		shortName: item.shortName,
		countryCode: item.countryCode,
		type: item.type,
		status: item.status,
		logoUrl: item.logoUrl,
		activeSeasonId: item.activeSeasonId,
	};
}

export function mapSeasonList(response: Api.ListCompetitionSeasonsResponse): Catalog.SeasonList {
	return {
		items: response.items.map(mapSeasonItem),
	};
}

export function mapSeason(response: Api.GetCompetitionSeasonResponse): Catalog.Season {
	return mapSeasonItem(response);
}

function mapSeasonItem(item: Api.ListCompetitionSeasonsResponse['items'][number]): Catalog.Season {
	return {
		seasonId: item.seasonId,
		competitionId: item.competitionId,
		label: item.label,
		status: item.status,
		startsAt: item.startsAt,
		endsAt: item.endsAt,
		totalMatchdays: item.totalMatchdays,
		currentMatchday: item.currentMatchday,
		currentMatchdayStatus: item.currentMatchdayStatus,
		lastUpdatedAt: item.lastUpdatedAt,
	};
}

export function mapTeam(response: Api.GetTeamResponse): Catalog.Team {
	return {
		teamId: response.teamId,
		name: response.name,
		shortName: response.shortName,
		countryCode: response.countryCode,
		crestUrl: response.crestUrl,
		primaryColor: response.primaryColor,
	};
}

export function mapMatchdayList(response: Api.ListMatchdaysResponse): Schedule.MatchdayList {
	return {
		items: response.items.map(item => ({
			matchday: item.matchday,
			status: item.status,
			startsAt: item.startsAt,
			endsAt: item.endsAt,
			matchCount: item.matchCount,
		})),
	};
}

export function mapMatchPage(response: Api.ListMatchdayMatchesResponse): Schedule.MatchPage {
	return {
		items: response.items.map(mapMatchItem),
		nextCursor: response.nextCursor,
	};
}

export function mapSearchMatchPage(response: Api.SearchMatchesResponse): Schedule.MatchPage {
	return {
		items: response.items.map(mapMatchItem),
		nextCursor: response.nextCursor,
	};
}

export function mapMatch(response: Api.GetMatchResponse): Schedule.Match {
	return mapMatchItem(response);
}

function mapMatchItem(item: Api.ListMatchdayMatchesResponse['items'][number]): Schedule.Match {
	const homeTeam = item.homeTeam
		? {
				teamId: item.homeTeam.teamId,
				name: item.homeTeam.name,
				shortName: item.homeTeam.shortName,
				crestUrl: item.homeTeam.crestUrl,
		  }
		: undefined;
	const awayTeam = item.awayTeam
		? {
				teamId: item.awayTeam.teamId,
				name: item.awayTeam.name,
				shortName: item.awayTeam.shortName,
				crestUrl: item.awayTeam.crestUrl,
		  }
		: undefined;
	const score = item.score
		? {
				home: item.score.home,
				away: item.score.away,
				isFinal: item.score.isFinal,
		  }
		: undefined;
	const penaltyShootout = item.penaltyShootout
		? {
				home: item.penaltyShootout.home,
				away: item.penaltyShootout.away,
				winner: item.penaltyShootout.winner,
		  }
		: undefined;
	const eventCounters = item.eventCounters
		? {
				goals: item.eventCounters.goals,
				redCards: item.eventCounters.redCards,
				yellowCards: item.eventCounters.yellowCards,
				lastEventAt: item.eventCounters.lastEventAt,
		  }
		: undefined;

	return {
		matchId: item.matchId,
		sportId: item.sportId,
		competitionId: item.competitionId,
		seasonId: item.seasonId,
		matchday: item.matchday,
		status: item.status,
		scheduledAt: item.scheduledAt,
		startedAt: item.startedAt,
		endedAt: item.endedAt,
		homeTeam,
		awayTeam,
		score,
		finalOutcomeType: item.finalOutcomeType,
		penaltyShootout,
		isDerby: item.isDerby,
		weather: item.weather,
		odds: item.odds,
		eventCounters,
		lastUpdatedAt: item.lastUpdatedAt,
	};
}

export function mapMatchEventPage(response: Api.ListMatchEventsResponse): Schedule.MatchEventPage {
	return {
		items: response.items.map(item => ({
			eventId: item.eventId,
			matchId: item.matchId,
			type: item.type,
			occurredAt: item.occurredAt,
			minute: item.minute,
			teamId: item.teamId,
			playerName: item.playerName,
			payload: item.payload,
		})),
		nextCursor: response.nextCursor,
	};
}

export const mapSportsProblemToDomainError = (problem: unknown): DomainError => mapProblemToDomainError(problem);
