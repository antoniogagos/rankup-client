import type {
	CompetitionId,
	Match,
	MatchStatus,
	MatchWeather,
} from '@rankup/common/football/types';
import type { ReactiveElement } from 'lit';

import env from '../env/env.js';

const { ApiURL } = env;

type onUserChangedCallback = (loggedUser: any) => void;

type ParamsLocation = {
	path?: string[];
	query?: string[];
	body?: string[];
	header?: string[];
};

type strMap = { [key: string]: string };
export class DataService {
	host?: ReactiveElement;

	onUserChanged?: onUserChangedCallback;

	authorizationToken: string | null = null;

	userId: string | null = null;

	constructor(
		host: ReactiveElement,
		{ onUserChanged }: { onUserChanged?: onUserChangedCallback } = {},
	) {
		this.host = host;
		this.onUserChanged = onUserChanged;
		host.addController(this);
	}

	// TODO remove as controller
	hostConnected() {
		//
	}

	hostDisconnected() {
		//
	}

	async GetUser() {
		return this._fetch(`${ApiURL}/user/{userId}`, {
			method: 'GET',
			params: {
				userId: this.userId,
			},
			paramsLocation: {
				path: ['userId'],
			},
		});
	}

	async GetAllCompetitions() {
		return [
			{
				competitionId: 'competition-1',
				name: 'La Liga',
				sport: 'FOOTBALL',
				game: 'SCORE_BETS',
				season: 2021,
				type: 'DOMESTIC',
				status: 'LIVE',
				groupPhase: false,
				knockoutPhase: false,
				knockoutPhaseSingleMatch: false,
				totalMatchdays: 38,
				totalParticipants: 20,
				currentMatchday: 18,
				currentMatchdayStatus: 'TIMED',
				startsAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
				// list of code-name of each of the matchdays, ordered from first to last for non full seasons
				matchdays: null as string[] | null,
			},
		];
	}

	async GetUserTourneys() {
		return [
			{
				// user-contest info
				contestId: 'contest-1',
				role: 'ADMIN',
				group: 'ACTIVE',
				pushChatEnabled: true,
				rankingPosition: 3,
				name: 'The Squad Team',
				// contest info
				ownerId: 'user-phoga',
				isPublic: false,
				invitationCode: '?',
				open: false,
				totalPlayers: 18,
				competitionId: 'laliga',
				season: 2021,
				format: 'FULL_SEASON',
				pointsVersion: 1,
			},
		];
	}

	async GetRanking() {
		return [
			{
				position: 1,
				points: 1264,
				user: {
					userId: 'antonio-id',
					username: 'Antonio',
					picture: 'rocket.svg',
				},
			},
			{
				position: 2,
				points: 1180,
				user: {
					userId: 'cristiano-ronaldo-id',
					username: 'Cristiano_Ronaldo',
					picture: 'tree.svg',
				},
			},
			{
				position: 3,
				points: 950,
				user: {
					userId: 'nacho-id',
					username: 'nacho',
					picture: 'ironman.svg',
				},
			},
			{
				position: 4,
				points: 778,
				user: {
					userId: 'alvaro-id',
					username: 'alvaro',
					picture: 'fighter.svg',
				},
			},
			{
				position: 5,
				points: 734,
				user: {
					userId: 'elbichito-id',
					username: 'ElBichito',
					picture: 'bulbasaur.svg',
				},
			},
		];
	}

	async GetMatchdayMatches(): Promise<Match[]> {
		return [
			{
				matchId: 'match-1',
				homeTeamId: 'team-1',
				awayTeamId: 'team-2',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 20, 2021 18:30:00').getTime(),
				derby: true,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'LIVE' as MatchStatus,
				odds: '2-4-3',
				result: '2-1',
			},
			{
				matchId: 'match-2',
				homeTeamId: 'team-3',
				awayTeamId: 'team-4',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 15:30:00').getTime(),
				derby: false,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '2-4-3',
			},
			{
				matchId: 'match-3',
				homeTeamId: 'team-5',
				awayTeamId: 'team-6',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 18:00:00').getTime(),
				derby: false,
				weather: 'SHOWER_RAIN' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '1.3-3.8-10',
			},
			{
				matchId: 'match-4',
				homeTeamId: 'team-7',
				awayTeamId: 'team-8',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 19:30:00').getTime(),
				derby: false,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '2.5-4-3',
			},
			{
				matchId: 'match-5',
				homeTeamId: 'team-9',
				awayTeamId: 'team-10',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 21:00:00').getTime(),
				derby: true,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '1.2-3-8',
			},
			{
				matchId: 'match-6',
				homeTeamId: 'team-9',
				awayTeamId: 'team-10',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 21:00:00').getTime(),
				derby: false,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '1.2-3-8',
			},
			{
				matchId: 'match-7',
				homeTeamId: 'team-9',
				awayTeamId: 'team-10',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 21:00:00').getTime(),
				derby: false,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '1.2-3-8',
			},
			{
				matchId: 'match-8',
				homeTeamId: 'team-9',
				awayTeamId: 'team-10',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 21:00:00').getTime(),
				derby: false,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '1.2-3-8',
			},
			{
				matchId: 'match-9',
				homeTeamId: 'team-9',
				awayTeamId: 'team-10',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 21:00:00').getTime(),
				derby: false,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '1.2-3-8',
			},
			{
				matchId: 'match-10',
				homeTeamId: 'team-9',
				awayTeamId: 'team-10',
				competitionId: 'FOOTBALL_SPAIN_LEAGUE_1' as CompetitionId,
				season: 2021,
				matchday: 4,
				date: new Date('December 22, 2021 21:00:00').getTime(),
				derby: false,
				weather: 'CLEAR_SKY' as MatchWeather,
				status: 'NS' as MatchStatus,
				odds: '1.2-3-8',
			},
		];
	}

	private async _fetch(
		path: string,
		{
			method = 'GET',
			params = {},
			paramsLocation = {},
		}: {
			method?: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
			params?: { [x: string]: any };
			paramsLocation?: ParamsLocation;
		} = {},
	): Promise<any> {
		const pathParams = filterParams(params, paramsLocation.path ?? []);
		const resolvedPath = computePath(path, pathParams);
		if (/{[^}]+}/.test(resolvedPath)) {
			throw new Error('InvalidPath');
		}
		const headers = {
			...filterParams(params, paramsLocation.header ?? []),
		};
		if (this.authorizationToken) {
			headers.Authorization = this.authorizationToken;
		}
		const body = stringifyParams(filterParams(params, paramsLocation.body ?? [])) ?? '';
		return fetch(resolvedPath, {
			method,
			body: body || undefined,
			headers: {
				...filterParams(params, paramsLocation.header ?? []),
				...headers,
			},
		});
	}
}

function computePath(pathWithParams: string, pathParams: strMap): string {
	let path = pathWithParams;
	for (const [paramName, paramValue] of Object.entries(pathParams)) {
		path = path.replace(new RegExp(`{${paramName}}`), paramValue);
	}
	return path;
}

function filterParams(params: strMap, whiteList: string[]): strMap {
	const res: strMap = {};
	if (whiteList)
		for (const key of whiteList) {
			const value = params[key];
			if (value != null) {
				res[key] = value;
			}
		}
	return res;
}

function stringifyParams(params: strMap): string | undefined {
	if (params && Object.keys(params).length > 0) {
		return JSON.stringify(params);
	}
	return undefined;
}
