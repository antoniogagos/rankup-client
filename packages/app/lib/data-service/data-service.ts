import type { ReactiveElement } from 'lit';

import env from '../../env.json' assert { type: 'json' };

const { ApiURL } = env;

type onUserChangedCallback = (loggedUser: any) => void;

type ParamsLocation = {
	path?: string[];
	query?: string[];
	body?: string[];
	header?: string[];
};

type strMap = { [key: string]: string };

export type Chat = {
	// esto vendrá con un tourney seguramente, asi q no incluirá tourneyId
	tourneyId: string;
	totalMessages: number;
	lastMessageAt: Date;
	pinnedMessage: string;
};

export type ChatMessage = {
	// esto vendrá con un tourney seguramente, asi q no incluirá tourneyId
	tourneyId: string;
	messageId: string;
	user: {
		userId: string;
		username: string;
		picture?: string;
	};
	message: string;
	createdAt: Date;
	inReplyToId?: string;
	media?: string;
};

export const chat = {
	totalMessage: 5,
	lastMessageAt: new Date(Date.now() - 1000 * 60 * 60),
	pinnedMessage: 'message-id-1',
};

export const chatMessages = [
	{
		messageId: 'message-id-1',
		message: 'Normas de la comunidad: 10€ por cabeza el q gana blablablá',
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
		user: {
			userId: 'user-269',
			username: 'nachoga',
		},
	},
	{
		messageId: 'message-id-2',
		message: 'Como se cambian las apuestas en esta mierda??',
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
		user: {
			userId: 'user-269',
			username: 'nachoga',
		},
	},
	{
		messageId: 'message-id-3',
		message: 'Ah vale ya me di cuenta, vaya pedazo de mierda. Iros a tomar por el culo.',
		createdAt: new Date(Date.now() - 1000 * 60 * 60),
		inReplyTo: 'message-id-2',
		user: {
			userId: 'user-269',
			username: 'nachoga',
		},
	},
];

export enum CompetitionId {
	FOOTBALL_ARGENTINE_LEAGUE_1 = 'FOOTBALL_ARGENTINE_LEAGUE_1',
	FOOTBALL_CHAMPIONS_LEAGUE = 'FOOTBALL_CHAMPIONS_LEAGUE',
	FOOTBALL_GERMANY_LEAGUE_1 = 'FOOTBALL_GERMANY_LEAGUE_1',
	FOOTBALL_ITALIAN_LEAGUE_1 = 'FOOTBALL_ITALIAN_LEAGUE_1',
	FOOTBALL_MEXICAN_LEAGUE_1 = 'FOOTBALL_MEXICAN_LEAGUE_1',
	FOOTBALL_SPAIN_CUP = 'FOOTBALL_SPAIN_CUP',
	FOOTBALL_SPAIN_LEAGUE_1 = 'FOOTBALL_SPAIN_LEAGUE_1',
	FOOTBALL_UK_LEAGUE_1 = 'FOOTBALL_UK_LEAGUE_1',
	FOOTBALL_WORLD_CUP = 'FOOTBALL_WORLD_CUP',
}

export enum MatchWeather {
	/** clear sky */
	CLEAR_SKY = 'CLEAR_SKY',
	/** few clouds */
	FEW_CLOUDS = 'FEW_CLOUDS',
	/** scattered clouds */
	SCATTERED_CLOUDS = 'SCATTERED_CLOUDS',
	/** broken clouds */
	BROKEN_CLOUDS = 'BROKEN_CLOUDS',
	/** shower rain */
	SHOWER_RAIN = 'SHOWER_RAIN',
	/** rain */
	RAIN = 'RAIN',
	/** thunderstorm */
	THUNDERSTORM = 'THUNDERSTORM',
	/** snow */
	SNOW = 'SNOW',
	/** mist */
	MIST = 'MIST',
	/** clouds */
	CLOUDS = 'CLOUDS',
	/** moderate rain */
	MODERATE_RAIN = 'MODERATE_RAIN',
	/** haze */
	HAZE = 'HAZE',
	/** light intensity shower rain */
	LIGHT_INTENSITY_SHOWER_RAIN = 'LIGHT_INTENSITY_SHOWER_RAIN',
	/** light rain */
	LIGHT_RAIN = 'LIGHT_RAIN',
	/** overcast clouds */
	OVERCAST_CLOUDS = 'OVERCAST_CLOUDS',
	/** fog */
	FOG = 'FOG',
	/** heavy intensity rain */
	HEAVY_INTENSITY_RAIN = 'HEAVY_INTENSITY_RAIN',
	/** thunderstorm with light rain */
	THUNDERSTORM_WITH_LIGHT_RAIN = 'THUNDERSTORM_WITH_LIGHT_RAIN',
	/** thunderstorm with rain */
	THUNDERSTORM_WITH_RAIN = 'THUNDERSTORM_WITH_RAIN',
	/** drizzle */
	DRIZZLE = 'DRIZZLE',
	/** heavy intensity drizzle */
	HEAVY_INTENSITY_DRIZZLE = 'HEAVY_INTENSITY_DRIZZLE',
	/** light intensity drizzle rain */
	LIGHT_INTENSITY_DRIZZLE_RAIN = 'LIGHT_INTENSITY_DRIZZLE_RAIN',
	/** drizzle rain */
	DRIZZLE_RAIN = 'DRIZZLE_RAIN',
	/** heavy intensity drizzle rain */
	HEAVY_INTENSITY_DRIZZLE_RAIN = 'HEAVY_INTENSITY_DRIZZLE_RAIN',
	/** shower rain and drizzle */
	SHOWER_RAIN_AND_DRIZZLE = 'SHOWER_RAIN_AND_DRIZZLE',
	/** heavy shower rain and drizzle */
	HEAVY_SHOWER_RAIN_AND_DRIZZLE = 'HEAVY_SHOWER_RAIN_AND_DRIZZLE',
	/** shower drizzle */
	SHOWER_DRIZZLE = 'SHOWER_DRIZZLE',
	/** light snow */
	LIGHT_SNOW = 'LIGHT_SNOW',
	/** heavy snow */
	HEAVY_SNOW = 'HEAVY_SNOW',
	/** sleet */
	SLEET = 'SLEET',
	/** light shower sleet */
	LIGHT_SHOWER_SLEET = 'LIGHT_SHOWER_SLEET',
	/** shower sleet */
	SHOWER_SLEET = 'SHOWER_SLEET',
	/** light rain and snow */
	LIGHT_RAIN_AND_SNOW = 'LIGHT_RAIN_AND_SNOW',
	/** rain and snow */
	RAIN_AND_SNOW = 'RAIN_AND_SNOW',
	/** light shower snow */
	LIGHT_SHOWER_SNOW = 'LIGHT_SHOWER_SNOW',
	/** shower snow */
	SHOWER_SNOW = 'SHOWER_SNOW',
	/** heavy shower snow */
	HEAVY_SHOWER_SNOW = 'HEAVY_SHOWER_SNOW',
}

export enum MatchStatus {
	/** not started */
	NS = 'NS',
	/** being played */
	LIVE = 'LIVE',
	/** final time */
	FT = 'FT',
	/** half time */
	HT = 'HT',
	/** extra time */
	ET = 'ET',
	/** penalties live */
	PEN_LIVE = 'PEN_LIVE',
	/** finished after extra time 120min, without penalties */
	AET = 'AET',
	/** waiting penalties to start after extra time */
	BREAK = 'BREAK',
	/** finished after penalties */
	FT_PEN = 'FT_PEN',
	/** canceled */
	CANCL = 'CANCL',
	/** postponed */
	POSTP = 'POSTP',
	/** The game has been interrupted. Can be due to bad weather */
	INT = 'INT',
	/** The game has abandoned and will continue at a later time or day */
	ABAN = 'ABAN',
	/** The game has suspended and will continue at a later time or day */
	SUSP = 'SUSP',
	/** The game does not have a confirmed date and time yet. It will be announced later on */
	TBA = 'TBA',
	/** Winner is being decided externally */
	AWARDED = 'AWARDED',
	/** The game is delayed so it will start later */
	DELAYED = 'DELAYED',
	/** Walk Over: Awarding of a victory to a contestant because there are no other contestants */
	WO = 'WO',
}

export interface Match {
	matchId: string;
	homeTeamId: string;
	awayTeamId: string;
	competitionId: CompetitionId;
	season: number;
	matchday: number;
	date: number;
	derbi: boolean;
	weather: MatchWeather;
	status: MatchStatus;
	odds: string;
	result?: string;
}

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
				// user-tourney info
				tourneyId: 'tourney-1',
				role: 'ADMIN',
				group: 'ACTIVE',
				chatReadCount: 2,
				pushChatEnabled: true,
				rankingPosition: 3,
				name: 'The Squad Team',
				// tourney info
				ownerId: 'user-phoga',
				isPublic: false,
				invitationCode: '?',
				open: false,
				chatEnabled: true,
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
				derbi: true,
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
				derbi: false,
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
				derbi: false,
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
				derbi: false,
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
				derbi: true,
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
				derbi: false,
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
				derbi: false,
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
				derbi: false,
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
				derbi: false,
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
				derbi: false,
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
