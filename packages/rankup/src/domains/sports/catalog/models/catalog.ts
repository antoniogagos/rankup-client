import type { CompetitionStatus, CompetitionType, MatchdayStatus, SeasonStatus, SportStatus } from '../../shared/models/enums.js';
import type { CompetitionId, SeasonId, SportId, TeamId } from '../../shared/models/ids.js';

export type Sport = {
	sportId: SportId;
	name: string;
	status: SportStatus;
	iconUrl?: string;
};

export type SportList = {
	items: Sport[];
};

export type Competition = {
	competitionId: CompetitionId;
	sportId: SportId;
	name: string;
	shortName?: string;
	countryCode?: string;
	type: CompetitionType;
	status: CompetitionStatus;
	logoUrl?: string;
	activeSeasonId?: SeasonId;
};

export type CompetitionPage = {
	items: Competition[];
	nextCursor?: string;
};

export type Season = {
	seasonId: SeasonId;
	competitionId: CompetitionId;
	label?: string;
	status: SeasonStatus;
	startsAt?: string;
	endsAt?: string;
	totalMatchdays?: number;
	currentMatchday?: number;
	currentMatchdayStatus?: MatchdayStatus;
	lastUpdatedAt?: string;
};

export type SeasonList = {
	items: Season[];
};

export type Team = {
	teamId: TeamId;
	name: string;
	shortName?: string;
	countryCode?: string;
	crestUrl?: string;
	primaryColor?: string;
};

export type ListCompetitionsQuery = {
	sportId?: SportId;
	type?: CompetitionType;
	status?: CompetitionStatus;
	countryCode?: string;
	q?: string;
	cursor?: string;
	pageSize?: number;
};

export type GetCompetitionParams = {
	competitionId: CompetitionId;
};

export type ListCompetitionSeasonsParams = {
	competitionId: CompetitionId;
};

export type GetCompetitionSeasonParams = {
	competitionId: CompetitionId;
	seasonId: SeasonId;
};

export type GetTeamParams = {
	teamId: TeamId;
};
