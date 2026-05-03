import { mapInvitationCodeResolution, mapTournamentProblemToDomainError } from '../../../tournament-mappers.js';
import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

describe('[P0] tournament mapper - invitation code resolution', () => {
	it('maps InvitationCodeResolution DTO to domain shape', () => {
		const dto = fixtures.dto.invitationCodes.invitationCodeResolution();
		const mapped = mapInvitationCodeResolution(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.tournaments.invitationCodeResolution());
	});

	it('maps Problem Details to NotFound domain error', () => {
		const problem = fixtures.dto.errors.notFoundProblem();
		const mapped = mapTournamentProblemToDomainError(problem);
		expect(mapped.kind).toBe('NotFound');
		expect(mapped.title).toBe('Not found');
	});
});
