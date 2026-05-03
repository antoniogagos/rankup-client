import { TournamentCoreService } from '../../../../src/domains/tournaments/core/services/tournamentCoreService.js';
import { TournamentMembersService } from '../../../../src/domains/tournaments/members/services/tournamentMembersService.js';
import { FakeTournamentsGateway } from '../../../testkit/fakes/fakeTournamentsGateway.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

const notFoundDomainError = {
	kind: 'NotFound',
	status: 404,
	code: 'notFound',
	message: 'Tournament not found.',
} as const;

describe('[P0] tournaments service contract', () => {
	it('passes query/params to listMyTournaments and getTournamentPreview', async () => {
		const gateway = new FakeTournamentsGateway();
		const service = new TournamentCoreService(gateway);

		await service.listMyTournaments({ cursor: 'next-cursor', pageSize: 10 });
		await service.getTournamentPreview({ tournamentId: fixtures.builders.tournamentId() }, { include: ['rules'] });

		expect(gateway.calls).toContainEqual(expect.objectContaining({ op: 'listMyTournaments' }));
		expect(gateway.calls).toContainEqual(expect.objectContaining({ op: 'getTournamentPreview' }));
	});

	it('validates createTournament request before gateway call', async () => {
		const gateway = new FakeTournamentsGateway();
		const service = new TournamentCoreService(gateway);

		await expect(service.createTournament({} as never)).rejects.toThrow('Tournament name is required.');
	});

	it('passes idempotency key to joinTournament gateway call', async () => {
		const gateway = new FakeTournamentsGateway();
		const membersService = new TournamentMembersService(gateway);
		const tournamentId = fixtures.builders.tournamentId() as never;
		const idempotencyKey = 'idem_join_0001';

		const joined = await membersService.joinTournament(
			{ tournamentId, idempotencyKey },
			{ acceptTournamentRules: true },
		);

		expect(gateway.calls).toContainEqual(
			expect.objectContaining({
				op: 'joinTournament',
				params: expect.objectContaining({
					tournamentId,
					idempotencyKey,
				}),
			}),
		);
		expect(joined.tournamentId).toBe(tournamentId);
	});

	it('rethrows gateway problems consistently', async () => {
		const gateway = new FakeTournamentsGateway();
		gateway.handlers.getTournamentPreview = async () => {
			throw notFoundDomainError;
		};
		const service = new TournamentCoreService(gateway);

		await expect(service.getTournamentPreview({ tournamentId: 'missing' as never })).rejects.toMatchObject(notFoundDomainError);
	});
});
