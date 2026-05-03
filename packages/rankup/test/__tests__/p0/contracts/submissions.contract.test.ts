import { TournamentSubmissionsService } from '../../../../src/domains/submissions/scorePrediction/services/tournamentSubmissionsService.js';
import { FakeSubmissionsGateway } from '../../../testkit/fakes/fakeSubmissionsGateway.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

const submissionLockedDomainError = {
	kind: 'SubmissionLocked',
	status: 409,
	code: 'submissionLocked',
	message: 'Matchday is locked',
} as const;

describe('[P0] submissions service contract', () => {
	it('passes params to getMyMatchdaySubmission', async () => {
		const gateway = new FakeSubmissionsGateway();
		const service = new TournamentSubmissionsService(gateway);
		const tournamentId = fixtures.builders.tournamentId() as never;

		await service.getMyMatchdaySubmission({ tournamentId, matchday: 1 });

		expect(gateway.calls).toContainEqual(
			expect.objectContaining({
				op: 'getMyMatchdaySubmission',
				params: expect.objectContaining({ tournamentId, matchday: 1 }),
			}),
		);
	});

	it('passes If-Match and idempotency key through upsertMyMatchdaySubmission', async () => {
		const gateway = new FakeSubmissionsGateway();
		const service = new TournamentSubmissionsService(gateway);
		const tournamentId = fixtures.builders.tournamentId() as never;
		const ifMatch = '"submission-v1"';
		const idempotencyKey = 'idem_upsert_0001';

		await service.upsertMyMatchdaySubmission(
			{ tournamentId, matchday: 1, ifMatch, idempotencyKey },
			{ gameModeId: 'scorePrediction', upserts: [], removes: [] } as never,
		);

		expect(gateway.calls).toContainEqual(
			expect.objectContaining({
				op: 'upsertMyMatchdaySubmission',
				params: expect.objectContaining({
					tournamentId,
					matchday: 1,
					ifMatch,
					idempotencyKey,
				}),
			}),
		);
	});

	it('passes clear operation idempotency key through gateway', async () => {
		const gateway = new FakeSubmissionsGateway();
		const service = new TournamentSubmissionsService(gateway);
		const tournamentId = fixtures.builders.tournamentId() as never;
		const idempotencyKey = 'idem_clear_0001';

		await service.clearMyMatchdaySubmission({ tournamentId, matchday: 1, idempotencyKey });

		expect(gateway.calls).toContainEqual(
			expect.objectContaining({
				op: 'clearMyMatchdaySubmission',
				params: expect.objectContaining({
					tournamentId,
					matchday: 1,
					idempotencyKey,
				}),
			}),
		);
	});

	it('rethrows gateway problems for submission lock scenarios', async () => {
		const gateway = new FakeSubmissionsGateway();
		gateway.handlers.upsertMyMatchdaySubmission = async () => {
			throw submissionLockedDomainError;
		};
		const service = new TournamentSubmissionsService(gateway);

		await expect(
			service.upsertMyMatchdaySubmission(
				{ tournamentId: fixtures.builders.tournamentId() as never, matchday: 1 },
				{ gameModeId: 'scorePrediction', upserts: [], removes: [] } as never,
			),
		).rejects.toMatchObject(submissionLockedDomainError);
	});
});
