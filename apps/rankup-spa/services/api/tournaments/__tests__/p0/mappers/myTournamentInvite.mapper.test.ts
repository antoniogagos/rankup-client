import { mapMyTournamentInvite, mapTournamentProblemToDomainError } from '../../../tournament-mappers.js';
import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

describe('[P0] tournament mapper - my tournament invite', () => {
	it('maps MyTournamentInvite DTO to domain shape', () => {
		const dto = fixtures.dto.invites.myTournamentInvite();
		const mapped = mapMyTournamentInvite(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.tournaments.myTournamentInvite());
	});

	it('maps Problem Details to Unauthorized domain error', () => {
		const problem = fixtures.dto.errors.unauthorizedProblem();
		const mapped = mapTournamentProblemToDomainError(problem);
		expect(mapped.kind).toBe('Unauthorized');
		expect(mapped.status).toBe(401);
	});
});
