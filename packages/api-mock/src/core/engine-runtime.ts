import type { TournamentMatch, TournamentSummary } from '@rankup/api';
import { evaluateScorePrediction } from '@rankup/rankup/algorithms/scoring/index.js';
import { resolveRulesetDefinition } from '@rankup/rankup/registry/index.js';
import { ClearMatchdaySubmissionUseCase, InMemoryAuthorizationPort, InMemoryClockPort, InMemoryEventBusPort, InMemoryIdGeneratorPort, InMemoryIdempotencyPort, InMemoryMembershipRepo, InMemoryProcessedEventRepo, InMemoryScoringRepo, InMemorySportsSchedulePort, InMemorySubmissionRepo, InMemoryTournamentRepo, InMemoryTrustSafetyPort, JoinTournamentUseCase, RecomputeTournamentUseCase, RuntimeProblem, UpsertMatchdaySubmissionUseCase, type EngineRuntimeContext } from '@rankup/rankup/runtime/index.js';
import { stableHash } from '@rankup/rankup/shared/validation/stableHash.js';
import type { EngineMatch, EngineSubmission, EngineTournament } from '@rankup/rankup/runtime/types.js';
import { toCanonicalMockMatchStatus } from './match-status.js';
import type { MockDb } from '../mock-db.js';
import { resolveUser, toMeSummary } from '../mock-db.js';

type RuntimeTournamentView = {
	tournamentId: string;
	status: EngineTournament['status'];
	joinPolicy: EngineTournament['joinPolicy'];
	memberCount: number;
	rulesetId: string;
};

type RuntimeHarness = {
	context: EngineRuntimeContext & {
		tournamentRepo: InMemoryTournamentRepo;
		membershipRepo: InMemoryMembershipRepo;
		submissionRepo: InMemorySubmissionRepo;
		sportsSchedulePort: InMemorySportsSchedulePort;
		scoringRepo: InMemoryScoringRepo;
		eventBusPort: InMemoryEventBusPort;
		clockPort: InMemoryClockPort;
	};
	recomputeUseCase: RecomputeTournamentUseCase;
	joinUseCase: JoinTournamentUseCase;
	upsertUseCase: UpsertMatchdaySubmissionUseCase;
	clearUseCase: ClearMatchdaySubmissionUseCase;
	seededTournamentIds: Set<string>;
};

const runtimeByDb = new WeakMap<MockDb, RuntimeHarness>();
const invitationCodeTournamentMap: Record<string, string> = {
	AB12CD34: 'tournament-1',
};

export function resetEngineMockHarness(db: MockDb): void {
	runtimeByDb.delete(db);
}

function toEngineTournamentStatus(status: TournamentSummary['status'] | undefined): EngineTournament['status'] {
	switch (status) {
		case 'upcoming':
		case 'live':
		case 'finished':
		case 'archived':
		case 'cancelled':
			return status;
		default:
			return 'live';
	}
}

function toSubmissionStatus(submittedCount: number, expectedCount: number): 'missing' | 'partial' | 'complete' {
	if (submittedCount <= 0) {
		return 'missing';
	}
	if (submittedCount >= expectedCount) {
		return 'complete';
	}
	return 'partial';
}

function parseIsoYear(value: string | undefined): string | undefined {
	if (!value) {
		return undefined;
	}
	const epochMs = Date.parse(value);
	if (Number.isNaN(epochMs)) {
		return undefined;
	}
	return new Date(epochMs).getUTCFullYear().toString();
}

function resolveTournamentSeasonId(summary: TournamentSummary, db: MockDb, nowIso: string): string {
	const timingSeasonId = summary.timing?.seasonId?.trim();
	if (timingSeasonId) {
		return timingSeasonId;
	}

	const competitionId = summary.timing?.competitionId;
	if (competitionId) {
		const activeSeasonId = db.competitions.get(competitionId)?.activeSeasonId?.trim();
		if (activeSeasonId) {
			return activeSeasonId;
		}
	}

	return parseIsoYear(summary.timing?.startsAt) ?? parseIsoYear(summary.timing?.endsAt) ?? parseIsoYear(nowIso) ?? 'season-unknown';
}

function toEngineTournament(summary: TournamentSummary, version: number, db: MockDb, nowIso: string): EngineTournament {
	const timing = summary.timing
		? {
			competitionId: summary.timing.competitionId,
			seasonId: resolveTournamentSeasonId(summary, db, nowIso),
			startMatchday: summary.timing.startMatchday,
			endMatchday: summary.timing.endMatchday,
			startsAt: summary.timing.startsAt,
			endsAt: summary.timing.endsAt,
		}
		: undefined;
	return {
		tournamentId: summary.tournamentId,
		sportId: summary.sportId,
		gameModeId: summary.gameModeId,
		rulesetId: summary.rulesetId ?? 'ruleset.scorePrediction.v1',
		status: toEngineTournamentStatus(summary.status),
		joinPolicy: {
			joinMode: summary.joinPolicy.joinMode,
			joinMidSeasonAllowed: summary.joinPolicy.joinMidSeasonAllowed,
			maxPlayers: summary.joinPolicy.maxPlayers,
			locked: summary.joinPolicy.locked,
			joinClosesAt: summary.joinPolicy.joinClosesAt,
		},
		timing,
		version,
	};
}

function toEngineMatch(tournamentId: string, match: TournamentMatch, matchday: number): EngineMatch {
	const home = match.score?.home ?? null;
	const away = match.score?.away ?? null;
	const status: EngineMatch['status'] = toCanonicalMockMatchStatus(match.status);
	return {
		tournamentId,
		matchday,
		matchId: match.matchId,
		scheduledAt: match.scheduledAt,
		lockState: match.lockState === 'locked' ? 'locked' : 'open',
		status,
		score: {
			home,
			away,
		},
		resultFingerprint: stableHash({
			tournamentId,
			matchId: match.matchId,
			status,
			home,
			away,
		}),
	};
}

function createHarness(): RuntimeHarness {
	const context: RuntimeHarness['context'] = {
		tournamentRepo: new InMemoryTournamentRepo(),
		membershipRepo: new InMemoryMembershipRepo(),
		submissionRepo: new InMemorySubmissionRepo(),
		sportsSchedulePort: new InMemorySportsSchedulePort(),
		scoringRepo: new InMemoryScoringRepo(),
		eventBusPort: new InMemoryEventBusPort(),
		idempotencyPort: new InMemoryIdempotencyPort(),
		clockPort: new InMemoryClockPort(),
		idGeneratorPort: new InMemoryIdGeneratorPort(),
		authorizationPort: new InMemoryAuthorizationPort(),
		trustSafetyPort: new InMemoryTrustSafetyPort(),
		processedEventRepo: new InMemoryProcessedEventRepo(),
	};
	return {
		context,
		recomputeUseCase: new RecomputeTournamentUseCase(context),
		joinUseCase: new JoinTournamentUseCase(context),
		upsertUseCase: new UpsertMatchdaySubmissionUseCase(context),
		clearUseCase: new ClearMatchdaySubmissionUseCase(context),
		seededTournamentIds: new Set<string>(),
	};
}

export function getEngineMockHarness(db: MockDb): RuntimeHarness {
	const cached = runtimeByDb.get(db);
	if (cached) {
		return cached;
	}
	const harness = createHarness();
	runtimeByDb.set(db, harness);
	return harness;
}

function ensureFixtureMatchday(matchday: number | undefined): number {
	return 1;
}

function ensureSubmissionSeed(
	submission: EngineSubmission | null,
	matchdayMatches: EngineMatch[],
	userId: string,
	tournamentId: string,
	matchday: number,
	nowIso: string,
): EngineSubmission {
	if (submission) {
		return submission;
	}
	return {
		tournamentId,
		matchday,
		userId,
		version: 1,
		predictions: {},
		completion: {
			submittedCount: 0,
			expectedCount: matchdayMatches.length,
			status: 'missing',
		},
		submissionCompleteAt: null,
		createdAt: nowIso,
		updatedAt: nowIso,
	};
}

async function ensureTournamentSeeded(harness: RuntimeHarness, db: MockDb, tournamentId: string): Promise<void> {
	if (harness.seededTournamentIds.has(tournamentId)) {
		return;
	}

	const nowIso = harness.context.clockPort.nowIso();
	const me = resolveUser(db);
	const dbRecord = db.tournaments.get(tournamentId);
	const fallbackSummary: TournamentSummary = {
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
		createdAt: nowIso,
		updatedAt: nowIso,
		rulesetId: 'ruleset.scorePrediction.v1',
	};
	const summary = dbRecord?.tournament ?? fallbackSummary;
	const existingTournament = await harness.context.tournamentRepo.getById(tournamentId);
	await harness.context.tournamentRepo.save(toEngineTournament(summary, (existingTournament?.version ?? 0) + 1, db, nowIso));

	const rankingUsers = db.ranking.list().map(entry => entry.user.userId);
	const memberUserIds = [...new Set([me.userId, ...rankingUsers])];
	const meRole = dbRecord?.membership.role ?? 'player';
	for (const memberUserId of memberUserIds) {
		await harness.context.membershipRepo.add({
			tournamentId,
			userId: memberUserId,
			role: memberUserId === me.userId ? meRole : 'player',
			joinedAt: dbRecord?.membership.joinedAt ?? nowIso,
		});
	}

	const sourceMatches = db.matches.list();
	const seededMatches: EngineMatch[] = [];
	for (const source of sourceMatches) {
		const fixtureMatchday = ensureFixtureMatchday(source.matchday);
		const seeded = toEngineMatch(tournamentId, source, fixtureMatchday);
		seededMatches.push(seeded);
		await harness.context.sportsSchedulePort.upsertMatchResult(seeded);
	}

	const templateMatches = seededMatches.filter(match => match.matchday === 1).slice(0, 3);
	for (const [index, userId] of memberUserIds.entries()) {
		const predictions =
			userId === me.userId
				? {}
				: Object.fromEntries(
						templateMatches.map((match, matchIndex) => {
							const homeScore = (index + matchIndex) % 3;
							const awayScore = (index + matchIndex + 1) % 3;
							return [
								match.matchId,
								{
									matchId: match.matchId,
									homeScore,
									awayScore,
									submittedAt: nowIso,
									updatedAt: nowIso,
								},
							];
						}),
				  );
		const submittedCount = Object.keys(predictions).length;
		const expectedCount = Math.max(templateMatches.length, 1);
		await harness.context.submissionRepo.save({
			tournamentId,
			matchday: 1,
			userId,
			version: 1,
			predictions,
			completion: {
				submittedCount,
				expectedCount,
				status: toSubmissionStatus(submittedCount, expectedCount),
			},
			submissionCompleteAt: submittedCount > 0 ? nowIso : null,
			createdAt: nowIso,
			updatedAt: nowIso,
		});
	}

	await harness.recomputeUseCase.execute({
		tournamentId,
		reason: 'mock.seed',
	});
	harness.seededTournamentIds.add(tournamentId);
}

async function ensureTournamentSnapshot(harness: RuntimeHarness, tournamentId: string): Promise<void> {
	const latest = await harness.context.scoringRepo.getLatestSnapshot(tournamentId, 'season');
	if (!latest) {
		await harness.recomputeUseCase.execute({
			tournamentId,
			reason: 'mock.recompute',
		});
	}
}

function toRankingEntry(db: MockDb, entry: { position: number; userId: string; points: number; metrics: { exactScores: number; correctOutcomes: number; exactGoalsOneTeam: number } }) {
	return {
		position: entry.position,
		user: toMeSummary(resolveUser(db, entry.userId)),
		points: entry.points,
		metrics: {
			exactScores: entry.metrics.exactScores,
			correctOutcomes: entry.metrics.correctOutcomes,
			exactGoalsOneTeam: entry.metrics.exactGoalsOneTeam,
		},
	};
}

function toRankingState(matches: EngineMatch[]): 'provisional' | 'final' {
	return matches.every(match => match.status === 'final' || match.status === 'void') ? 'final' : 'provisional';
}

function resolveTournamentIdByInvitationCode(db: MockDb, code: string): string | null {
	const normalized = code.trim();
	if (normalized.length === 0) {
		return null;
	}

	const mappedTournamentId = invitationCodeTournamentMap[normalized];
	if (mappedTournamentId && db.tournaments.get(mappedTournamentId)) {
		return mappedTournamentId;
	}

	if (db.tournaments.get(normalized)) {
		return normalized;
	}

	return null;
}

function toJoinTournamentSummary(
	db: MockDb,
	runtime: RuntimeTournamentView,
	tournamentId: string,
	nowIso: string,
): TournamentSummary {
	const seeded = db.tournaments.get(tournamentId)?.tournament;
	if (seeded) {
		return {
			...seeded,
			status: runtime.status,
			joinPolicy: runtime.joinPolicy,
			memberCount: runtime.memberCount,
			rulesetId: runtime.rulesetId,
		};
	}

	return {
		tournamentId,
		name: 'Mock Tournament',
		visibility: 'public',
		discoverability: 'listed',
		verificationStatus: 'community',
		sportId: 'football',
		gameModeId: 'scorePrediction',
		formatId: 'league',
		modality: 'season',
		status: runtime.status,
		joinPolicy: runtime.joinPolicy,
		memberCount: runtime.memberCount,
		createdAt: nowIso,
		updatedAt: nowIso,
		rulesetId: runtime.rulesetId,
	};
}

export async function syncRuntimeTournamentFromDb(db: MockDb, tournamentId: string): Promise<void> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, tournamentId);
	const record = db.tournaments.get(tournamentId);
	if (!record) {
		return;
	}
	const existing = await harness.context.tournamentRepo.getById(tournamentId);
	await harness.context.tournamentRepo.save(toEngineTournament(record.tournament, (existing?.version ?? 0) + 1, db, harness.context.clockPort.nowIso()));
	await harness.recomputeUseCase.execute({
		tournamentId,
		reason: 'mock.tournament.synced',
	});
}

export async function getRuntimeTournamentView(db: MockDb, tournamentId: string): Promise<RuntimeTournamentView> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, tournamentId);
	const tournament = await harness.context.tournamentRepo.getById(tournamentId);
	if (!tournament) {
		return {
			tournamentId,
			status: 'live',
			joinPolicy: {
				joinMode: 'open',
				joinMidSeasonAllowed: true,
				locked: false,
			},
			memberCount: 0,
			rulesetId: 'ruleset.scorePrediction.v1',
		};
	}
	return {
		tournamentId: tournament.tournamentId,
		status: tournament.status,
		joinPolicy: tournament.joinPolicy,
		memberCount: await harness.context.membershipRepo.countByTournament(tournamentId),
		rulesetId: tournament.rulesetId,
	};
}

export async function joinRuntimeTournament(
	db: MockDb,
	params: { tournamentId: string; userId: string; idempotencyKey?: string },
): Promise<{ status: number; response: Record<string, unknown>; headers: Record<string, string> }> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, params.tournamentId);

	const result = await harness.joinUseCase.execute({
		actorId: params.userId,
		tournamentId: params.tournamentId,
		idempotencyKey: params.idempotencyKey,
	});
	const runtime = await getRuntimeTournamentView(db, params.tournamentId);
	const membership = await harness.context.membershipRepo.getByTournamentAndUser(params.tournamentId, params.userId);
	const nowIso = harness.context.clockPort.nowIso();

	return {
		status: result.status,
		response: {
			tournamentId: params.tournamentId,
			joined: result.body.joined,
			membership: {
				role: membership?.role ?? 'player',
				joinedAt: membership?.joinedAt ?? nowIso,
			},
			tournament: toJoinTournamentSummary(db, runtime, params.tournamentId, nowIso),
		},
		headers: { ...result.headers },
	};
}

export async function joinRuntimeTournamentByInvitationCode(
	db: MockDb,
	params: { code: string; userId: string; idempotencyKey?: string },
): Promise<{ status: number; response: Record<string, unknown>; headers: Record<string, string> }> {
	const tournamentId = resolveTournamentIdByInvitationCode(db, params.code);
	if (!tournamentId) {
		throw new RuntimeProblem('notFound', 404, 'Invitation code not found.');
	}

	return joinRuntimeTournament(db, {
		tournamentId,
		userId: params.userId,
		idempotencyKey: params.idempotencyKey,
	});
}

export async function listRuntimeSeasonRanking(db: MockDb, tournamentId: string): Promise<Record<string, unknown>> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, tournamentId);
	await ensureTournamentSnapshot(harness, tournamentId);
	const snapshot = await harness.context.scoringRepo.getLatestSnapshot(tournamentId, 'season');
	const matches = await harness.context.sportsSchedulePort.listTournamentMatchdays(tournamentId);
	const state = snapshot?.state ?? (matches.length > 0 ? 'provisional' : 'final');
	const items =
		snapshot?.entries.map(entry =>
			toRankingEntry(db, {
				position: entry.position,
				userId: entry.userId,
				points: entry.points,
				metrics: {
					exactScores: entry.metrics.exactScores,
					correctOutcomes: entry.metrics.correctOutcomes,
					exactGoalsOneTeam: entry.metrics.exactGoalsOneTeam,
				},
			}),
		) ?? [];
	const meUserId = resolveUser(db).userId;
	return {
		meta: {
			tournamentId,
			scope: 'season',
			state,
			serverTime: harness.context.clockPort.nowIso(),
			computedAt: snapshot?.computedAt ?? harness.context.clockPort.nowIso(),
			totalPlayers: items.length,
		},
		items,
		myEntry: items.find(item => (item as { user: { userId: string } }).user.userId === meUserId),
	};
}

export async function listRuntimeMatchdayRanking(db: MockDb, tournamentId: string, matchday: number): Promise<Record<string, unknown>> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, tournamentId);
	await ensureTournamentSnapshot(harness, tournamentId);
	const snapshot = await harness.context.scoringRepo.getLatestSnapshot(tournamentId, 'matchday', matchday);
	const matches = await harness.context.sportsSchedulePort.listMatchdayMatches(tournamentId, matchday);
	const state = snapshot?.state ?? toRankingState(matches);
	const items =
		snapshot?.entries.map(entry =>
			toRankingEntry(db, {
				position: entry.position,
				userId: entry.userId,
				points: entry.points,
				metrics: {
					exactScores: entry.metrics.exactScores,
					correctOutcomes: entry.metrics.correctOutcomes,
					exactGoalsOneTeam: entry.metrics.exactGoalsOneTeam,
				},
			}),
		) ?? [];
	const meUserId = resolveUser(db).userId;
	return {
		meta: {
			tournamentId,
			scope: 'matchday',
			matchday,
			state,
			serverTime: harness.context.clockPort.nowIso(),
			computedAt: snapshot?.computedAt ?? harness.context.clockPort.nowIso(),
			totalPlayers: items.length,
		},
		items,
		myEntry: items.find(item => (item as { user: { userId: string } }).user.userId === meUserId),
	};
}

export async function getRuntimeRankingWindow(
	db: MockDb,
	params: { tournamentId: string; matchday?: number; userId: string; scope: 'season' | 'matchday' },
): Promise<Record<string, unknown>> {
	const page =
		params.scope === 'season'
			? await listRuntimeSeasonRanking(db, params.tournamentId)
			: await listRuntimeMatchdayRanking(db, params.tournamentId, params.matchday ?? 1);
	const items = (page.items as Array<Record<string, unknown>>) ?? [];
	const center =
		items.find(item => (item.user as { userId: string }).userId === params.userId) ??
		items[0] ??
		{
			position: 1,
			user: toMeSummary(resolveUser(db, params.userId)),
			points: 0,
		};
	return {
		meta: page.meta,
		center,
		items: items.slice(0, 5),
	};
}

export async function getRuntimeMatchdaySubmission(
	db: MockDb,
	params: { tournamentId: string; matchday: number; userId: string; scope: 'me' | 'other' },
): Promise<Record<string, unknown>> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, params.tournamentId);
	const matchdayMatches = await harness.context.sportsSchedulePort.listMatchdayMatches(params.tournamentId, params.matchday);
	const nowIso = harness.context.clockPort.nowIso();
	const submission = ensureSubmissionSeed(
		await harness.context.submissionRepo.getByTournamentMatchdayUser(params.tournamentId, params.matchday, params.userId),
		matchdayMatches,
		params.userId,
		params.tournamentId,
		params.matchday,
		nowIso,
	);
	if (!(await harness.context.submissionRepo.getByTournamentMatchdayUser(params.tournamentId, params.matchday, params.userId))) {
		await harness.context.submissionRepo.save(submission);
	}
	return {
		submissionId: `subm-${params.tournamentId}-${params.matchday}-${params.userId}`,
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		userId: params.userId,
		gameModeId: 'scorePrediction',
		serverTime: nowIso,
		scope: params.scope,
		visibility: 'visible',
		completion: submission.completion,
		createdAt: submission.createdAt,
		updatedAt: submission.updatedAt,
		predictions: Object.values(submission.predictions).map(prediction => {
			const match = matchdayMatches.find(item => item.matchId === prediction.matchId);
			return {
				matchId: prediction.matchId,
				visibility: 'visible',
				isSubmitted: true,
				homeScore: prediction.homeScore,
				awayScore: prediction.awayScore,
				lockState: match?.lockState ?? 'open',
				lockAt: match?.scheduledAt,
				submittedAt: prediction.submittedAt,
				updatedAt: prediction.updatedAt,
			};
		}),
	};
}

export async function upsertRuntimeMatchdaySubmission(
	db: MockDb,
	params: { tournamentId: string; matchday: number; userId: string; body: { upserts?: Array<{ matchId: string; homeScore: number; awayScore: number }>; removes?: string[] } },
): Promise<{ response: Record<string, unknown>; headers: Record<string, string> }> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, params.tournamentId);
	const response = await harness.upsertUseCase.execute({
		actorId: params.userId,
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		upserts: params.body.upserts,
		removes: params.body.removes,
	});
	await harness.recomputeUseCase.execute({
		tournamentId: params.tournamentId,
		reason: 'mock.submission.upserted',
	});
	const submission = await getRuntimeMatchdaySubmission(db, {
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		userId: params.userId,
		scope: 'me',
	});
	return {
		response: {
			submission,
			applied: response.body.applied,
			rejected: response.body.rejected,
		},
		headers: { ...response.headers },
	};
}

export async function clearRuntimeMatchdaySubmission(
	db: MockDb,
	params: { tournamentId: string; matchday: number; userId: string; idempotencyKey?: string },
): Promise<void> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, params.tournamentId);
	await harness.clearUseCase.execute({
		actorId: params.userId,
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		idempotencyKey: params.idempotencyKey,
	});
	await harness.recomputeUseCase.execute({
		tournamentId: params.tournamentId,
		reason: 'mock.submission.cleared',
	});
}

export async function listRuntimeMatchdaySubmissions(
	db: MockDb,
	params: { tournamentId: string; matchday: number },
): Promise<Record<string, unknown>> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, params.tournamentId);
	const items = await harness.context.submissionRepo.listByTournamentMatchday(params.tournamentId, params.matchday);
	return {
		serverTime: harness.context.clockPort.nowIso(),
		items: items.map(submission => ({
			user: toMeSummary(resolveUser(db, submission.userId)),
			status: submission.completion.status,
			completion: submission.completion,
			lastUpdatedAt: submission.updatedAt,
		})),
	};
}

export async function getRuntimeMatchdayResults(
	db: MockDb,
	params: { tournamentId: string; matchday: number; userId: string },
): Promise<Record<string, unknown>> {
	const harness = getEngineMockHarness(db);
	await ensureTournamentSeeded(harness, db, params.tournamentId);
	const tournament = await harness.context.tournamentRepo.getById(params.tournamentId);
	const ruleset = resolveRulesetDefinition(
		tournament?.gameModeId ?? 'scorePrediction',
		tournament?.rulesetId ?? 'ruleset.scorePrediction.v1',
	);
	const matches = await harness.context.sportsSchedulePort.listMatchdayMatches(params.tournamentId, params.matchday);
	const submission = await harness.context.submissionRepo.getByTournamentMatchdayUser(params.tournamentId, params.matchday, params.userId);
	const lines = matches.map(match => {
		const prediction = submission?.predictions[match.matchId];
		const evaluation = evaluateScorePrediction(
			ruleset,
			prediction
				? {
					homeScore: prediction.homeScore,
					awayScore: prediction.awayScore,
				}
				: null,
			{
				home: match.score.home,
				away: match.score.away,
				status: match.status,
				finalOutcomeType: match.finalOutcomeType,
			},
		);
		return {
			matchId: match.matchId,
			prediction: prediction
				? {
					homeScore: prediction.homeScore,
					awayScore: prediction.awayScore,
					visibility: 'visible',
				}
				: undefined,
			actualScore: {
				home: match.score.home,
				away: match.score.away,
			},
			points: evaluation.points,
			state: evaluation.state,
			breakdown: evaluation.breakdown,
		};
	});
	const totalPoints = lines.reduce((sum, line) => sum + (line.points ?? 0), 0);
	const state = lines.every(line => line.state === 'final' || line.state === 'void') ? 'final' : 'provisional';
	return {
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		gameModeId: 'scorePrediction',
		user: toMeSummary(resolveUser(db, params.userId)),
		serverTime: harness.context.clockPort.nowIso(),
		state,
		totalPoints,
		pointsState: state,
		lines,
	};
}

export async function getRuntimeMatchdayResultsSummary(
	db: MockDb,
	params: { tournamentId: string; matchday: number },
): Promise<Record<string, unknown>> {
	const ranking = await listRuntimeMatchdayRanking(db, params.tournamentId, params.matchday);
	const items = ((ranking.items as Array<Record<string, unknown>>) ?? []).slice(0, 3);
	return {
		tournamentId: params.tournamentId,
		matchday: params.matchday,
		serverTime: (ranking.meta as { serverTime: string }).serverTime,
		state: (ranking.meta as { state: string }).state,
		topPerformers: items.map(item => ({
			position: item.position,
			user: item.user,
			points: item.points,
		})),
	};
}

export async function listRuntimeTournamentUpdates(
	db: MockDb,
	params: { tournamentId: string; matchday?: number },
): Promise<Record<string, unknown>> {
	const matchday = params.matchday ?? 1;
	const ranking = await listRuntimeMatchdayRanking(db, params.tournamentId, matchday);
	const deltas = ((ranking.items as Array<Record<string, unknown>>) ?? []).slice(0, 3).map(item => ({
		userId: (item.user as { userId: string }).userId,
		oldPosition: Number(item.position) + 1,
		newPosition: item.position,
		pointsDelta: 0,
		totalPoints: item.points,
	}));
	return {
		serverTime: (ranking.meta as { serverTime: string }).serverTime,
		events: [
			{
				type: 'ranking.delta',
				tournamentId: params.tournamentId,
				scope: 'matchday',
				matchday,
				serverTime: (ranking.meta as { serverTime: string }).serverTime,
				deltas,
			},
		],
		nextCursor: `cursor-${Date.now()}`,
	};
}

export async function streamRuntimeTournamentLive(
	db: MockDb,
	params: { tournamentId: string; matchday?: number },
): Promise<string> {
	const page = await listRuntimeTournamentUpdates(db, params);
	const event = (page.events as Array<Record<string, unknown>>)[0] ?? {
		type: 'ranking.delta',
		tournamentId: params.tournamentId,
		scope: 'matchday',
		matchday: params.matchday ?? 1,
		serverTime: new Date().toISOString(),
		deltas: [],
	};
	return `event: update\ndata: ${JSON.stringify(event)}\n\n`;
}
