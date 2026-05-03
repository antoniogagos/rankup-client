import { isMatchLocked } from '../src/algorithms/lockRules/index.js';
import { evaluateScorePrediction } from '../src/algorithms/scoring/index.js';
import { compareRankingCandidates } from '../src/algorithms/tieBreakers/index.js';
import { resolveRulesetDefinition } from '../src/registry/index.js';
import { RuntimeProblem } from '../src/runtime/errors.js';
import type { MembershipRepo } from '../src/runtime/index.js';
import { ApplyMatchFinishedUseCase, CancelTournamentUseCase, ClearMatchdaySubmissionUseCase, EvaluateTournamentLifecycleUseCase, InMemoryAuthorizationPort, InMemoryTrustSafetyPort, JoinTournamentUseCase, RecomputeTournamentUseCase, UpsertMatchdaySubmissionUseCase, createRequestFingerprint } from '../src/runtime/index.js';
import type { EngineRankingSnapshot } from '../src/runtime/types.js';
import { BASE_NOW, baseMatch, baseMembership, baseSubmission, baseTournament, createRuntimeContext } from './testkit/runtime-fixtures.js';
import { describe, expect, it } from 'vitest';

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

function createDeferred(): { promise: Promise<void>; resolve: () => void } {
	let resolve!: () => void;
	const promise = new Promise<void>(innerResolve => {
		resolve = innerResolve;
	});
	return { promise, resolve };
}

function normalizeSnapshot(snapshot: EngineRankingSnapshot | null | undefined): Omit<EngineRankingSnapshot, 'snapshotId' | 'parentSnapshotId' | 'computedAt' | 'reason'> {
	const safeSnapshot = requireValue(snapshot, 'Expected snapshot to exist.');
	return {
		tournamentId: safeSnapshot.tournamentId,
		scope: safeSnapshot.scope,
		matchday: safeSnapshot.matchday,
		state: safeSnapshot.state,
		rulesetId: safeSnapshot.rulesetId,
		entries: safeSnapshot.entries.map(entry => ({
			position: entry.position,
			userId: entry.userId,
			points: entry.points,
			metrics: {
				exactScores: entry.metrics.exactScores,
				correctOutcomes: entry.metrics.correctOutcomes,
				exactGoalsOneTeam: entry.metrics.exactGoalsOneTeam,
				earliestSubmission: entry.metrics.earliestSubmission,
				randomSeed: entry.metrics.randomSeed,
			},
		})),
	};
}

describe('engine runtime', () => {

it('idempotent join keeps same response after state changes', async () => {
	const context = createRuntimeContext();
	const useCase = new JoinTournamentUseCase(context);
	const first = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		idempotencyKey: 'join-key-1',
	});
	expect(first.status).toBe(201);
	expect(first.body.joined).toBe(true);

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

	const retried = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		idempotencyKey: 'join-key-1',
	});
	expect(retried.status).toBe(first.status);
	expect(retried.body).toEqual(first.body);
});

it('join surfaces malformed idempotency outcomes as idempotencyOutcomeInvalid', async () => {
	const context = createRuntimeContext();
	const useCase = new JoinTournamentUseCase(context);

	await context.idempotencyPort.set(
		{
			actorId: 'user-a',
			operationId: 'joinTournament',
			resourceKey: 'tournament-1',
			idempotencyKey: 'join-key-invalid-problem',
		},
		{
			requestFingerprint: createRequestFingerprint({
				tournamentId: 'tournament-1',
				actorId: 'user-a',
			}),
			status: 409,
			body: { code: 'unexpected' },
			headers: {},
		},
	);

	const runtimeError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			idempotencyKey: 'join-key-invalid-problem',
			requestId: 'req-join-invalid-problem',
		}),
	);
	expect(runtimeError.problem.code).toBe('idempotencyOutcomeInvalid');
	expect(runtimeError.problem.status).toBe(500);
	expect(runtimeError.problem.requestId).toBe('req-join-invalid-problem');
});

it('clear submission surfaces malformed idempotency outcomes as idempotencyOutcomeInvalid', async () => {
	const context = createRuntimeContext();
	const useCase = new ClearMatchdaySubmissionUseCase(context);

	await context.idempotencyPort.set(
		{
			actorId: 'user-a',
			operationId: 'clearMatchdaySubmission',
			resourceKey: 'tournament-1:1',
			idempotencyKey: 'clear-key-invalid-problem',
		},
		{
			requestFingerprint: createRequestFingerprint({
				tournamentId: 'tournament-1',
				matchday: 1,
				actorId: 'user-a',
			}),
			status: 404,
			body: { code: 'unexpected' },
			headers: {},
		},
	);

	const runtimeError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'clear-key-invalid-problem',
			requestId: 'req-clear-invalid-problem',
		}),
	);
	expect(runtimeError.problem.code).toBe('idempotencyOutcomeInvalid');
	expect(runtimeError.problem.status).toBe(500);
	expect(runtimeError.problem.requestId).toBe('req-clear-invalid-problem');
});

it('upsert submission surfaces malformed idempotency outcomes as idempotencyOutcomeInvalid', async () => {
	const context = createRuntimeContext();
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	await context.idempotencyPort.set(
		{
			actorId: 'user-a',
			operationId: 'upsertMatchdaySubmission',
			resourceKey: 'tournament-1:1',
			idempotencyKey: 'upsert-key-invalid-problem',
		},
		{
			requestFingerprint: createRequestFingerprint({
				tournamentId: 'tournament-1',
				matchday: 1,
				upserts: [],
				removes: [],
				ifMatch: null,
			}),
			status: 422,
			body: { code: 'unexpected' },
			headers: {},
		},
	);

	const runtimeError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'upsert-key-invalid-problem',
			requestId: 'req-upsert-invalid-problem',
		}),
	);
	expect(runtimeError.problem.code).toBe('idempotencyOutcomeInvalid');
	expect(runtimeError.problem.status).toBe(500);
	expect(runtimeError.problem.requestId).toBe('req-upsert-invalid-problem');
});

it('evaluate lifecycle returns notFound when tournament does not exist', async () => {
	const context = createRuntimeContext({ tournaments: [] });
	const useCase = new EvaluateTournamentLifecycleUseCase(context);

	const runtimeError = await expectRuntimeProblem(() =>
		useCase.execute({
			tournamentId: 'tournament-missing',
			requestId: 'req-lifecycle-missing',
		}),
	);
	expect(runtimeError.problem.code).toBe('notFound');
	expect(runtimeError.problem.status).toBe(404);
	expect(runtimeError.problem.requestId).toBe('req-lifecycle-missing');
});

it('idempotent join replays deterministic 409 outcome after state changes', async () => {
	const context = createRuntimeContext({
		tournaments: [
			baseTournament({
				joinPolicy: {
					joinMode: 'open',
					joinMidSeasonAllowed: true,
					locked: true,
				},
			}),
		],
	});
	const useCase = new JoinTournamentUseCase(context);

	const firstError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			idempotencyKey: 'join-key-locked',
			requestId: 'req-join-1',
		}),
	);
	expect(firstError.problem.code).toBe('tournamentLocked');
	expect(firstError.problem.status).toBe(409);

	await context.tournamentRepo.save(
		baseTournament({
			joinPolicy: {
				joinMode: 'open',
				joinMidSeasonAllowed: true,
				locked: false,
			},
			version: 2,
		}),
	);

	const replayedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			idempotencyKey: 'join-key-locked',
			requestId: 'req-join-2',
		}),
	);
	expect(replayedError.problem.code).toBe(firstError.problem.code);
	expect(replayedError.problem.status).toBe(firstError.problem.status);
	expect(replayedError.problem.detail).toBe(firstError.problem.detail);
	expect(replayedError.problem.requestId).toBe(firstError.problem.requestId);
});

it('join blocks finished tournaments with joinClosed', async () => {
	const context = createRuntimeContext({
		tournaments: [baseTournament({ status: 'finished' })],
	});
	const useCase = new JoinTournamentUseCase(context);

	const closedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
		}),
	);
	expect(closedError.problem.code).toBe('joinClosed');
	expect(closedError.problem.status).toBe(409);
});

it('join maps archived and cancelled states to explicit conflict codes', async () => {
	const archivedContext = createRuntimeContext({
		tournaments: [baseTournament({ status: 'archived' })],
	});
	const archivedUseCase = new JoinTournamentUseCase(archivedContext);
	const archivedError = await expectRuntimeProblem(() =>
		archivedUseCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
		}),
	);
	expect(archivedError.problem.code).toBe('tournamentArchived');
	expect(archivedError.problem.status).toBe(409);

	const cancelledContext = createRuntimeContext({
		tournaments: [baseTournament({ status: 'cancelled' })],
	});
	const cancelledUseCase = new JoinTournamentUseCase(cancelledContext);
	const cancelledError = await expectRuntimeProblem(() =>
		cancelledUseCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
		}),
	);
	expect(cancelledError.problem.code).toBe('tournamentCancelled');
	expect(cancelledError.problem.status).toBe(409);
});

it('join maps closed join window and full capacity to explicit conflict codes', async () => {
	const closedWindowContext = createRuntimeContext({
		tournaments: [
			baseTournament({
				joinPolicy: {
					joinMode: 'open',
					joinMidSeasonAllowed: true,
					locked: false,
					joinClosesAt: '2026-02-06T09:59:59.000Z',
				},
			}),
		],
	});
	const closedWindowUseCase = new JoinTournamentUseCase(closedWindowContext);
	const closedWindowError = await expectRuntimeProblem(() =>
		closedWindowUseCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
		}),
	);
	expect(closedWindowError.problem.code).toBe('joinClosed');
	expect(closedWindowError.problem.status).toBe(409);

	const fullContext = createRuntimeContext({
		tournaments: [
			baseTournament({
				joinPolicy: {
					joinMode: 'open',
					joinMidSeasonAllowed: true,
					locked: false,
					maxPlayers: 1,
				},
			}),
		],
		memberships: [baseMembership('user-existing')],
	});
	const fullUseCase = new JoinTournamentUseCase(fullContext);
	const fullError = await expectRuntimeProblem(() =>
		fullUseCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
		}),
	);
	expect(fullError.problem.code).toBe('tournamentFull');
	expect(fullError.problem.status).toBe(409);
});

it('join returns forbiddenRole when authorization policy denies the action', async () => {
	const context = createRuntimeContext();
	context.authorizationPort = new InMemoryAuthorizationPort({
		denyActions: new Set(['joinTournament']),
	});
	const useCase = new JoinTournamentUseCase(context);

	const forbiddenError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
		}),
	);
	expect(forbiddenError.problem.code).toBe('forbiddenRole');
	expect(forbiddenError.problem.status).toBe(403);
});

it('join can be blocked by trust-safety policy', async () => {
	const context = createRuntimeContext();
	context.trustSafetyPort = new InMemoryTrustSafetyPort({
		blockedActorIds: new Set(['user-trust-blocked']),
	});
	const useCase = new JoinTournamentUseCase(context);

	const blockedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-trust-blocked',
			tournamentId: 'tournament-1',
		}),
	);
	expect(blockedError.problem.code).toBe('forbiddenRole');
	expect(blockedError.problem.status).toBe(403);
});

it('concurrent join race keeps a single membership for the same user', async () => {
	const context = createRuntimeContext();
	const delegatedMembershipRepo = context.membershipRepo;
	const addBarrier = createDeferred();
	const bothAddsReached = createDeferred();
	let pendingAdds = 0;

	const adversarialMembershipRepo: MembershipRepo = {
		getByTournamentAndUser: (tournamentId, userId) => delegatedMembershipRepo.getByTournamentAndUser(tournamentId, userId),
		countByTournament: tournamentId => delegatedMembershipRepo.countByTournament(tournamentId),
		listByTournament: tournamentId => delegatedMembershipRepo.listByTournament(tournamentId),
		add: async membership => {
			pendingAdds += 1;
			if (pendingAdds === 2) {
				bothAddsReached.resolve();
			}
			await addBarrier.promise;
			return delegatedMembershipRepo.add(membership);
		},
	};
	context.membershipRepo = adversarialMembershipRepo;

	const useCase = new JoinTournamentUseCase(context);
	const firstJoinPromise = useCase.execute({
		actorId: 'user-race',
		tournamentId: 'tournament-1',
		requestId: 'req-race-1',
	});
	const secondJoinPromise = useCase.execute({
		actorId: 'user-race',
		tournamentId: 'tournament-1',
		requestId: 'req-race-2',
	});

	await bothAddsReached.promise;
	addBarrier.resolve();

	const [firstJoin, secondJoin] = await Promise.all([firstJoinPromise, secondJoinPromise]);
	const memberships = await context.membershipRepo.listByTournament('tournament-1');
	const raceMemberships = memberships.filter(membership => membership.userId === 'user-race');

	expect(raceMemberships).toHaveLength(1);
	expect([firstJoin.status, secondJoin.status].sort((left, right) => left - right)).toEqual([200, 201]);
	expect([firstJoin.body.joined, secondJoin.body.joined].filter(Boolean)).toHaveLength(1);
	expect(firstJoin.body.memberCount).toBe(1);
	expect(secondJoin.body.memberCount).toBe(1);

	const joinEvents = context.eventBusPort.listEvents().filter(event => event.type === 'tournament.member_joined' && event.payload.userId === 'user-race');
	expect(joinEvents).toHaveLength(1);
});

it('join event propagates request, correlation, and causation metadata', async () => {
	const context = createRuntimeContext();
	const useCase = new JoinTournamentUseCase(context);

	await useCase.execute({
		actorId: 'user-meta',
		tournamentId: 'tournament-1',
		requestId: 'req-join-meta',
		correlationId: 'corr-join-meta',
		causationId: 'cause-join-meta',
	});

	const joinEvent = requireValue(
		context.eventBusPort.listEvents().find(event => event.type === 'tournament.member_joined' && event.payload.userId === 'user-meta'),
		'Expected join event for user-meta.',
	);
	expect(joinEvent.requestId).toBe('req-join-meta');
	expect(joinEvent.correlationId).toBe('corr-join-meta');
	expect(joinEvent.causationId).toBe('cause-join-meta');
	expect(joinEvent.payload).toEqual(
		expect.objectContaining({
			actorId: 'user-meta',
			actorRole: 'player',
			authorization: expect.objectContaining({
				policyId: 'adr0067.roles-permissions.v1',
				membershipRequired: false,
				membershipRole: null,
			}),
			trustSafety: expect.objectContaining({
				policyId: 'adr0067.trust-safety.v1',
				blockedByActorList: false,
				blockedByActionList: false,
				blockedByActorActionList: false,
			}),
		}),
	);
});

it('idempotency key reuse with different payload returns 409', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1), baseMatch('match-2', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		idempotencyKey: 'subm-key-1',
		upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
	});

	const conflictError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'subm-key-1',
			upserts: [{ matchId: 'match-2', homeScore: 2, awayScore: 0 }],
		}),
	);
	expect(conflictError.problem.code).toBe('idempotencyKeyReused');
	expect(conflictError.problem.status).toBe(409);
});

it('idempotent upsert replays deterministic 403 outcome after membership changes', async () => {
	const context = createRuntimeContext({
		matches: [baseMatch('match-1', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	const firstError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'subm-key-not-member',
			requestId: 'req-upsert-1',
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		}),
	);
	expect(firstError.problem.code).toBe('notMember');
	expect(firstError.problem.status).toBe(403);

	await context.membershipRepo.add(baseMembership('user-a'));
	const replayedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'subm-key-not-member',
			requestId: 'req-upsert-2',
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		}),
	);
	expect(replayedError.problem.code).toBe(firstError.problem.code);
	expect(replayedError.problem.status).toBe(firstError.problem.status);
	expect(replayedError.problem.detail).toBe(firstError.problem.detail);
	expect(replayedError.problem.requestId).toBe(firstError.problem.requestId);
});

it('upsert can be blocked by trust-safety policy', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	context.trustSafetyPort = new InMemoryTrustSafetyPort({
		blockedActorActions: {
			'user-a': ['upsertMatchdaySubmission'],
		},
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	const blockedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		}),
	);
	expect(blockedError.problem.code).toBe('forbiddenRole');
	expect(blockedError.problem.status).toBe(403);
});

it('upsert event defaults correlation and causation metadata to requestId', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		requestId: 'req-upsert-meta',
		upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
	});

	const upsertEvent = requireValue(
		context.eventBusPort.listEvents().find(event => event.type === 'submission.upserted'),
		'Expected submission.upserted event.',
	);
	expect(upsertEvent.requestId).toBe('req-upsert-meta');
	expect(upsertEvent.correlationId).toBe('req-upsert-meta');
	expect(upsertEvent.causationId).toBe('req-upsert-meta');
	expect(upsertEvent.payload).toEqual(
		expect.objectContaining({
			actorId: 'user-a',
			actorRole: 'player',
			authorization: expect.objectContaining({
				policyId: 'adr0067.roles-permissions.v1',
				membershipRequired: true,
				membershipRole: 'player',
			}),
			trustSafety: expect.objectContaining({
				policyId: 'adr0067.trust-safety.v1',
				blockedByActorList: false,
				blockedByActionList: false,
				blockedByActorActionList: false,
			}),
		}),
	);
});

it('idempotency key reuse with different If-Match returns 409', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		idempotencyKey: 'subm-key-if-match',
		upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
	});

	const keyReuseError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'subm-key-if-match',
			ifMatch: '"v99"',
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		}),
	);
	expect(keyReuseError.problem.code).toBe('idempotencyKeyReused');
	expect(keyReuseError.problem.status).toBe(409);
});

it('If-Match mismatch returns 412', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	const etagError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			ifMatch: '"v999"',
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		}),
	);
	expect(etagError.problem.code).toBe('etagMismatch');
	expect(etagError.problem.status).toBe(412);
});

it('global tournament lock returns 409 for upsert', async () => {
	const context = createRuntimeContext({
		tournaments: [
			baseTournament({
				joinPolicy: {
					joinMode: 'open',
					joinMidSeasonAllowed: true,
					locked: true,
				},
			}),
		],
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	const lockedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		}),
	);
	expect(lockedError.problem.code).toBe('tournamentLocked');
	expect(lockedError.problem.status).toBe(409);
});

it('partial lock rejects only locked matches', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1, { lockState: 'locked' }), baseMatch('match-2', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);
	const response = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [
			{ matchId: 'match-1', homeScore: 1, awayScore: 0 },
			{ matchId: 'match-2', homeScore: 2, awayScore: 1 },
		],
	});

	expect(response.status).toBe(200);
	expect(response.body.applied).toEqual(['match-2']);
	expect(response.body.rejected.length).toBe(1);
	expect(response.body.rejected[0]?.subjectId).toBe('match-1');
	expect(response.body.rejected[0]?.reason).toBe('locked');
});

it('kickoff lock rejects match exactly at scheduledAt boundary', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1, { lockState: 'open', scheduledAt: BASE_NOW })],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	const response = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
	});

	expect(response.status).toBe(200);
	expect(response.body.applied).toEqual([]);
	expect(response.body.rejected).toEqual([{ subjectType: 'match', subjectId: 'match-1', reason: 'locked' }]);
});

it('kickoff lock is deterministic before and after kickoff using runtime clock', async () => {
	const kickoff = '2026-02-06T10:05:00.000Z';
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1, { lockState: 'open', scheduledAt: kickoff })],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	const beforeKickoff = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
	});
	expect(beforeKickoff.body.applied).toEqual(['match-1']);
	expect(beforeKickoff.body.rejected).toEqual([]);

	context.clockPort.setNow(new Date(kickoff));

	const atKickoff = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [{ matchId: 'match-1', homeScore: 2, awayScore: 2 }],
	});
	expect(atKickoff.body.applied).toEqual([]);
	expect(atKickoff.body.rejected).toEqual([{ subjectType: 'match', subjectId: 'match-1', reason: 'locked' }]);
	const prediction = atKickoff.body.submission.predictions.find(item => item.matchId === 'match-1');
	expect(prediction?.homeScore).toBe(1);
	expect(prediction?.awayScore).toBe(0);
});

it('kickoffWithGrace lock uses deterministic grace boundary', () => {
	const match = {
		lockState: 'open' as const,
		scheduledAt: '2026-02-06T10:00:00.000Z',
	};

	expect(isMatchLocked(match, { type: 'kickoffWithGrace', graceSeconds: 120 }, '2026-02-06T10:01:59.000Z')).toBe(false);
	expect(isMatchLocked(match, { type: 'kickoffWithGrace', graceSeconds: 120 }, '2026-02-06T10:02:00.000Z')).toBe(true);
});

it('clear on closed matchday returns 409', async () => {
	const context = createRuntimeContext({
		tournaments: [baseTournament({ status: 'finished' })],
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	const useCase = new ClearMatchdaySubmissionUseCase(context);

	const closedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
		}),
	);
	expect(closedError.problem.code).toBe('matchdayClosed');
	expect(closedError.problem.status).toBe(409);
});

it('idempotent clear keeps 204 response after state changes', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ClearMatchdaySubmissionUseCase(context);

	const first = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		idempotencyKey: 'clear-key-1',
		requestId: 'req-clear-1',
	});
	expect(first.status).toBe(204);

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
	const replayed = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		idempotencyKey: 'clear-key-1',
		requestId: 'req-clear-2',
	});
	expect(replayed.status).toBe(204);
});

it('clear can be blocked by trust-safety policy', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	context.trustSafetyPort = new InMemoryTrustSafetyPort({
		blockedActorActions: {
			'user-a': ['clearMatchdaySubmission'],
		},
	});
	const useCase = new ClearMatchdaySubmissionUseCase(context);

	const blockedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
		}),
	);
	expect(blockedError.problem.code).toBe('forbiddenRole');
	expect(blockedError.problem.status).toBe(403);
});

it('clear event includes actor and policy audit fields', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ClearMatchdaySubmissionUseCase(context);

	await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		requestId: 'req-clear-meta',
	});

	const clearEvent = requireValue(
		context.eventBusPort.listEvents().find(event => event.type === 'submission.cleared'),
		'Expected submission.cleared event.',
	);
	expect(clearEvent.requestId).toBe('req-clear-meta');
	expect(clearEvent.correlationId).toBe('req-clear-meta');
	expect(clearEvent.causationId).toBe('req-clear-meta');
	expect(clearEvent.payload).toEqual(
		expect.objectContaining({
			actorId: 'user-a',
			actorRole: 'player',
			authorization: expect.objectContaining({
				policyId: 'adr0067.roles-permissions.v1',
				membershipRequired: true,
				membershipRole: 'player',
			}),
			trustSafety: expect.objectContaining({
				policyId: 'adr0067.trust-safety.v1',
				blockedByActorList: false,
				blockedByActionList: false,
				blockedByActorActionList: false,
			}),
		}),
	);
});

it('idempotent clear replays deterministic 409 outcome after state changes', async () => {
	const context = createRuntimeContext({
		tournaments: [
			baseTournament({
				joinPolicy: {
					joinMode: 'open',
					joinMidSeasonAllowed: true,
					locked: true,
				},
			}),
		],
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	const useCase = new ClearMatchdaySubmissionUseCase(context);

	const firstError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'clear-key-locked',
			requestId: 'req-clear-locked-1',
		}),
	);
	expect(firstError.problem.code).toBe('matchdayClosed');
	expect(firstError.problem.status).toBe(409);

	await context.tournamentRepo.save(
		baseTournament({
			joinPolicy: {
				joinMode: 'open',
				joinMidSeasonAllowed: true,
				locked: false,
			},
			version: 2,
		}),
	);

	const replayedError = await expectRuntimeProblem(() =>
		useCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			idempotencyKey: 'clear-key-locked',
			requestId: 'req-clear-locked-2',
		}),
	);
	expect(replayedError.problem.code).toBe(firstError.problem.code);
	expect(replayedError.problem.status).toBe(firstError.problem.status);
	expect(replayedError.problem.detail).toBe(firstError.problem.detail);
	expect(replayedError.problem.requestId).toBe(firstError.problem.requestId);
});

it('staff cancellation transitions tournament to cancelled and blocks joins/submissions', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
	});
	const cancelUseCase = new CancelTournamentUseCase(context);
	const cancelled = await cancelUseCase.execute({
		actorId: 'staff-1',
		actorRole: 'staff',
		tournamentId: 'tournament-1',
		reason: 'integrity-incident',
	});
	expect(cancelled.status).toBe(200);
	expect(cancelled.body.status).toBe('cancelled');
	expect(cancelled.body.locked).toBe(true);
	expect(cancelled.body.changed).toBe(true);

	const joinUseCase = new JoinTournamentUseCase(context);
	const joinLockedError = await expectRuntimeProblem(() =>
		joinUseCase.execute({
			actorId: 'user-b',
			tournamentId: 'tournament-1',
		}),
	);
	expect(joinLockedError.problem.code).toBe('tournamentCancelled');
	expect(joinLockedError.problem.status).toBe(409);

	const upsertUseCase = new UpsertMatchdaySubmissionUseCase(context);
	const upsertLockedError = await expectRuntimeProblem(() =>
		upsertUseCase.execute({
			actorId: 'user-a',
			tournamentId: 'tournament-1',
			matchday: 1,
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		}),
	);
	expect(upsertLockedError.problem.code).toBe('tournamentLocked');
	expect(upsertLockedError.problem.status).toBe(409);

	const cancelledEvent = requireValue(
		context.eventBusPort.listEvents().find(event => event.type === 'tournament.cancelled'),
		'Expected tournament.cancelled event.',
	);
	expect(cancelledEvent.payload).toEqual(
		expect.objectContaining({
			actorId: 'staff-1',
			actorRole: 'staff',
			reason: 'integrity-incident',
			authorization: expect.objectContaining({
				policyId: 'adr0067.roles-permissions.v1',
				membershipRequired: false,
			}),
			trustSafety: expect.objectContaining({
				policyId: 'adr0067.trust-safety.v1',
				blockedByActorList: false,
				blockedByActionList: false,
				blockedByActorActionList: false,
			}),
		}),
	);
});

it('only staff can trigger cancellation override', async () => {
	const context = createRuntimeContext();
	const cancelUseCase = new CancelTournamentUseCase(context);

	const roleError = await expectRuntimeProblem(() =>
		cancelUseCase.execute({
			actorId: 'owner-1',
			actorRole: 'owner',
			tournamentId: 'tournament-1',
			reason: 'attempted',
		}),
	);
	expect(roleError.problem.code).toBe('forbiddenRole');
	expect(roleError.problem.status).toBe(403);
});

it('staff cancellation can be blocked by trust-safety policy', async () => {
	const context = createRuntimeContext();
	context.trustSafetyPort = new InMemoryTrustSafetyPort({
		blockedActorIds: new Set(['staff-1']),
	});
	const cancelUseCase = new CancelTournamentUseCase(context);

	const blockedError = await expectRuntimeProblem(() =>
		cancelUseCase.execute({
			actorId: 'staff-1',
			actorRole: 'staff',
			tournamentId: 'tournament-1',
			reason: 'policy-blocked',
		}),
	);
	expect(blockedError.problem.code).toBe('forbiddenRole');
	expect(blockedError.problem.status).toBe(403);
});

it('submissionCompleteAt is set once at first complete transition', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1), baseMatch('match-2', 1)],
	});
	const useCase = new UpsertMatchdaySubmissionUseCase(context);

	await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
	});

	context.clockPort.setNow(new Date('2026-02-06T10:05:00.000Z'));
	const completed = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [{ matchId: 'match-2', homeScore: 2, awayScore: 1 }],
	});
	const firstCompleteAt = completed.body.submission.submissionCompleteAt;
	expect(firstCompleteAt).toBe('2026-02-06T10:05:00.000Z');

	context.clockPort.setNow(new Date('2026-02-06T10:10:00.000Z'));
	const updated = await useCase.execute({
		actorId: 'user-a',
		tournamentId: 'tournament-1',
		matchday: 1,
		upserts: [{ matchId: 'match-1', homeScore: 3, awayScore: 1 }],
	});
	expect(updated.body.submission.submissionCompleteAt).toBe(firstCompleteAt);
});

it('mostExactGoalsOneTeam counts once per match', () => {
	const ruleset = resolveRulesetDefinition('scorePrediction', 'ruleset.scorePrediction.v1');
	const evaluation = evaluateScorePrediction(
		ruleset,
		{ homeScore: 2, awayScore: 1 },
		{
			home: 2,
			away: 1,
			status: 'final',
		},
	);
	expect(evaluation.metrics.exactGoalsOneTeam).toBe(1);
});

it('penalty shootout scoring uses extra-time scope by default', () => {
	const ruleset = resolveRulesetDefinition('scorePrediction', 'ruleset.scorePrediction.v1');
	expect(ruleset.resultScope).toBe('extra_time');

	const penaltyShootoutEvaluation = evaluateScorePrediction(
		ruleset,
		{ homeScore: 1, awayScore: 1 },
		{
			home: 1,
			away: 1,
			status: 'final',
			finalOutcomeType: 'penalty_shootout',
		},
	);
	const extraTimeEvaluation = evaluateScorePrediction(
		ruleset,
		{ homeScore: 1, awayScore: 1 },
		{
			home: 1,
			away: 1,
			status: 'final',
			finalOutcomeType: 'extra_time',
		},
	);

	expect(penaltyShootoutEvaluation).toEqual(extraTimeEvaluation);
	expect(penaltyShootoutEvaluation.points).toBe(16);
	expect(penaltyShootoutEvaluation.breakdown).toEqual({
		correctOutcome: 8,
		exactScore: 6,
		exactGoalsOneTeam: 2,
		penalties: 0,
		bonuses: 0,
	});
});

it('earliestSubmission tie-break orders ascending', () => {
	const ruleset = resolveRulesetDefinition('scorePrediction', 'ruleset.scorePrediction.v1');
	const left = {
		userId: 'user-a',
		points: 10,
		metrics: {
			exactScores: 1,
			correctOutcomes: 1,
			exactGoalsOneTeam: 1,
			earliestSubmission: '2026-02-06T10:00:00.000Z',
			randomSeed: 'a',
		},
	};
	const right = {
		userId: 'user-b',
		points: 10,
		metrics: {
			exactScores: 1,
			correctOutcomes: 1,
			exactGoalsOneTeam: 1,
			earliestSubmission: '2026-02-06T10:01:00.000Z',
			randomSeed: 'b',
		},
	};
	expect(compareRankingCandidates(left, right, ruleset.tieBreakers) < 0).toBe(true);
});

it('random tie-breaker is deterministic', () => {
	const tieBreakers = ['random'] as const;
	const left = {
		userId: 'user-a',
		points: 10,
		metrics: {
			exactScores: 0,
			correctOutcomes: 0,
			exactGoalsOneTeam: 0,
			earliestSubmission: null,
			randomSeed: 'seed-a',
		},
	};
	const right = {
		userId: 'user-b',
		points: 10,
		metrics: {
			exactScores: 0,
			correctOutcomes: 0,
			exactGoalsOneTeam: 0,
			earliestSubmission: null,
			randomSeed: 'seed-b',
		},
	};
	const first = compareRankingCandidates(left, right, tieBreakers as unknown as string[]);
	const second = compareRankingCandidates(left, right, tieBreakers as unknown as string[]);
	expect(first).toBe(second);
	expect(first).not.toBe(0);
});

it('penalty shootout ranking uses scoreline (penalties excluded)', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a'), baseMembership('user-b')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 1, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
			baseSubmission('user-b', 1, {
				'match-1': { matchId: 'match-1', homeScore: 0, awayScore: 1, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	await useCase.execute({
		eventId: 'evt-penalty-shootout',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 1,
		finalOutcomeType: 'penalty_shootout',
	});

	const snapshot = await context.scoringRepo.getLatestSnapshot('tournament-1', 'matchday', 1);
	const safeSnapshot = requireValue(snapshot, 'Expected matchday snapshot to exist.');
	const userA = requireValue(safeSnapshot.entries.find(entry => entry.userId === 'user-a'), 'Expected user-a ranking entry.');
	const userB = requireValue(safeSnapshot.entries.find(entry => entry.userId === 'user-b'), 'Expected user-b ranking entry.');

	expect(userA.points).toBe(16);
	expect(userB.points).toBe(2);
	expect(userA.position).toBe(1);
	expect(userB.position).toBe(2);
});

it('apply match finished propagates request, correlation, and causation metadata into recompute events', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	await useCase.execute({
		eventId: 'evt-provider-meta-1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
		requestId: 'req-apply-meta',
		correlationId: 'corr-apply-meta',
		causationId: 'cause-apply-meta',
	});

	const snapshotEvent = requireValue(
		context.eventBusPort.listEvents().find(event => event.type === 'ranking.snapshot_published'),
		'Expected ranking.snapshot_published event.',
	);
	expect(snapshotEvent.requestId).toBe('req-apply-meta');
	expect(snapshotEvent.correlationId).toBe('corr-apply-meta');
	expect(snapshotEvent.causationId).toBe('cause-apply-meta');
});

it('apply match finished defaults correlation and causation metadata from source event id', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	await useCase.execute({
		eventId: 'evt-provider-meta-fallback',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
	});

	const snapshotEvent = requireValue(
		context.eventBusPort.listEvents().find(event => event.type === 'ranking.snapshot_published'),
		'Expected ranking.snapshot_published event.',
	);
	expect(snapshotEvent.requestId).toBeUndefined();
	expect(snapshotEvent.correlationId).toBe('evt-provider-meta-fallback');
	expect(snapshotEvent.causationId).toBe('evt-provider-meta-fallback');
});

it('duplicate sports events do not duplicate snapshots', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a'), baseMembership('user-b')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
			baseSubmission('user-b', 1, {
				'match-1': { matchId: 'match-1', homeScore: 0, awayScore: 1, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	const first = await useCase.execute({
		eventId: 'evt-1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
		finalOutcomeType: 'extra_time',
	});
	expect(first.body.processed).toBe(true);
	const firstSnapshots = await context.scoringRepo.listSnapshots('tournament-1');
	expect(firstSnapshots.length).toBe(2);

	const duplicated = await useCase.execute({
		eventId: 'evt-1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
		finalOutcomeType: 'extra_time',
	});
	expect(duplicated.body.processed).toBe(false);
	const secondSnapshots = await context.scoringRepo.listSnapshots('tournament-1');
	expect(secondSnapshots.length).toBe(2);
});

it('same corrected fingerprint does not create new snapshot versions', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	await useCase.execute({
		eventId: 'evt-1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
	});
	const before = await context.scoringRepo.listSnapshots('tournament-1');
	expect(before.length).toBe(2);

	const repeatedCorrection = await useCase.execute({
		eventId: 'evt-2',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
	});
	expect(repeatedCorrection.body.processed).toBe(false);
	const after = await context.scoringRepo.listSnapshots('tournament-1');
	expect(after.length).toBe(2);
});

it('new corrected fingerprint creates new snapshot versions', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	await useCase.execute({
		eventId: 'evt-1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
	});
	const before = await context.scoringRepo.listSnapshots('tournament-1');
	expect(before.length).toBe(2);

	const corrected = await useCase.execute({
		eventId: 'evt-3',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 2,
		away: 0,
	});
	expect(corrected.body.processed).toBe(true);
	const after = await context.scoringRepo.listSnapshots('tournament-1');
	expect(after.length).toBe(4);
});

it('unknown canonical match id is rejected and does not mutate snapshots', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	const notFoundError = await expectRuntimeProblem(() =>
		useCase.execute({
			eventId: 'evt-provider-unknown-id',
			tournamentId: 'tournament-1',
			matchday: 1,
			matchId: 'provider-match-999',
			status: 'final',
			home: 1,
			away: 0,
		}),
	);
	expect(notFoundError.problem.code).toBe('notFound');
	expect(notFoundError.problem.status).toBe(404);

	const snapshots = await context.scoringRepo.listSnapshots('tournament-1');
	expect(snapshots).toHaveLength(0);
});

it('same score on different canonical matches is processed independently', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1), baseMatch('match-2', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
				'match-2': { matchId: 'match-2', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}, {
				completion: {
					submittedCount: 2,
					expectedCount: 2,
					status: 'complete',
				},
			}),
		],
	});
	const useCase = new ApplyMatchFinishedUseCase(context);

	const first = await useCase.execute({
		eventId: 'evt-match-1-final',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
	});
	const second = await useCase.execute({
		eventId: 'evt-match-2-final',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-2',
		status: 'final',
		home: 1,
		away: 0,
	});

	expect(first.body.processed).toBe(true);
	expect(second.body.processed).toBe(true);

	const snapshot = await context.scoringRepo.getLatestSnapshot('tournament-1', 'matchday', 1);
	const safeSnapshot = requireValue(snapshot, 'Expected latest matchday snapshot.');
	const user = requireValue(safeSnapshot.entries.find(entry => entry.userId === 'user-a'), 'Expected user-a entry.');
	expect(user.points).toBe(32);
});

it('incremental apply and full recompute produce equivalent latest snapshots', async () => {
	const seedMatches = [
		baseMatch('match-1', 1, { scheduledAt: '2026-02-06T20:00:00.000Z' }),
		baseMatch('match-2', 1, { scheduledAt: '2026-02-06T22:00:00.000Z' }),
		baseMatch('match-3', 2, { scheduledAt: '2026-02-07T20:00:00.000Z' }),
	];
	const seedSubmissions = [
		baseSubmission(
			'user-a',
			1,
			{
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
				'match-2': { matchId: 'match-2', homeScore: 0, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			},
			{
				completion: {
					submittedCount: 2,
					expectedCount: 2,
					status: 'complete',
				},
			},
		),
		baseSubmission(
			'user-b',
			1,
			{
				'match-1': { matchId: 'match-1', homeScore: 0, awayScore: 1, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
				'match-2': { matchId: 'match-2', homeScore: 1, awayScore: 1, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			},
			{
				completion: {
					submittedCount: 2,
					expectedCount: 2,
					status: 'complete',
				},
			},
		),
		baseSubmission('user-a', 2, {
			'match-3': { matchId: 'match-3', homeScore: 2, awayScore: 1, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
		}),
		baseSubmission('user-b', 2, {
			'match-3': { matchId: 'match-3', homeScore: 1, awayScore: 2, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
		}),
	];
	const seed = {
		tournaments: [baseTournament()],
		memberships: [baseMembership('user-a'), baseMembership('user-b')],
		matches: seedMatches,
		submissions: seedSubmissions,
	};
	const incrementalContext = createRuntimeContext(seed);
	const fullRecomputeContext = createRuntimeContext(seed);

	const incremental = new ApplyMatchFinishedUseCase(incrementalContext);
	await incremental.execute({
		eventId: 'evt-md1-m1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
		finalOutcomeType: 'extra_time',
	});
	await incremental.execute({
		eventId: 'evt-md1-m2',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-2',
		status: 'final',
		home: 0,
		away: 0,
		finalOutcomeType: 'extra_time',
	});
	await incremental.execute({
		eventId: 'evt-md2-m3',
		tournamentId: 'tournament-1',
		matchday: 2,
		matchId: 'match-3',
		status: 'final',
		home: 2,
		away: 1,
		finalOutcomeType: 'extra_time',
	});

	await fullRecomputeContext.sportsSchedulePort.upsertMatchResult(
		baseMatch('match-1', 1, {
			scheduledAt: '2026-02-06T20:00:00.000Z',
			status: 'final',
			score: { home: 1, away: 0 },
			finalOutcomeType: 'extra_time',
			resultFingerprint: 'full-md1-match-1',
		}),
	);
	await fullRecomputeContext.sportsSchedulePort.upsertMatchResult(
		baseMatch('match-2', 1, {
			scheduledAt: '2026-02-06T22:00:00.000Z',
			status: 'final',
			score: { home: 0, away: 0 },
			finalOutcomeType: 'extra_time',
			resultFingerprint: 'full-md1-match-2',
		}),
	);
	await fullRecomputeContext.sportsSchedulePort.upsertMatchResult(
		baseMatch('match-3', 2, {
			scheduledAt: '2026-02-07T20:00:00.000Z',
			status: 'final',
			score: { home: 2, away: 1 },
			finalOutcomeType: 'extra_time',
			resultFingerprint: 'full-md2-match-3',
		}),
	);
	const fullRecompute = new RecomputeTournamentUseCase(fullRecomputeContext);
	await fullRecompute.execute({
		tournamentId: 'tournament-1',
		reason: 'test.full_recompute_equivalence',
	});

	const incrementalSeason = await incrementalContext.scoringRepo.getLatestSnapshot('tournament-1', 'season');
	const fullSeason = await fullRecomputeContext.scoringRepo.getLatestSnapshot('tournament-1', 'season');
	expect(normalizeSnapshot(incrementalSeason)).toEqual(normalizeSnapshot(fullSeason));

	const incrementalMatchdayOne = await incrementalContext.scoringRepo.getLatestSnapshot('tournament-1', 'matchday', 1);
	const fullMatchdayOne = await fullRecomputeContext.scoringRepo.getLatestSnapshot('tournament-1', 'matchday', 1);
	expect(normalizeSnapshot(incrementalMatchdayOne)).toEqual(normalizeSnapshot(fullMatchdayOne));

	const incrementalMatchdayTwo = await incrementalContext.scoringRepo.getLatestSnapshot('tournament-1', 'matchday', 2);
	const fullMatchdayTwo = await fullRecomputeContext.scoringRepo.getLatestSnapshot('tournament-1', 'matchday', 2);
	expect(normalizeSnapshot(incrementalMatchdayTwo)).toEqual(normalizeSnapshot(fullMatchdayTwo));
});

it('ranking state becomes final only when all matches are final or void', async () => {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [
			baseMatch('match-1', 1, { status: 'final', score: { home: 1, away: 0 } }),
			baseMatch('match-2', 1, { status: 'pending', score: { home: null, away: null } }),
		],
		submissions: [
			baseSubmission(
				'user-a',
				1,
				{
					'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
					'match-2': { matchId: 'match-2', homeScore: 0, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
				},
				{
					completion: {
						submittedCount: 2,
						expectedCount: 2,
						status: 'complete',
					},
				},
			),
		],
	});
	const recompute = new RecomputeTournamentUseCase(context);

	await recompute.execute({
		tournamentId: 'tournament-1',
		reason: 'test.pending',
	});
	const pendingSeason = await context.scoringRepo.getLatestSnapshot('tournament-1', 'season');
	expect(pendingSeason?.state).toBe('provisional');

	await context.sportsSchedulePort.upsertMatchResult(baseMatch('match-2', 1, { status: 'final', score: { home: 0, away: 0 } }));
	await recompute.execute({
		tournamentId: 'tournament-1',
		reason: 'test.final',
	});
const finalSeason = await context.scoringRepo.getLatestSnapshot('tournament-1', 'season');
expect(finalSeason?.state).toBe('final');
});

});
