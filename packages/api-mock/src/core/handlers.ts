import { operations } from '@rankup/api/generated/operations.js';
import type { DuelPage, Tournament, TournamentSummary } from '@rankup/api';
import type { MockHandler, MockHandlers } from './types.js';
import { resolveUser, toMeSummary } from '../mock-db.js';

type OperationCatalogEntry = (typeof operations)[keyof typeof operations];

const now = () => new Date().toISOString();

const toFallbackTournamentSummary = (tournamentId: string): TournamentSummary => ({
	tournamentId,
	name: 'Mock Tournament',
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
	memberCount: 1,
	createdAt: now(),
	updatedAt: now(),
});

const toDiscoverCard = (tournament: TournamentSummary) => ({
	tournamentId: tournament.tournamentId,
	name: tournament.name,
	description: tournament.description,
	heroImageUrl: tournament.heroImageUrl,
	organizer: tournament.organizer,
	visibility: tournament.visibility,
	verificationStatus: tournament.verificationStatus,
	isRankedEligible: tournament.isRankedEligible,
	sportId: tournament.sportId,
	gameModeId: tournament.gameModeId,
	formatId: tournament.formatId,
	modality: tournament.modality,
	status: tournament.status,
	timing: tournament.timing,
	joinPolicy: tournament.joinPolicy,
	memberCount: tournament.memberCount,
	rewardSummary: tournament.rewardSummary,
	cta: 'Join',
});

const toTournamentResponse = (tournament: TournamentSummary, membership?: { role: 'owner' | 'admin' | 'player' | 'moderator'; joinedAt: string; archivedAt?: string }) => ({
	...tournament,
	myMembership: membership ?? { role: 'player' as const, joinedAt: now() },
});

const toRankingMeta = (tournamentId: string, totalPlayers: number, scope: 'season' | 'matchday', matchday?: number) => ({
	tournamentId,
	scope,
	matchday,
	state: scope === 'season' ? ('final' as const) : ('provisional' as const),
	serverTime: now(),
	computedAt: now(),
	totalPlayers,
});

const toRankingItems = (db: Parameters<MockHandlers['listMyTournaments']>[1]) => {
	const items = db.ranking.list();
	if (items.length > 0) {
		return items;
	}
	return [{ position: 1, points: 0, user: toMeSummary(resolveUser(db)) }];
};

const toRankingWindow = (
	db: Parameters<MockHandlers['listMyTournaments']>[1],
	userId: string,
	tournamentId: string,
	scope: 'season' | 'matchday',
	matchday?: number,
) => {
	const items = toRankingItems(db);
	const center = items.find(entry => entry.user.userId === userId) ?? items[0];
	return {
		meta: toRankingMeta(tournamentId, items.length, scope, matchday),
		center,
		items: items.slice(0, 5),
	};
};

const toSubmissionStatus = (submittedCount: number, expectedCount: number): 'missing' | 'partial' | 'complete' => {
	if (submittedCount <= 0) {
		return 'missing';
	}
	if (submittedCount >= expectedCount) {
		return 'complete';
	}
	return 'partial';
};

const toScorePredictionSubmission = (
	db: Parameters<MockHandlers['listMyTournaments']>[1],
	params: { tournamentId: string; matchday: number; userId: string; scope: 'me' | 'other' },
	predictions?: Array<{ matchId: string; homeScore: number; awayScore: number }>,
) => {
	const expectedCount = Math.max(1, db.matches.list().length);
	const seededPredictions =
		predictions ??
		db.matches
			.list()
			.slice(0, 2)
			.map((match, index) => ({
				matchId: match.matchId,
				homeScore: index % 2 === 0 ? 1 : 0,
				awayScore: index % 2 === 0 ? 0 : 1,
			}));
	const submittedCount = seededPredictions.length;
	const completion = {
		submittedCount,
		expectedCount,
		status: toSubmissionStatus(submittedCount, expectedCount),
	};
	return {
		submissionId: `subm-${params.tournamentId}-${params.matchday}-${params.userId}`,
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		userId: params.userId,
		gameModeId: 'scorePrediction' as const,
		serverTime: now(),
		scope: params.scope,
		visibility: 'visible' as const,
		completion,
		createdAt: now(),
		updatedAt: now(),
		predictions: seededPredictions.map(item => {
			const match = db.matches.get(item.matchId);
			return {
				matchId: item.matchId,
				visibility: 'visible' as const,
				isSubmitted: true,
				homeScore: item.homeScore,
				awayScore: item.awayScore,
				lockState: match?.lockState ?? ('open' as const),
				lockAt: match?.scheduledAt,
				submittedAt: now(),
				updatedAt: now(),
			};
		}),
	};
};

const toMatchdayResults = (
	db: Parameters<MockHandlers['listMyTournaments']>[1],
	params: { tournamentId: string; matchday: number; userId: string },
) => {
	const lines = db.matches
		.list()
		.slice(0, 3)
		.map((match, index) => ({
			matchId: match.matchId,
			prediction: {
				homeScore: index % 2 === 0 ? 1 : 0,
				awayScore: index % 2 === 0 ? 0 : 1,
				visibility: 'visible' as const,
			},
			actualScore: {
				home: match.score?.home ?? null,
				away: match.score?.away ?? null,
			},
			points: match.status === 'LIVE' ? 1 : 3,
			state: match.status === 'LIVE' ? ('provisional' as const) : ('final' as const),
		}));
	const totalPoints = lines.reduce((acc, line) => acc + (line.points ?? 0), 0);
	return {
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		gameModeId: 'scorePrediction' as const,
		user: toMeSummary(resolveUser(db, params.userId)),
		serverTime: now(),
		state: 'provisional' as const,
		totalPoints,
		pointsState: 'provisional' as const,
		lines,
	};
};

const toLiveUpdateEvent = (
	db: Parameters<MockHandlers['listMyTournaments']>[1],
	params: { tournamentId: string; matchday?: number; scope: 'season' | 'matchday' },
) => ({
	type: 'ranking.delta' as const,
	tournamentId: params.tournamentId,
	scope: params.scope,
	matchday: params.matchday,
	serverTime: now(),
	deltas: toRankingItems(db).slice(0, 3).map(entry => ({
		userId: entry.user.userId,
		oldPosition: entry.position + 1,
		newPosition: entry.position,
		pointsDelta: entry.position === 1 ? 12 : 5,
		totalPoints: entry.points,
	})),
});

const isAdminOperation = (operation: OperationCatalogEntry): boolean =>
	operation.path.startsWith('/admin') || operation.tags.some(tag => tag.startsWith('admin.'));

const explicitMockHandlers: MockHandlers = {
	getUserPublicProfile: ({ params }, db) => ({
		status: 200,
		response: resolveUser(db, params.userId),
	}),
	listCompetitions: (_context, db) => ({
		status: 200,
		response: { items: db.competitions.list() },
	}),
	listDiscoverableTournaments: (_context, db) => ({
		status: 200,
		response: {
			items: db.tourneys.list().map(({ tournament }) => toDiscoverCard(tournament)),
		},
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
		const createdAt = now();
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
			createdAt,
			updatedAt: createdAt,
		};
		const membership = { role: 'owner' as const, joinedAt: createdAt };
		db.tourneys.create({
			tournamentId,
			tournament,
			membership,
		});
		return {
			status: 201,
			response: toTournamentResponse(tournament, membership),
		};
	},
	createDuel: ({ body }, db) => {
		const tournamentId = `duel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		const createdAt = now();
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
			createdAt,
			updatedAt: createdAt,
			formatConfig: body.formatConfig,
			headsUpAcceptance: {
				status: 'pending',
				challengerUserId: resolveUser(db).userId,
				opponentUserId: body.opponentUserId,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
			},
			myMembership: { role: 'owner', joinedAt: createdAt },
		};
		db.tourneys.create({
			tournamentId,
			tournament,
			membership: { role: 'owner', joinedAt: createdAt },
		});
		return { status: 201, response: tournament };
	},
	createDuelRematch: ({ params, body }, db) => {
		const source = db.tourneys.get(params.tournamentId);
		const tournamentId = `duel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		const createdAt = now();
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
			myMembership: { role: 'owner', joinedAt: createdAt },
		};
		db.tourneys.create({
			tournamentId,
			tournament,
			membership: { role: 'owner', joinedAt: createdAt },
		});
		return { status: 201, response: tournament };
	},
	getTournament: ({ params }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		if (!record) {
			const fallback = toFallbackTournamentSummary(params.tournamentId);
			return {
				status: 200,
				response: toTournamentResponse(fallback),
			};
		}
		return {
			status: 200,
			response: toTournamentResponse(record.tournament, record.membership),
		};
	},
	updateTournament: ({ params, body }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		const fallback = record ?? {
			tournamentId: params.tournamentId,
			tournament: toFallbackTournamentSummary(params.tournamentId),
			membership: { role: 'owner' as const, joinedAt: now() },
		};
		const patch = body;
		const updatedTournament: TournamentSummary = {
			...fallback.tournament,
			name: typeof patch.name === 'string' ? patch.name : fallback.tournament.name,
			description: typeof patch.description === 'string' ? patch.description : fallback.tournament.description,
			discoverability:
				patch.discoverability === 'listed' || patch.discoverability === 'unlisted'
					? patch.discoverability
					: fallback.tournament.discoverability,
			joinPolicy:
				typeof patch.joinPolicy === 'object' && patch.joinPolicy
					? (patch.joinPolicy as TournamentSummary['joinPolicy'])
					: fallback.tournament.joinPolicy,
			rulesetId: typeof patch.rulesetId === 'string' ? patch.rulesetId : fallback.tournament.rulesetId,
			updatedAt: now(),
		};
		if (record) {
			db.tourneys.update(record.tournamentId, { tournament: updatedTournament });
		}
		return {
			status: 200,
			response: toTournamentResponse(updatedTournament, fallback.membership),
		};
	},
	archiveTournament: ({ params }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		if (record) {
			db.tourneys.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					status: 'archived',
					updatedAt: now(),
				},
			});
		}
		return { status: 204, response: undefined };
	},
	deleteTournament: ({ params }, db) => {
		db.tourneys.remove(params.tournamentId);
		return {
			status: 202,
			response: {
				deletionId: `tdel-${Date.now()}`,
				tournamentId: params.tournamentId,
				status: 'accepted',
				requestedAt: now(),
			},
		};
	},
	lockTournament: ({ params }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		if (record) {
			db.tourneys.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					joinPolicy: {
						...record.tournament.joinPolicy,
						locked: true,
					},
					updatedAt: now(),
				},
			});
		}
		return { status: 204, response: undefined };
	},
	unlockTournament: ({ params }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		if (record) {
			db.tourneys.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					joinPolicy: {
						...record.tournament.joinPolicy,
						locked: false,
					},
					updatedAt: now(),
				},
			});
		}
		return { status: 204, response: undefined };
	},
	unarchiveTournament: ({ params }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		if (record) {
			db.tourneys.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					status: 'live',
					updatedAt: now(),
				},
			});
		}
		return { status: 204, response: undefined };
	},
	transferTournamentOwnership: ({ params }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		const fallback = record ?? {
			tournamentId: params.tournamentId,
			tournament: toFallbackTournamentSummary(params.tournamentId),
			membership: { role: 'owner' as const, joinedAt: now() },
		};
		const membership = { ...fallback.membership, role: 'owner' as const };
		const tournament = {
			...fallback.tournament,
			updatedAt: now(),
		};
		if (record) {
			db.tourneys.update(record.tournamentId, {
				tournament,
				membership,
			});
		}
		return {
			status: 200,
			response: toTournamentResponse(tournament, membership),
		};
	},
	getTournamentRules: ({ params }, db) => {
		const record = db.tourneys.get(params.tournamentId);
		const tournament = record?.tournament ?? toFallbackTournamentSummary(params.tournamentId);
		return {
			status: 200,
			response: {
				tournamentId: tournament.tournamentId,
				gameModeId: tournament.gameModeId,
				sportId: tournament.sportId,
				isRankedEligible: tournament.isRankedEligible ?? false,
				rulesetId: tournament.rulesetId,
				sections: [
					{
						title: 'Scoring',
						items: ['Predict outcomes and scores before lock time.', 'Points are awarded based on prediction accuracy.'],
					},
					{
						title: 'Fair Play',
						items: ['No real-money betting.', 'Rankup is a social competitive game.'],
					},
				],
			},
		};
	},
	listTournamentSeasonRanking: ({ params }, db) => ({
		status: 200,
		response: {
			meta: {
				tournamentId: params.tournamentId,
				scope: 'season',
				state: 'final',
				serverTime: now(),
				computedAt: now(),
				totalPlayers: db.ranking.list().length,
			},
			items: db.ranking.list(),
		},
	}),
	listTournamentMatchdayMatches: (_context, db) => ({
		status: 200,
		response: {
			serverTime: now(),
			items: db.matches.list(),
		},
	}),
	listTournamentMatchdayRanking: ({ params }, db) => {
		const items = toRankingItems(db);
		return {
			status: 200,
			response: {
				meta: toRankingMeta(params.tournamentId, items.length, 'matchday', params.matchday),
				items,
				myEntry: items.find(entry => entry.user.userId === resolveUser(db).userId),
			},
		};
	},
	getMyTournamentSeasonRankingWindow: ({ params }, db) => ({
		status: 200,
		response: toRankingWindow(db, resolveUser(db).userId, params.tournamentId, 'season'),
	}),
	getMyTournamentMatchdayRankingWindow: ({ params }, db) => ({
		status: 200,
		response: toRankingWindow(db, resolveUser(db).userId, params.tournamentId, 'matchday', params.matchday),
	}),
	getMyMatchdayResults: ({ params }, db) => ({
		status: 200,
		response: toMatchdayResults(db, { tournamentId: params.tournamentId, matchday: params.matchday, userId: resolveUser(db).userId }),
	}),
	getUserMatchdayResults: ({ params }, db) => ({
		status: 200,
		response: toMatchdayResults(db, { tournamentId: params.tournamentId, matchday: params.matchday, userId: params.userId }),
	}),
	getMatchdayResultsSummary: ({ params }, db) => ({
		status: 200,
		response: {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			serverTime: now(),
			state: 'provisional',
			topPerformers: toRankingItems(db).slice(0, 3).map(entry => ({
				position: entry.position,
				user: entry.user,
				points: entry.points,
			})),
		},
	}),
	listTournamentUpdates: ({ params }, db) => ({
		status: 200,
		response: {
			serverTime: now(),
			events: [toLiveUpdateEvent(db, { tournamentId: params.tournamentId, matchday: 1, scope: 'matchday' })],
			nextCursor: `cursor-${Date.now()}`,
		},
	}),
	streamTournamentLive: ({ params }, db) => {
		const event = toLiveUpdateEvent(db, { tournamentId: params.tournamentId, matchday: 1, scope: 'matchday' });
		return {
			status: 200,
			response: `event: update\ndata: ${JSON.stringify(event)}\n\n`,
		};
	},
	listMatchdaySubmissions: ({ params }, db) => ({
		status: 200,
		response: {
			serverTime: now(),
			items: toRankingItems(db).slice(0, 5).map(entry => ({
				user: entry.user,
				status: 'complete',
				completion: {
					submittedCount: 3,
					expectedCount: 3,
					status: 'complete',
				},
				lastUpdatedAt: now(),
			})),
		},
	}),
	getMyMatchdaySubmission: ({ params }, db) => ({
		status: 200,
		response: toScorePredictionSubmission(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: resolveUser(db).userId,
			scope: 'me',
		}),
	}),
	upsertMyMatchdaySubmission: ({ params, body }, db) => {
		const upserts = Array.isArray((body as { upserts?: unknown[] }).upserts)
			? ((body as { upserts: Array<{ matchId: string; homeScore: number; awayScore: number }> }).upserts ?? []).filter(
					item =>
						typeof item.matchId === 'string' && typeof item.homeScore === 'number' && typeof item.awayScore === 'number',
			  )
			: [];
		const removes = Array.isArray((body as { removes?: unknown[] }).removes)
			? ((body as { removes: string[] }).removes ?? []).filter(item => typeof item === 'string')
			: [];
		const submission = toScorePredictionSubmission(
			db,
			{
				tournamentId: params.tournamentId,
				matchday: params.matchday,
				userId: resolveUser(db).userId,
				scope: 'me',
			},
			upserts.length > 0 ? upserts : undefined,
		);
		const applied = [...new Set([...upserts.map(item => item.matchId), ...removes])];
		return {
			status: 200,
			response: {
				submission,
				applied,
				rejected: [],
			},
		};
	},
	clearMyMatchdaySubmission: () => ({
		status: 204,
		response: undefined,
	}),
	getUserMatchdaySubmission: ({ params }, db) => ({
		status: 200,
		response: toScorePredictionSubmission(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: params.userId,
			scope: 'other',
		}),
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

const fallbackMockHandler: MockHandler<Record<string, unknown>, unknown> = () => ({
	status: 200,
	response: {},
});

const augmentedMockHandlers = explicitMockHandlers as MockHandlers & Record<string, MockHandler<Record<string, unknown>, unknown>>;
const dynamicMockHandlers = augmentedMockHandlers as Record<string, MockHandler<Record<string, unknown>, unknown>>;
for (const operation of Object.values(operations)) {
	if (isAdminOperation(operation)) {
		continue;
	}
	if (Object.prototype.hasOwnProperty.call(dynamicMockHandlers, operation.operationId)) {
		continue;
	}
	dynamicMockHandlers[operation.operationId] = fallbackMockHandler;
}

export const defaultMockHandlers = augmentedMockHandlers;
