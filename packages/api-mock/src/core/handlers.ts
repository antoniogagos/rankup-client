import type { DuelPage, Tournament, TournamentSummary } from '@rankup/api';
import type { MockHandlers } from './types.js';
import { resolveUser, toMeSummary } from '../mock-db.js';

export const defaultMockHandlers: MockHandlers = {
	getUserPublicProfile: ({ params }, db) => ({
		status: 200,
		response: resolveUser(db, params.userId),
	}),
	listCompetitions: (_context, db) => ({
		status: 200,
		response: { items: db.competitions.list() },
	}),
	listMyTournaments: (_context, db) => ({
		status: 200,
		response: { items: db.tourneys.list().map(({ tournamentId: _ignore, ...item }) => item) },
	}),
	listMyDuels: (_context, db) => {
		const opponent = resolveUser(db, 'user-cr7');
		const items = db.tourneys
			.list()
			.filter(({ tournament }) => tournament.formatId === 'headsUp')
			.map(({ tournament }) => ({
				tournament,
				opponentUserId: opponent.userId,
				opponent,
				currentRound: { matchday: 1, status: 'live', locked: false },
			}));
		return {
			status: 200,
			response: { items } satisfies DuelPage,
		};
	},
	createTournament: ({ body }, db) => {
		const tournamentId = `tourney-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		const now = new Date().toISOString();
		const tournament: TournamentSummary = {
			tournamentId,
			name: body.name,
			visibility: body.visibility,
			discoverability: body.discoverability ?? 'unlisted',
			verificationStatus: 'community',
			sportId: body.sportId,
			gameModeId: body.gameModeId,
			formatId: body.formatId ?? 'league',
			modality: body.modality,
			status: 'live',
			joinPolicy: body.joinPolicy,
			memberCount: 1,
			timing: body.timing,
			createdAt: now,
			updatedAt: now,
		};
		const membership = { role: 'owner' as const, joinedAt: now };
		db.tourneys.create({
			tournamentId,
			tournament,
			membership,
		});
		return {
			status: 201,
			response: {
				...tournament,
				myMembership: membership,
			},
		};
	},
	createDuel: ({ body }, db) => {
		const tournamentId = `duel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		const now = new Date().toISOString();
		const tournament: Tournament = {
			tournamentId,
			name: body.name,
			visibility: body.visibility,
			discoverability: body.discoverability ?? 'unlisted',
			verificationStatus: 'community',
			sportId: body.sportId,
			gameModeId: body.gameModeId,
			formatId: 'headsUp',
			modality: body.modality,
			status: 'live',
			joinPolicy: body.joinPolicy,
			memberCount: 2,
			timing: body.timing,
			createdAt: now,
			updatedAt: now,
			formatConfig: body.formatConfig,
			headsUpAcceptance: {
				status: 'pending',
				challengerUserId: resolveUser(db).userId,
				opponentUserId: body.opponentUserId,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
			},
			myMembership: { role: 'owner', joinedAt: now },
		};
		db.tourneys.create({
			tournamentId,
			tournament,
			membership: { role: 'owner', joinedAt: now },
		});
		return { status: 201, response: tournament };
	},
	createDuelRematch: ({ params, body }, db) => {
		const source = db.tourneys.get(params.tournamentId);
		const tournamentId = `duel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		const now = new Date().toISOString();
		const base = source?.tournament ?? ({} as TournamentSummary);
		const baseFormatConfig = (source?.tournament as Tournament | undefined)?.formatConfig;
		const tournament: Tournament = {
			...(base as Tournament),
			tournamentId,
			name: body?.name ?? `${base.name ?? 'Duel'} Rematch`,
			formatId: 'headsUp',
			formatConfig: body?.formatConfigOverrides ?? baseFormatConfig,
			headsUpAcceptance: {
				status: 'pending',
				challengerUserId: resolveUser(db).userId,
				opponentUserId: resolveUser(db, 'user-cr7').userId,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
			},
			myMembership: { role: 'owner', joinedAt: now },
		};
		db.tourneys.create({
			tournamentId,
			tournament,
			membership: { role: 'owner', joinedAt: now },
		});
		return { status: 201, response: tournament };
	},
	listTournamentSeasonRanking: ({ params }, db) => ({
		status: 200,
		response: {
			meta: {
				tournamentId: params.tournamentId,
				scope: 'season',
				state: 'final',
				serverTime: new Date().toISOString(),
				computedAt: new Date().toISOString(),
				totalPlayers: db.ranking.list().length,
			},
			items: db.ranking.list(),
		},
	}),
	listTournamentMatchdayMatches: (_context, db) => ({
		status: 200,
		response: {
			serverTime: new Date().toISOString(),
			items: db.matches.list(),
		},
	}),
	oauthAuthorize: ({ params }) => ({
		status: 302,
		response: {
			headers: { 'X-Request-Id': `mock-request-${Date.now()}`, Location: `https://auth.mock/${params.provider}` },
			content: undefined as never,
		},
	}),
	oauthTokenExchange: (_context, db) => ({
		status: 200,
		response: {
			accessToken: `mock-access-${Date.now()}`,
			refreshToken: `mock-refresh-${Date.now()}`,
			idToken: `mock-id-${Date.now()}`,
			tokenType: 'Bearer',
			expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
			user: toMeSummary(resolveUser(db)),
		},
	}),
};
