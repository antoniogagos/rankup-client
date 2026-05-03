import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapSportsProblemToDomainError } from '../../../sports-mappers.js';

describe('[P0] sports mapper - problem parity', () => {
	it('maps canonical NotFound problem', () => {
		const mapped = mapSportsProblemToDomainError(fixtures.dto.errors.notFoundProblem());
		expect(mapped.kind).toBe('NotFound');
		expect(mapped.status).toBe(404);
	});

	it('maps tournamentFull code to TournamentFull', () => {
		const mapped = mapSportsProblemToDomainError(fixtures.dto.errors.tournamentFullProblem());
		expect(mapped.kind).toBe('TournamentFull');
		expect(mapped.code).toBe('tournamentFull');
	});
});
