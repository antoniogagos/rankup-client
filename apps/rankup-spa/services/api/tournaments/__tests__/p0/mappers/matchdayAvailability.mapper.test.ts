import { mapMatchdayAvailability, mapTournamentProblemToDomainError } from '../../../tournament-mappers.js';
import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

describe('[P0] tournament mapper - matchday availability', () => {
	it('maps MatchdayAvailability DTO to domain shape', () => {
		const dto = fixtures.dto.matchdays.matchdayAvailability();
		const mapped = mapMatchdayAvailability(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(dto);
	});

	it('maps Problem Details to ValidationFailed domain error', () => {
		const problem = fixtures.dto.errors.validationFailedProblem();
		const mapped = mapTournamentProblemToDomainError(problem);
		expect(mapped.kind).toBe('ValidationFailed');
		expect(mapped.status).toBe(422);
	});
});
