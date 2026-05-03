import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPersistentRuntimeAdapters } from '../src/adapters/persistent/index.js';
import { stableHash } from '../src/shared/validation/stableHash.js';
import { RuntimeProblem } from '../src/runtime/errors.js';
import { ApplyMatchFinishedUseCase, InMemoryAuthorizationPort, InMemoryClockPort, InMemoryEventBusPort, InMemoryIdGeneratorPort, InMemoryMembershipRepo, InMemorySportsSchedulePort, InMemoryTrustSafetyPort, JoinTournamentUseCase, RecomputeTournamentUseCase, UpsertMatchdaySubmissionUseCase, type EngineRuntimeContext, type EngineMatch, type EngineMembership, type EngineSubmission, type EngineTournament, type IdempotencyScope } from '../src/runtime/index.js';
import { BASE_NOW, baseMatch, baseMembership, baseSubmission, baseTournament, createRuntimeContext } from './testkit/runtime-fixtures.js';
import { describe, expect, it } from 'vitest';

type RuntimeContextForParity = EngineRuntimeContext & {
	eventBusPort: InMemoryEventBusPort;
	clockPort: InMemoryClockPort;
};

function joinIdempotencyScope(): IdempotencyScope {
	return {
		actorId: 'user-b',
		operationId: 'joinTournament',
		resourceKey: 'tournament-1',
		idempotencyKey: 'join-key-persistent',
	};
}

function sportsEventDedupeKey(eventId: string): string {
	return stableHash({
		kind: 'sports-event',
		eventId,
		tournamentId: 'tournament-1',
	});
}

async function expectRuntimeProblem(action: () => Promise<unknown>): Promise<RuntimeProblem> {
	try {
		await action();
		throw new Error('Expected RuntimeProblem to be thrown.');
	} catch (error) {
		expect(error).toBeInstanceOf(RuntimeProblem);
		return error as RuntimeProblem;
	}
}

function requireValue<T>(value: T | null | undefined, message: string): T {
	if (value === null || value === undefined) {
		throw new Error(message);
	}
	return value;
}

async function withTemporaryDirectory<TResult>(run: (directory: string) => Promise<TResult>): Promise<TResult> {
	const directory = await mkdtemp(join(tmpdir(), 'rankup-engine-persistent-'));
	try {
		return await run(directory);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
}

function createPersistentContext(directory: string, seed?: {
	tournaments?: ReadonlyArray<EngineTournament>;
	submissions?: ReadonlyArray<EngineSubmission>;
	memberships?: ReadonlyArray<EngineMembership>;
	matches?: ReadonlyArray<EngineMatch>;
}): RuntimeContextForParity {
	const persistentAdapters = createPersistentRuntimeAdapters({
		baseDir: directory,
		seed: {
			tournaments: seed?.tournaments,
			submissions: seed?.submissions,
		},
	});
	const clockPort = new InMemoryClockPort(new Date(BASE_NOW));
	return {
		tournamentRepo: persistentAdapters.tournamentRepo,
		membershipRepo: new InMemoryMembershipRepo(seed?.memberships ?? []),
		submissionRepo: persistentAdapters.submissionRepo,
		sportsSchedulePort: new InMemorySportsSchedulePort(seed?.matches ?? []),
		scoringRepo: persistentAdapters.scoringRepo,
		eventBusPort: new InMemoryEventBusPort(),
		idempotencyPort: persistentAdapters.idempotencyPort,
		clockPort,
		idGeneratorPort: new InMemoryIdGeneratorPort(),
		authorizationPort: new InMemoryAuthorizationPort(),
		trustSafetyPort: new InMemoryTrustSafetyPort(),
		processedEventRepo: persistentAdapters.processedEventRepo,
	};
}

async function runParityScenario(context: RuntimeContextForParity): Promise<string> {
	const joinUseCase = new JoinTournamentUseCase(context);
	const firstJoin = await joinUseCase.execute({
		actorId: 'user-b',
		tournamentId: 'tournament-1',
		idempotencyKey: joinIdempotencyScope().idempotencyKey,
		requestId: 'req-join-first',
	});

	const upsertUseCase = new UpsertMatchdaySubmissionUseCase(context);
	const firstUpsert = await upsertUseCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		requestId: 'req-upsert-first',
	});
	const firstEtag = firstUpsert.headers.ETag ?? '';

	const secondUpsert = await upsertUseCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		ifMatch: firstEtag,
		upserts: [{ matchId: 'match-1', homeScore: 2, awayScore: 1 }],
		requestId: 'req-upsert-second',
	});

	const staleIfMatchError = await expectRuntimeProblem(() =>
		upsertUseCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			ifMatch: firstEtag,
			upserts: [{ matchId: 'match-1', homeScore: 3, awayScore: 2 }],
			requestId: 'req-upsert-stale',
		}),
	);

	await context.tournamentRepo.save(
		baseTournament({
			joinPolicy: {
				joinMode: 'open',
				joinMidSeasonAllowed: true,
				locked: true,
			},
			version: 2,
		}),
	);

	const replayedJoin = await joinUseCase.execute({
		actorId: 'user-b',
		tournamentId: 'tournament-1',
		idempotencyKey: joinIdempotencyScope().idempotencyKey,
		requestId: 'req-join-replay',
	});

	const applyUseCase = new ApplyMatchFinishedUseCase(context);
	const firstApply = await applyUseCase.execute({
		eventId: 'evt-parity-persistent-1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 2,
		away: 1,
		finalOutcomeType: 'extra_time',
		requestId: 'req-apply-first',
	});
	const replayedApply = await applyUseCase.execute({
		eventId: 'evt-parity-persistent-1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 2,
		away: 1,
		finalOutcomeType: 'extra_time',
		requestId: 'req-apply-replay',
	});

	const recomputeUseCase = new RecomputeTournamentUseCase(context);
	await recomputeUseCase.execute({
		tournamentId: 'tournament-1',
		reason: 'test.persistent.adapters.parity',
		requestId: 'req-recompute-parity',
	});

	const finalSubmission = requireValue(
		await context.submissionRepo.getByTournamentMatchdayUser('tournament-1', 1, 'user-a'),
		'Expected final submission to exist after parity scenario.',
	);

	const payload = {
		join: {
			firstStatus: firstJoin.status,
			firstJoined: firstJoin.body.joined,
			replayedStatus: replayedJoin.status,
			replayedJoined: replayedJoin.body.joined,
		},
		upsert: {
			firstStatus: firstUpsert.status,
			secondStatus: secondUpsert.status,
			firstEtag,
			secondEtag: secondUpsert.headers.ETag ?? null,
			staleIfMatchCode: staleIfMatchError.problem.code,
			staleIfMatchStatus: staleIfMatchError.problem.status,
			finalSubmissionVersion: finalSubmission.version,
		},
		apply: {
			firstProcessed: firstApply.body.processed,
			replayedProcessed: replayedApply.body.processed,
		},
		snapshots: await context.scoringRepo.listSnapshots('tournament-1'),
		eventTypes: context.eventBusPort.listEvents().map(event => event.type),
	};

	return `${JSON.stringify(payload)}\n`;
}

describe('engine persistent adapters', () => {
	it('keeps idempotency + dedupe + ETag semantics byte-equivalent to in-memory baseline', async () => {
		const baselineContext = createRuntimeContext({
			memberships: [baseMembership('user-a')],
			matches: [baseMatch('match-1', 1)],
		});
		const baselinePayload = await runParityScenario(baselineContext);

		await withTemporaryDirectory(async directory => {
			const persistentContext = createPersistentContext(directory, {
				tournaments: [baseTournament()],
				memberships: [baseMembership('user-a')],
				matches: [baseMatch('match-1', 1)],
			});
			const persistentPayload = await runParityScenario(persistentContext);

			expect(persistentPayload).toBe(baselinePayload);
			expect(Buffer.from(persistentPayload, 'utf8').equals(Buffer.from(baselinePayload, 'utf8'))).toBe(true);
		});
	});

	it('persists tournament/submission/idempotency/dedupe/snapshots across adapter recreation', async () => {
		await withTemporaryDirectory(async directory => {
			const firstContext = createPersistentContext(directory, {
				tournaments: [baseTournament()],
				memberships: [baseMembership('user-a')],
				matches: [baseMatch('match-1', 1)],
			});
			await runParityScenario(firstContext);

			const secondContext = createPersistentContext(directory, {
				memberships: [baseMembership('user-a')],
				matches: [baseMatch('match-1', 1)],
			});

			const tournament = requireValue(await secondContext.tournamentRepo.getById('tournament-1'), 'Expected persisted tournament to exist.');
			expect(tournament.version).toBeGreaterThanOrEqual(2);
			expect(tournament.joinPolicy.locked).toBe(true);

			const submission = requireValue(
				await secondContext.submissionRepo.getByTournamentMatchdayUser('tournament-1', 1, 'user-a'),
				'Expected persisted submission to exist.',
			);
			expect(submission.version).toBeGreaterThanOrEqual(2);

			const idempotencyOutcome = await secondContext.idempotencyPort.get(joinIdempotencyScope());
			expect(idempotencyOutcome).not.toBeNull();
			expect(idempotencyOutcome?.status).toBe(201);

			const dedupeClaimExists = await secondContext.processedEventRepo.has(sportsEventDedupeKey('evt-parity-persistent-1'));
			expect(dedupeClaimExists).toBe(true);

			const snapshots = await secondContext.scoringRepo.listSnapshots('tournament-1');
			expect(snapshots.length).toBeGreaterThan(0);
		});
	});

	it('enforces compare-and-set semantics on persistent submission repo under concurrent writers', async () => {
		await withTemporaryDirectory(async directory => {
			const seedSubmission = baseSubmission('user-c', 1, {
				'match-1': {
					matchId: 'match-1',
					homeScore: 1,
					awayScore: 0,
					submittedAt: BASE_NOW,
					updatedAt: BASE_NOW,
				},
			});
			const adapters = createPersistentRuntimeAdapters({
				baseDir: directory,
				seed: {
					submissions: [seedSubmission],
				},
			});

			const updateA: EngineSubmission = {
				...seedSubmission,
				version: seedSubmission.version + 1,
				predictions: {
					'match-1': {
						...seedSubmission.predictions['match-1'],
						homeScore: 2,
						awayScore: 1,
						updatedAt: '2026-02-06T11:00:00.000Z',
					},
				},
				updatedAt: '2026-02-06T11:00:00.000Z',
			};
			const updateB: EngineSubmission = {
				...seedSubmission,
				version: seedSubmission.version + 1,
				predictions: {
					'match-1': {
						...seedSubmission.predictions['match-1'],
						homeScore: 3,
						awayScore: 2,
						updatedAt: '2026-02-06T11:00:01.000Z',
					},
				},
				updatedAt: '2026-02-06T11:00:01.000Z',
			};

			const [resultA, resultB] = await Promise.all([
				adapters.submissionRepo.saveIfVersion(updateA, seedSubmission.version),
				adapters.submissionRepo.saveIfVersion(updateB, seedSubmission.version),
			]);

			expect([resultA, resultB].filter(Boolean)).toHaveLength(1);

			const finalSubmission = requireValue(
				await adapters.submissionRepo.getByTournamentMatchdayUser(seedSubmission.tournamentId, seedSubmission.matchday, seedSubmission.userId),
				'Expected persisted submission after concurrent compare-and-set updates.',
			);
			expect(finalSubmission.version).toBe(seedSubmission.version + 1);

			const finalPrediction = finalSubmission.predictions['match-1'];
			expect(finalPrediction).toBeDefined();
			const finalScoreline = `${finalPrediction.homeScore}:${finalPrediction.awayScore}`;
			expect(['2:1', '3:2']).toContain(finalScoreline);
		});
	});
});
