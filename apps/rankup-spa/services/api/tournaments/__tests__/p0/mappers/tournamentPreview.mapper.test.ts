import { mapTournamentPreview, mapTournamentProblemToDomainError } from '../../../tournament-mappers.js';
import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

describe('[P0] tournament mapper - tournament preview', () => {
	it('maps TournamentPreview DTO to domain shape', () => {
		const dto = fixtures.dto.tournaments.tournamentPreview();
		const mapped = mapTournamentPreview(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.tournaments.tournamentPreview());
	});

	it('maps Problem Details to NotFound domain error', () => {
		const problem = fixtures.dto.errors.notFoundProblem();
		const mapped = mapTournamentProblemToDomainError(problem);
		expect(mapped.kind).toBe('NotFound');
		expect(mapped.status).toBe(404);
	});
});
