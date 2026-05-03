import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapScoringProblemToDomainError } from '../../../results-mappers.js';

describe('[P0] scoring mapper - problem parity', () => {
	it('maps canonical NotFound problem', () => {
		const mapped = mapScoringProblemToDomainError(fixtures.dto.errors.notFoundProblem());
		expect(mapped.kind).toBe('NotFound');
		expect(mapped.status).toBe(404);
	});

	it('maps tournamentLocked code to TournamentLocked', () => {
		const mapped = mapScoringProblemToDomainError(fixtures.dto.errors.tournamentLockedProblem());
		expect(mapped.kind).toBe('TournamentLocked');
		expect(mapped.code).toBe('tournamentLocked');
	});
});
