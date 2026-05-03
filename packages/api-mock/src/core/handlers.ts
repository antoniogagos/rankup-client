import type { CreateDuelRequest, DuelPage, MatchdayAvailability, Tournament, TournamentMatchday, TournamentMatchdayPage, TournamentMatchdaySummary, TournamentSummary } from '@rankup/api';
import type { MockHandlerResponseMap, MockHandlers } from './types.js';
import { clearRuntimeMatchdaySubmission, getRuntimeMatchdayResults, getRuntimeMatchdayResultsSummary, getRuntimeMatchdaySubmission, getRuntimeRankingWindow, getRuntimeTournamentView, joinRuntimeTournament, joinRuntimeTournamentByInvitationCode, listRuntimeMatchdayRanking, listRuntimeMatchdaySubmissions, listRuntimeSeasonRanking, listRuntimeTournamentUpdates, streamRuntimeTournamentLive, syncRuntimeTournamentFromDb, upsertRuntimeMatchdaySubmission } from './engine-runtime.js';
import { toTournamentMatchdayStatus } from './match-status.js';
import { createNotImplementedMockHandlers } from './not-implemented-handler.js';
import { resolveUser, toMeSummary, type MockDb } from '../mock-db.js';

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

function toEpochMs(value: string | undefined): number {
	if (!value) {
		return 0;
	}
	const parsed = Date.parse(value);
	return Number.isNaN(parsed) ? 0 : parsed;
}

function buildMatchdaySummaries(db: MockDb, tournament: TournamentSummary, serverTime: string): TournamentMatchdaySummary[] {
	const byMatchday = new Map<number, ReturnType<typeof db.matches.list>>();
	for (const match of db.matches.list()) {
		if (typeof match.matchday !== 'number') {
			continue;
		}
		const entries = byMatchday.get(match.matchday) ?? [];
		entries.push(match);
		byMatchday.set(match.matchday, entries);
	}

	const sortedMatchdays = [...byMatchday.keys()].sort((left, right) => left - right);
	if (sortedMatchdays.length === 0) {
		return [
			{
				matchday: 1,
				label: 'Matchday 1',
				status: 'upcoming',
				startsAt: serverTime,
				endsAt: serverTime,
				matchCount: 0,
			},
		];
	}

	const summaries: TournamentMatchdaySummary[] = sortedMatchdays.map(matchday => {
		const matches = byMatchday.get(matchday) ?? [];
		const sortedMatches = [...matches].sort((left, right) => toEpochMs(left.scheduledAt) - toEpochMs(right.scheduledAt));
		const startsAt = sortedMatches[0]?.scheduledAt ?? serverTime;
		const endsAt = sortedMatches[sortedMatches.length - 1]?.scheduledAt ?? startsAt;
		return {
			matchday,
			label: `Matchday ${matchday}`,
			status: toTournamentMatchdayStatus(matches),
			startsAt,
			endsAt,
			matchCount: matches.length,
			tournamentId: tournament.tournamentId,
			serverTime,
		} satisfies TournamentMatchdaySummary;
	});

	const liveIndex = summaries.findIndex(summary => summary.status === 'live');
	const upcomingIndex = summaries.findIndex(summary => summary.status === 'upcoming');
	const currentIndex = liveIndex >= 0 ? liveIndex : (upcomingIndex >= 0 ? upcomingIndex : summaries.length - 1);
	if (currentIndex >= 0) {
		summaries[currentIndex] = {
			...summaries[currentIndex],
			isCurrent: true,
		};
	}
	return summaries;
}

function buildMatchdayAvailability(tournament: TournamentSummary, summary: TournamentMatchdaySummary, serverTime: string): MatchdayAvailability {
	if (tournament.status === 'archived') {
		return {
			tournamentId: tournament.tournamentId,
			matchday: summary.matchday,
			serverTime,
			state: 'locked',
			canSubmit: false,
			reason: 'tournamentArchived',
			message: 'Tournament archived.',
		};
	}
	if (tournament.status === 'cancelled') {
		return {
			tournamentId: tournament.tournamentId,
			matchday: summary.matchday,
			serverTime,
			state: 'locked',
			canSubmit: false,
			reason: 'tournamentCancelled',
			message: 'Tournament cancelled.',
		};
	}
	if (tournament.joinPolicy.locked) {
		return {
			tournamentId: tournament.tournamentId,
			matchday: summary.matchday,
			serverTime,
			state: 'locked',
			canSubmit: false,
			reason: 'tournamentLocked',
			message: 'Tournament is locked.',
		};
	}
	if (summary.matchCount === 0) {
		return {
			tournamentId: tournament.tournamentId,
			matchday: summary.matchday,
			serverTime,
			state: 'notStarted',
			canSubmit: false,
			reason: 'matchdayNotInTournamentWindow',
			message: 'Matchday is not in tournament window.',
		};
	}
	if (summary.status === 'finished') {
		return {
			tournamentId: tournament.tournamentId,
			matchday: summary.matchday,
			serverTime,
			state: 'finished',
			canSubmit: false,
			reason: 'matchdayFinished',
			message: 'Matchday finished.',
			opensAt: summary.startsAt,
			locksAt: summary.startsAt,
			closesAt: summary.endsAt,
		};
	}
	if (summary.status === 'live') {
		return {
			tournamentId: tournament.tournamentId,
			matchday: summary.matchday,
			serverTime,
			state: 'locked',
			canSubmit: false,
			reason: 'joinClosed',
			message: 'Matchday lock active.',
			opensAt: summary.startsAt,
			locksAt: summary.startsAt,
			closesAt: summary.endsAt,
		};
	}
	return {
		tournamentId: tournament.tournamentId,
		matchday: summary.matchday,
		serverTime,
		state: 'open',
		canSubmit: true,
		reason: 'open',
		message: 'Submissions open.',
		opensAt: summary.startsAt,
		locksAt: summary.startsAt,
		closesAt: summary.endsAt,
	};
}

const explicitMockHandlers: MockHandlers = {
	getUserPublicProfile: ({ params }, db) => ({
		status: 200,
		response: resolveUser(db, params.userId),
	}),
	listCompetitions: (_context, db) => ({
		status: 200,
		response: { items: db.competitions.list() },
	}),
	listDiscoverableTournaments: async (_context, db) => {
		const items = await Promise.all(
			db.tournaments.list().map(async ({ tournament }) => {
				const runtime = await getRuntimeTournamentView(db, tournament.tournamentId);
				return toDiscoverCard({
					...tournament,
					status: runtime.status,
					joinPolicy: runtime.joinPolicy,
					memberCount: runtime.memberCount,
					rulesetId: runtime.rulesetId,
				});
			}),
		);
		return {
			status: 200,
			response: {
				items,
			},
		};
	},
	listMyTournaments: async (_context, db) => {
		const items = await Promise.all(
			db.tournaments.list().map(async ({ tournamentId: _ignore, tournament, membership, ...rest }) => {
				const runtime = await getRuntimeTournamentView(db, tournament.tournamentId);
				return {
					...rest,
					tournament: {
						...tournament,
						status: runtime.status,
						joinPolicy: runtime.joinPolicy,
						memberCount: runtime.memberCount,
						rulesetId: runtime.rulesetId,
					},
					membership,
				};
			}),
		);
		return {
			status: 200,
			response: {
				items,
			},
		};
	},
	listMyDuels: (_context, db) => {
		const opponent = resolveUser(db, 'user-cr7');
		const items = db.tournaments
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
	createTournament: async ({ body }, db) => {
		const tournamentId = `tournament-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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
		db.tournaments.create({
			tournamentId,
			tournament,
			membership,
		});
		await syncRuntimeTournamentFromDb(db, tournamentId);
		return {
			status: 201,
			response: toTournamentResponse(tournament, membership),
		};
	},
	createDuel: async ({ body }, db) => {
		const tournamentId = `duel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		const createdAt = now();
		const fallbackSeasonId = new Date(Date.now()).getUTCFullYear().toString();
		const competition = db.competitions.list()[0];
		const request = body as Partial<CreateDuelRequest>;
		const timing = {
			competitionId: request.timing?.competitionId ?? competition?.competitionId ?? 'FOOTBALL_SPAIN_LEAGUE_1',
			seasonId: request.timing?.seasonId ?? competition?.activeSeasonId ?? fallbackSeasonId,
			startMatchday: request.timing?.startMatchday ?? 1,
			endMatchday: request.timing?.endMatchday ?? 1,
			startsAt: request.timing?.startsAt ?? createdAt,
			endsAt: request.timing?.endsAt ?? createdAt,
		};
		const joinPolicy = {
			joinMode: request.joinPolicy?.joinMode ?? ('closed' as const),
			joinMidSeasonAllowed: request.joinPolicy?.joinMidSeasonAllowed ?? false,
			maxPlayers: request.joinPolicy?.maxPlayers ?? 2,
			locked: request.joinPolicy?.locked ?? false,
			joinClosesAt: request.joinPolicy?.joinClosesAt,
		};
		const tournament: Tournament = {
			tournamentId,
			name: request.name ?? 'Duel de Predicciones',
			visibility: request.visibility ?? 'private',
			discoverability: request.discoverability ?? 'unlisted',
			verificationStatus: 'community',
			sportId: request.sportId ?? 'football',
			gameModeId: request.gameModeId ?? 'scorePrediction',
			formatId: 'headsUp',
			modality: request.modality ?? 'matchday',
			status: 'live',
			joinPolicy,
			memberCount: 2,
			timing,
			createdAt,
			updatedAt: createdAt,
			formatConfig: request.formatConfig,
			headsUpAcceptance: {
				status: 'pending',
				challengerUserId: resolveUser(db).userId,
				opponentUserId: request.opponentUserId ?? resolveUser(db, 'user-cr7').userId,
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
			},
			myMembership: { role: 'owner', joinedAt: createdAt },
		};
		db.tournaments.create({
			tournamentId,
			tournament,
			membership: { role: 'owner', joinedAt: createdAt },
		});
		await syncRuntimeTournamentFromDb(db, tournamentId);
		return { status: 201, response: tournament };
	},
	createDuelRematch: async ({ params, body }, db) => {
		const source = db.tournaments.get(params.tournamentId);
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
		db.tournaments.create({
			tournamentId,
			tournament,
			membership: { role: 'owner', joinedAt: createdAt },
		});
		await syncRuntimeTournamentFromDb(db, tournamentId);
		return { status: 201, response: tournament };
	},
	joinTournament: async ({ params, headers }, db) => {
		const runtimeResult = await joinRuntimeTournament(db, {
			tournamentId: params.tournamentId,
			userId: resolveUser(db).userId,
			idempotencyKey: headers?.idempotencyKey,
		});
		return {
			status: runtimeResult.status,
			response: runtimeResult.response as MockHandlerResponseMap['joinTournament'],
			headers: runtimeResult.headers,
		};
	},
	joinTournamentByInvitationCode: async ({ params, headers }, db) => {
		const runtimeResult = await joinRuntimeTournamentByInvitationCode(db, {
			code: params.code,
			userId: resolveUser(db).userId,
			idempotencyKey: headers?.idempotencyKey,
		});
		return {
			status: runtimeResult.status,
			response: runtimeResult.response as MockHandlerResponseMap['joinTournamentByInvitationCode'],
			headers: runtimeResult.headers,
		};
	},
	getTournament: async ({ params }, db) => {
		const record = db.tournaments.get(params.tournamentId);
		if (!record) {
			const fallback = toFallbackTournamentSummary(params.tournamentId);
			return {
				status: 200,
				response: toTournamentResponse(fallback),
			};
		}
		const runtime = await getRuntimeTournamentView(db, params.tournamentId);
		const tournament: TournamentSummary = {
			...record.tournament,
			status: runtime.status,
			joinPolicy: runtime.joinPolicy,
			memberCount: runtime.memberCount,
			rulesetId: runtime.rulesetId,
		};
		return {
			status: 200,
			response: toTournamentResponse(tournament, record.membership),
		};
	},
	listTournamentMatchdays: ({ params, query }, db) => {
		const serverTime = now();
		const record = db.tournaments.get(params.tournamentId);
		const tournament = record?.tournament ?? toFallbackTournamentSummary(params.tournamentId);
		const matchdays = buildMatchdaySummaries(db, tournament, serverTime)
			.map(summary => ({
				...summary,
				availabilitySummary: buildMatchdayAvailability(tournament, summary, serverTime),
			}));

		const filtered = matchdays.filter(summary => {
			if (typeof query?.fromMatchday === 'number' && summary.matchday < query.fromMatchday) {
				return false;
			}
			if (typeof query?.toMatchday === 'number' && summary.matchday > query.toMatchday) {
				return false;
			}
			if (query?.status && summary.status !== query.status) {
				return false;
			}
			return true;
		});

		return {
			status: 200,
			response: {
				serverTime,
				items: filtered,
			} satisfies TournamentMatchdayPage,
		};
	},
	getTournamentMatchday: ({ params }, db) => {
		const serverTime = now();
		const record = db.tournaments.get(params.tournamentId);
		const tournament = record?.tournament ?? toFallbackTournamentSummary(params.tournamentId);
		const summaries = buildMatchdaySummaries(db, tournament, serverTime);
		const sortedMatchdays = summaries.map(summary => summary.matchday).sort((left, right) => left - right);
		const summary = summaries.find(item => item.matchday === params.matchday) ?? {
			matchday: params.matchday,
			label: `Matchday ${params.matchday}`,
			status: 'upcoming' as const,
			startsAt: serverTime,
			endsAt: serverTime,
			matchCount: 0,
			tournamentId: params.tournamentId,
			serverTime,
		};
		const ordered = [...new Set([...sortedMatchdays, params.matchday])].sort((left, right) => left - right);
		const currentIndex = ordered.indexOf(params.matchday);
		const previousMatchday = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
		const nextMatchday = currentIndex >= 0 && currentIndex + 1 < ordered.length ? ordered[currentIndex + 1] : undefined;
		const availabilitySummary = buildMatchdayAvailability(tournament, summary, serverTime);
		return {
			status: 200,
			response: {
				...summary,
				tournamentId: params.tournamentId,
				serverTime,
				previousMatchday,
				nextMatchday,
				availabilitySummary,
			} satisfies TournamentMatchday,
		};
	},
	getTournamentMatchdayAvailability: ({ params }, db) => {
		const serverTime = now();
		const record = db.tournaments.get(params.tournamentId);
		const tournament = record?.tournament ?? toFallbackTournamentSummary(params.tournamentId);
		const summary = buildMatchdaySummaries(db, tournament, serverTime).find(item => item.matchday === params.matchday) ?? {
			matchday: params.matchday,
			label: `Matchday ${params.matchday}`,
			status: 'upcoming' as const,
			startsAt: serverTime,
			endsAt: serverTime,
			matchCount: 0,
			tournamentId: params.tournamentId,
			serverTime,
		};
		return {
			status: 200,
			response: buildMatchdayAvailability(tournament, summary, serverTime),
		};
	},
	updateTournament: async ({ params, body }, db) => {
		const record = db.tournaments.get(params.tournamentId);
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
			updatedAt: now(),
		};
		if (record) {
			db.tournaments.update(record.tournamentId, { tournament: updatedTournament });
		}
		await syncRuntimeTournamentFromDb(db, params.tournamentId);
		const runtime = await getRuntimeTournamentView(db, params.tournamentId);
		return {
			status: 200,
			response: toTournamentResponse(
				{
					...updatedTournament,
					status: runtime.status,
					joinPolicy: runtime.joinPolicy,
					memberCount: runtime.memberCount,
					rulesetId: runtime.rulesetId,
				},
				fallback.membership,
			),
		};
	},
	archiveTournament: async ({ params }, db) => {
		const record = db.tournaments.get(params.tournamentId);
		if (record) {
			db.tournaments.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					status: 'archived',
					updatedAt: now(),
				},
			});
			await syncRuntimeTournamentFromDb(db, params.tournamentId);
		}
		return { status: 204, response: undefined };
	},
	deleteTournament: ({ params }, db) => {
		db.tournaments.remove(params.tournamentId);
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
	lockTournament: async ({ params }, db) => {
		const record = db.tournaments.get(params.tournamentId);
		if (record) {
			db.tournaments.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					joinPolicy: {
						...record.tournament.joinPolicy,
						locked: true,
					},
					updatedAt: now(),
				},
			});
			await syncRuntimeTournamentFromDb(db, params.tournamentId);
		}
		return { status: 204, response: undefined };
	},
	unlockTournament: async ({ params }, db) => {
		const record = db.tournaments.get(params.tournamentId);
		if (record) {
			db.tournaments.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					joinPolicy: {
						...record.tournament.joinPolicy,
						locked: false,
					},
					updatedAt: now(),
				},
			});
			await syncRuntimeTournamentFromDb(db, params.tournamentId);
		}
		return { status: 204, response: undefined };
	},
	unarchiveTournament: async ({ params }, db) => {
		const record = db.tournaments.get(params.tournamentId);
		if (record) {
			db.tournaments.update(record.tournamentId, {
				tournament: {
					...record.tournament,
					status: 'live',
					updatedAt: now(),
				},
			});
			await syncRuntimeTournamentFromDb(db, params.tournamentId);
		}
		return { status: 204, response: undefined };
	},
	transferTournamentOwnership: async ({ params }, db) => {
		const record = db.tournaments.get(params.tournamentId);
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
			db.tournaments.update(record.tournamentId, {
				tournament,
				membership,
			});
		}
		await syncRuntimeTournamentFromDb(db, params.tournamentId);
		const runtime = await getRuntimeTournamentView(db, params.tournamentId);
		return {
			status: 200,
			response: toTournamentResponse(
				{
					...tournament,
					status: runtime.status,
					joinPolicy: runtime.joinPolicy,
					memberCount: runtime.memberCount,
					rulesetId: runtime.rulesetId,
				},
				membership,
			),
		};
	},
	getTournamentRules: async ({ params }, db) => {
		const record = db.tournaments.get(params.tournamentId);
		const tournament = record?.tournament ?? toFallbackTournamentSummary(params.tournamentId);
		const runtime = await getRuntimeTournamentView(db, params.tournamentId);
		return {
			status: 200,
			response: {
				tournamentId: tournament.tournamentId,
				gameModeId: tournament.gameModeId,
				sportId: tournament.sportId,
				isRankedEligible: tournament.isRankedEligible ?? false,
				rulesetId: runtime.rulesetId,
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
	listTournamentSeasonRanking: async ({ params }, db) => ({
		status: 200,
		response: (await listRuntimeSeasonRanking(db, params.tournamentId)) as MockHandlerResponseMap['listTournamentSeasonRanking'],
	}),
	listTournamentMatchdayMatches: (_context, db) => ({
		status: 200,
		response: {
			serverTime: now(),
			items: db.matches.list(),
		},
	}),
	listTournamentMatchdayRanking: async ({ params }, db) => ({
		status: 200,
		response: (await listRuntimeMatchdayRanking(db, params.tournamentId, params.matchday)) as MockHandlerResponseMap['listTournamentMatchdayRanking'],
	}),
	getMyTournamentSeasonRankingWindow: async ({ params }, db) => ({
		status: 200,
		response: (await getRuntimeRankingWindow(db, {
			tournamentId: params.tournamentId,
			scope: 'season',
			userId: resolveUser(db).userId,
		})) as MockHandlerResponseMap['getMyTournamentSeasonRankingWindow'],
	}),
	getMyTournamentMatchdayRankingWindow: async ({ params }, db) => ({
		status: 200,
		response: (await getRuntimeRankingWindow(db, {
			tournamentId: params.tournamentId,
			scope: 'matchday',
			matchday: params.matchday,
			userId: resolveUser(db).userId,
		})) as MockHandlerResponseMap['getMyTournamentMatchdayRankingWindow'],
	}),
	getMyMatchdayResults: async ({ params }, db) => ({
		status: 200,
		response: await getRuntimeMatchdayResults(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: resolveUser(db).userId,
		}),
	}),
	getUserMatchdayResults: async ({ params }, db) => ({
		status: 200,
		response: await getRuntimeMatchdayResults(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: params.userId,
		}),
	}),
	getMatchdayResultsSummary: async ({ params }, db) => ({
		status: 200,
		response: await getRuntimeMatchdayResultsSummary(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
		}),
	}),
	listTournamentUpdates: async ({ params, query }, db) => ({
		status: 200,
		response: await listRuntimeTournamentUpdates(db, {
			tournamentId: params.tournamentId,
			matchday: typeof query?.matchday === 'number' ? query.matchday : undefined,
		}),
	}),
	streamTournamentLive: async ({ params, query }, db) => ({
		status: 200,
		response: await streamRuntimeTournamentLive(db, {
			tournamentId: params.tournamentId,
			matchday: typeof query?.matchday === 'number' ? query.matchday : undefined,
		}),
	}),
	listMatchdaySubmissions: async ({ params }, db) => ({
		status: 200,
		response: (await listRuntimeMatchdaySubmissions(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
		})) as MockHandlerResponseMap['listMatchdaySubmissions'],
	}),
	getMyMatchdaySubmission: async ({ params }, db) => ({
		status: 200,
		response: (await getRuntimeMatchdaySubmission(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: resolveUser(db).userId,
			scope: 'me',
		})) as MockHandlerResponseMap['getMyMatchdaySubmission'],
	}),
	upsertMyMatchdaySubmission: async ({ params, body }, db) => {
		const upserts = Array.isArray((body as { upserts?: unknown[] }).upserts)
			? ((body as { upserts: Array<{ matchId: string; homeScore: number; awayScore: number }> }).upserts ?? []).filter(
					item =>
						typeof item.matchId === 'string' && typeof item.homeScore === 'number' && typeof item.awayScore === 'number',
			  )
			: [];
		const removes = Array.isArray((body as { removes?: unknown[] }).removes)
			? ((body as { removes: string[] }).removes ?? []).filter(item => typeof item === 'string')
			: [];
		const runtimeResult = await upsertRuntimeMatchdaySubmission(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: resolveUser(db).userId,
			body: {
				upserts,
				removes,
			},
		});
		return {
			status: 200,
			response: runtimeResult.response as MockHandlerResponseMap['upsertMyMatchdaySubmission'],
			headers: runtimeResult.headers,
		};
	},
	clearMyMatchdaySubmission: async ({ params, headers }, db) => {
		await clearRuntimeMatchdaySubmission(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: resolveUser(db).userId,
			idempotencyKey: headers?.idempotencyKey,
		});
		return {
			status: 204,
			response: undefined,
		};
	},
	getUserMatchdaySubmission: async ({ params }, db) => ({
		status: 200,
		response: (await getRuntimeMatchdaySubmission(db, {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: params.userId,
			scope: 'other',
		})) as MockHandlerResponseMap['getUserMatchdaySubmission'],
	}),
	oauthAuthorize: ({ params }) => ({
		status: 302,
		response: undefined as never,
		headers: {
			Location: `https://auth.mock/${params.provider}`,
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

const notImplementedMockHandlers = createNotImplementedMockHandlers();

export const defaultMockHandlers = {
	...notImplementedMockHandlers,
	...explicitMockHandlers,
};
