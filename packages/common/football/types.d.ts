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
	derby: boolean;
	weather: MatchWeather;
	status: MatchStatus;
	odds: string;
	result?: string;
}
