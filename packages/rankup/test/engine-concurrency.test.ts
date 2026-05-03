import { RuntimeProblem } from '../src/runtime/errors.js';
import type { MembershipRepo, ProcessedEventRepo, SubmissionRepo } from '../src/runtime/index.js';
import { ApplyMatchFinishedUseCase, JoinTournamentUseCase, parseEtag,UpsertMatchdaySubmissionUseCase } from '../src/runtime/index.js';
import { BASE_NOW, baseMatch, baseMembership, baseSubmission, createRuntimeContext } from './testkit/runtime-fixtures.js';
import { describe, expect, it } from 'vitest';

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

describe('engine runtime concurrency stress', () => {
	it('join stress race keeps exactly one membership and one join event', async () => {
		const context = createRuntimeContext();
		const delegatedMembershipRepo = context.membershipRepo;
		const addBarrier = createDeferred();
		const allAddsReached = createDeferred();
		const concurrentCalls = 8;
		let pendingAdds = 0;

		const adversarialMembershipRepo: MembershipRepo = {
			getByTournamentAndUser: (tournamentId, userId) => delegatedMembershipRepo.getByTournamentAndUser(tournamentId, userId),
			countByTournament: tournamentId => delegatedMembershipRepo.countByTournament(tournamentId),
			listByTournament: tournamentId => delegatedMembershipRepo.listByTournament(tournamentId),
			add: async membership => {
				pendingAdds += 1;
				if (pendingAdds === concurrentCalls) {
					allAddsReached.resolve();
				}
				await addBarrier.promise;
				return delegatedMembershipRepo.add(membership);
			},
		};
		context.membershipRepo = adversarialMembershipRepo;

		const useCase = new JoinTournamentUseCase(context);
		const raceCalls = [...Array(concurrentCalls)].map((_, index) =>
			useCase.execute({
				actorId: 'user-race-stress',
				tournamentId: 'tournament-1',
				requestId: `req-join-race-${index + 1}`,
			}),
		);

		await allAddsReached.promise;
		addBarrier.resolve();

		const responses = await Promise.all(raceCalls);
		const created = responses.filter(response => response.body.joined);
		const skipped = responses.filter(response => !response.body.joined);
		expect(created).toHaveLength(1);
		expect(skipped).toHaveLength(concurrentCalls - 1);
		expect(created[0]?.status).toBe(201);
		expect(skipped.every(response => response.status === 200)).toBe(true);

		const memberships = await context.membershipRepo.listByTournament('tournament-1');
		const raceMemberships = memberships.filter(membership => membership.userId === 'user-race-stress');
		expect(raceMemberships).toHaveLength(1);

		const joinEvents = context.eventBusPort
			.listEvents()
			.filter(event => event.type === 'tournament.member_joined' && event.payload.userId === 'user-race-stress');
		expect(joinEvents).toHaveLength(1);
	});

	it('concurrent upsert with same If-Match allows one winner and one deterministic 412 loser', async () => {
		const context = createRuntimeContext({
			memberships: [baseMembership('user-race-upsert')],
			matches: [baseMatch('match-1', 1)],
		});
		const useCase = new UpsertMatchdaySubmissionUseCase(context);
		const seeded = await useCase.execute({
			actorId: 'user-race-upsert',
			tournamentId: 'tournament-1',
			matchday: 1,
			upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
		});
		const sharedIfMatch = seeded.headers.ETag;
		expect(sharedIfMatch).toBeDefined();
		const expectedVersion = parseEtag(sharedIfMatch ?? '');
		expect(expectedVersion).not.toBeNull();

		const delegatedSubmissionRepo = context.submissionRepo;
		const saveBarrier = createDeferred();
		const bothSavesReached = createDeferred();
		let pendingSaves = 0;

		const adversarialSubmissionRepo: SubmissionRepo = {
			getByTournamentMatchdayUser: (tournamentId, matchday, userId) =>
				delegatedSubmissionRepo.getByTournamentMatchdayUser(tournamentId, matchday, userId),
			save: submission => delegatedSubmissionRepo.save(submission),
			saveIfVersion: async (submission, expectedVersionForSave) => {
				pendingSaves += 1;
				if (pendingSaves === 2) {
					bothSavesReached.resolve();
				}
				await saveBarrier.promise;
				return delegatedSubmissionRepo.saveIfVersion(submission, expectedVersionForSave);
			},
			listByTournamentMatchday: (tournamentId, matchday) => delegatedSubmissionRepo.listByTournamentMatchday(tournamentId, matchday),
		};
		context.submissionRepo = adversarialSubmissionRepo;

		const firstUpsert = useCase.execute({
			actorId: 'user-race-upsert',
			tournamentId: 'tournament-1',
			matchday: 1,
			ifMatch: sharedIfMatch,
			upserts: [{ matchId: 'match-1', homeScore: 2, awayScore: 1 }],
		});
		const secondUpsert = useCase.execute({
			actorId: 'user-race-upsert',
			tournamentId: 'tournament-1',
			matchday: 1,
			ifMatch: sharedIfMatch,
			upserts: [{ matchId: 'match-1', homeScore: 3, awayScore: 2 }],
		});

		await bothSavesReached.promise;
		saveBarrier.resolve();

		const settled = await Promise.allSettled([firstUpsert, secondUpsert]);
		const fulfilled = settled.filter((result): result is PromiseFulfilledResult<Awaited<typeof firstUpsert>> => result.status === 'fulfilled');
		const rejected = settled.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
		expect(fulfilled).toHaveLength(1);
		expect(rejected).toHaveLength(1);
		expect(fulfilled[0].value.status).toBe(200);

		const rejectedReason = rejected[0].reason;
		expect(rejectedReason).toBeInstanceOf(RuntimeProblem);
		expect((rejectedReason as RuntimeProblem).problem.code).toBe('etagMismatch');
		expect((rejectedReason as RuntimeProblem).problem.status).toBe(412);

		const finalSubmission = requireValue(
			await context.submissionRepo.getByTournamentMatchdayUser('tournament-1', 1, 'user-race-upsert'),
			'Expected final submission to exist.',
		);
		expect(finalSubmission.version).toBe((expectedVersion ?? 0) + 1);
	});

	it('duplicate apply race processes one event and keeps snapshot set stable', async () => {
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
		const delegatedProcessedEventRepo = context.processedEventRepo;
		const markBarrier = createDeferred();
		const allMarksReached = createDeferred();
		const concurrentCalls = 10;
		let markCalls = 0;

		const adversarialProcessedEventRepo: ProcessedEventRepo = {
			has: eventKey => delegatedProcessedEventRepo.has(eventKey),
			mark: eventKey => delegatedProcessedEventRepo.mark(eventKey),
			markIfAbsent: async eventKey => {
				markCalls += 1;
				if (markCalls === concurrentCalls) {
					allMarksReached.resolve();
				}
				if (markCalls <= concurrentCalls) {
					await markBarrier.promise;
				}
				return delegatedProcessedEventRepo.markIfAbsent(eventKey);
			},
		};
		context.processedEventRepo = adversarialProcessedEventRepo;

		const useCase = new ApplyMatchFinishedUseCase(context);
		const raceCalls = [...Array(concurrentCalls)].map(() =>
			useCase.execute({
				eventId: 'evt-race-duplicate',
				tournamentId: 'tournament-1',
				matchday: 1,
				matchId: 'match-1',
				status: 'final',
				home: 1,
				away: 0,
				finalOutcomeType: 'extra_time',
			}),
		);

		await allMarksReached.promise;
		markBarrier.resolve();

		const responses = await Promise.all(raceCalls);
		const processedResponses = responses.filter(response => response.body.processed);
		const dedupedResponses = responses.filter(response => !response.body.processed);
		expect(processedResponses).toHaveLength(1);
		expect(dedupedResponses).toHaveLength(concurrentCalls - 1);

		const snapshots = await context.scoringRepo.listSnapshots('tournament-1');
		expect(snapshots).toHaveLength(2);
	});
});
