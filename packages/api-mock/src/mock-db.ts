import type { Competition, MeSummary, MyTournamentItem, PublicUserProfile, RankingEntry, TournamentMatch } from '@rankup/api';

export type CreateInput<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type MockEntityStore<T, K extends keyof T> = {
	list: () => T[];
	get: (id: T[K]) => T | null;
	create: (input: CreateInput<T, K>) => T;
	update: (id: T[K], patch: Partial<T>) => T | null;
	remove: (id: T[K]) => boolean;
	replace: (items: T[]) => void;
	reset: () => void;
};

export type MockListStore<T> = {
	list: () => T[];
	replace: (items: T[]) => void;
	reset: () => void;
};

export type MockDb = {
	users: MockEntityStore<PublicUserProfile, 'userId'>;
	competitions: MockEntityStore<Competition, 'competitionId'>;
	tourneys: MockEntityStore<MyTournamentRecord, 'tournamentId'>;
	ranking: MockListStore<RankingEntry>;
	matches: MockEntityStore<TournamentMatch, 'matchId'>;
};

type MyTournamentRecord = MyTournamentItem & { tournamentId: string };

const DEFAULT_USER: PublicUserProfile = {
	userId: 'mock-user-1',
	username: 'Antonio',
	pictureUrl: '/assets/avatars/rocket.svg',
	scope: 'full',
};

const USERS: PublicUserProfile[] = [
	DEFAULT_USER,
	{ userId: 'user-cr7', username: 'Cristiano_Ronaldo', pictureUrl: '/assets/avatars/tree.svg', scope: 'full' },
	{ userId: 'user-nacho', username: 'nacho', pictureUrl: '/assets/avatars/ironman.svg', scope: 'full' },
	{ userId: 'user-alvaro', username: 'alvaro', pictureUrl: '/assets/avatars/fighter.svg', scope: 'full' },
	{ userId: 'user-bichito', username: 'ElBichito', pictureUrl: '/assets/avatars/bulbasaur.svg', scope: 'full' },
];

const COMPETITIONS: Competition[] = [
	{
		competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
		name: 'La Liga',
		shortName: 'LaLiga',
		sportId: 'football',
		type: 'domestic',
		status: 'live',
		countryCode: 'ES',
		activeSeasonId: '2024',
	},
	{
		competitionId: 'FOOTBALL_UK_LEAGUE_1',
		name: 'Premier League',
		shortName: 'Premier',
		sportId: 'football',
		type: 'domestic',
		status: 'live',
		countryCode: 'GB',
		activeSeasonId: '2024',
	},
	{
		competitionId: 'FOOTBALL_CHAMPIONS_LEAGUE',
		name: 'Champions League',
		shortName: 'UCL',
		sportId: 'football',
		type: 'international',
		status: 'live',
		countryCode: 'EU',
		activeSeasonId: '2024',
	},
];

const TOURNEYS: MyTournamentRecord[] = [
	{
		tournamentId: 'tourney-1',
		tournament: {
			tournamentId: 'tourney-1',
			name: 'The Squad Team',
			visibility: 'private',
			discoverability: 'unlisted',
			verificationStatus: 'community',
			sportId: 'football',
			gameModeId: 'scorePrediction',
			formatId: 'league',
			modality: 'season',
			status: 'live',
			joinPolicy: {
				joinMode: 'code',
				joinMidSeasonAllowed: true,
				locked: false,
			},
			memberCount: 18,
		},
		membership: {
			role: 'admin',
			joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
		},
	},
	{
		tournamentId: 'tourney-2',
		tournament: {
			tournamentId: 'tourney-2',
			name: 'Una de Premier',
			visibility: 'public',
			discoverability: 'listed',
			verificationStatus: 'community',
			sportId: 'football',
			gameModeId: 'scorePrediction',
			formatId: 'league',
			modality: 'season',
			status: 'live',
			joinPolicy: {
				joinMode: 'open',
				joinMidSeasonAllowed: true,
				locked: false,
			},
			memberCount: 12,
		},
		membership: {
			role: 'player',
			joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
		},
	},
	{
		tournamentId: 'tourney-3',
		tournament: {
			tournamentId: 'tourney-3',
			name: 'Champions League',
			visibility: 'private',
			discoverability: 'unlisted',
			verificationStatus: 'community',
			sportId: 'football',
			gameModeId: 'scorePrediction',
			formatId: 'league',
			modality: 'season',
			status: 'live',
			joinPolicy: {
				joinMode: 'code',
				joinMidSeasonAllowed: true,
				locked: false,
			},
			memberCount: 10,
		},
		membership: {
			role: 'player',
			joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
		},
	},
	{
		tournamentId: 'duel-1',
		tournament: {
			tournamentId: 'duel-1',
			name: 'Duel de Predicciones',
			visibility: 'private',
			discoverability: 'unlisted',
			verificationStatus: 'community',
			sportId: 'football',
			gameModeId: 'scorePrediction',
			formatId: 'headsUp',
			modality: 'matchday',
			status: 'live',
			joinPolicy: {
				joinMode: 'closed',
				joinMidSeasonAllowed: false,
				locked: false,
				maxPlayers: 2,
			},
			memberCount: 2,
		},
		membership: {
			role: 'player',
			joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
		},
	},
];

const RANKING: RankingEntry[] = [
	{ position: 1, points: 1264, user: toMeSummary(USERS[0]) },
	{ position: 2, points: 1180, user: toMeSummary(USERS[1]) },
	{ position: 3, points: 950, user: toMeSummary(USERS[2]) },
	{ position: 4, points: 778, user: toMeSummary(USERS[3]) },
	{ position: 5, points: 734, user: toMeSummary(USERS[4]) },
];

const NOW = Date.now();
const MATCHES: TournamentMatch[] = [
	{
		matchId: 'match-1',
		sportId: 'football',
		competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
		seasonId: '2024',
		matchday: 20,
		scheduledAt: new Date(NOW - 1000 * 60 * 60 * 2).toISOString(),
		isDerby: true,
		weather: { code: 'CLEAR_SKY' },
		status: 'LIVE',
		odds: { raw: '2-4-3' },
		score: { home: 1, away: 0 },
		lockState: 'open',
		homeTeam: { teamId: 'team-1', name: 'Sevilla', shortName: 'Sev' },
		awayTeam: { teamId: 'team-2', name: 'Betis', shortName: 'Bet' },
	},
	{
		matchId: 'match-2',
		sportId: 'football',
		competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
		seasonId: '2024',
		matchday: 20,
		scheduledAt: new Date(NOW + 1000 * 60 * 60 * 2).toISOString(),
		isDerby: false,
		weather: { code: 'CLEAR_SKY' },
		status: 'NS',
		odds: { raw: '2-4-3' },
		lockState: 'open',
		homeTeam: { teamId: 'team-3', name: 'Sevilla', shortName: 'Sev' },
		awayTeam: { teamId: 'team-4', name: 'Betis', shortName: 'Bet' },
	},
	{
		matchId: 'match-3',
		sportId: 'football',
		competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
		seasonId: '2024',
		matchday: 20,
		scheduledAt: new Date(NOW + 1000 * 60 * 60 * 5).toISOString(),
		isDerby: false,
		weather: { code: 'LIGHT_RAIN' },
		status: 'NS',
		odds: { raw: '1.3-3.8-10' },
		lockState: 'open',
		homeTeam: { teamId: 'team-5', name: 'Sevilla', shortName: 'Sev' },
		awayTeam: { teamId: 'team-6', name: 'Betis', shortName: 'Bet' },
	},
	{
		matchId: 'match-4',
		sportId: 'football',
		competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
		seasonId: '2024',
		matchday: 20,
		scheduledAt: new Date(NOW + 1000 * 60 * 60 * 7).toISOString(),
		isDerby: false,
		weather: { code: 'CLEAR_SKY' },
		status: 'NS',
		odds: { raw: '2.5-4-3' },
		lockState: 'open',
		homeTeam: { teamId: 'team-7', name: 'Sevilla', shortName: 'Sev' },
		awayTeam: { teamId: 'team-8', name: 'Betis', shortName: 'Bet' },
	},
	{
		matchId: 'match-5',
		sportId: 'football',
		competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
		seasonId: '2024',
		matchday: 20,
		scheduledAt: new Date(NOW + 1000 * 60 * 60 * 9).toISOString(),
		isDerby: true,
		weather: { code: 'CLEAR_SKY' },
		status: 'NS',
		odds: { raw: '1.2-3-8' },
		lockState: 'open',
		homeTeam: { teamId: 'team-9', name: 'Sevilla', shortName: 'Sev' },
		awayTeam: { teamId: 'team-10', name: 'Betis', shortName: 'Bet' },
	},
];

function clone<T>(value: T): T {
	if (typeof structuredClone === 'function') {
		return structuredClone(value);
	}
	return JSON.parse(JSON.stringify(value)) as T;
}

function createEntityStore<T extends Record<string, unknown>, K extends keyof T>(seed: T[], idKey: K, idPrefix: string): MockEntityStore<T, K> {
	let items = clone(seed);
	const seedSnapshot = clone(seed);
	let counter = items.length + 1;

	const buildId = () => {
		let id = `${idPrefix}-${counter}`;
		counter += 1;
		return id;
	};

	const ensureUniqueId = () => {
		let next = buildId();
		while (items.some(item => item[idKey] === next)) {
			next = buildId();
		}
		return next;
	};

	const list = () => clone(items);

	const get = (id: T[K]) => {
		const found = items.find(item => item[idKey] === id);
		return found ? clone(found) : null;
	};

	const create = (input: CreateInput<T, K>) => {
		const nextId = (input[idKey] ?? ensureUniqueId()) as T[K];
		const created = { ...clone(input), [idKey]: nextId } as T;
		items = [...items, clone(created)];
		return clone(created);
	};

	const update = (id: T[K], patch: Partial<T>) => {
		const index = items.findIndex(item => item[idKey] === id);
		if (index < 0) return null;
		const updated = { ...items[index], ...clone(patch), [idKey]: id } as T;
		items = [...items.slice(0, index), updated, ...items.slice(index + 1)];
		return clone(updated);
	};

	const remove = (id: T[K]) => {
		const index = items.findIndex(item => item[idKey] === id);
		if (index < 0) return false;
		items = [...items.slice(0, index), ...items.slice(index + 1)];
		return true;
	};

	const replace = (next: T[]) => {
		items = clone(next);
		counter = items.length + 1;
	};

	const reset = () => {
		replace(seedSnapshot);
	};

	return { list, get, create, update, remove, replace, reset };
}

function createListStore<T>(seed: T[]): MockListStore<T> {
	let items = clone(seed);
	const seedSnapshot = clone(seed);

	const list = () => clone(items);
	const replace = (next: T[]) => {
		items = clone(next);
	};
	const reset = () => {
		replace(seedSnapshot);
	};

	return { list, replace, reset };
}

export function createMockDb(): MockDb {
	return {
		users: createEntityStore(USERS, 'userId', 'user'),
		competitions: createEntityStore(COMPETITIONS, 'competitionId', 'competition'),
		tourneys: createEntityStore(TOURNEYS, 'tournamentId', 'tournament'),
		ranking: createListStore(RANKING),
		matches: createEntityStore(MATCHES, 'matchId', 'match'),
	};
}

export function resetMockDb(db: MockDb): void {
	db.users.reset();
	db.competitions.reset();
	db.tourneys.reset();
	db.ranking.reset();
	db.matches.reset();
}

export function resolveUser(db: MockDb, userId?: string | null): PublicUserProfile {
	if (!userId) {
		return db.users.list()[0] ?? DEFAULT_USER;
	}
	return db.users.get(userId) ?? DEFAULT_USER;
}

export function toMeSummary(user: PublicUserProfile): MeSummary {
	return {
		userId: user.userId,
		username: user.username,
		pictureUrl: user.pictureUrl,
	};
}
