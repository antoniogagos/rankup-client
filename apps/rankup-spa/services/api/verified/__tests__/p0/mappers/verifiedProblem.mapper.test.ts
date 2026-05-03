import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapVerifiedProblemToDomainError } from '../../../verified-mappers.js';

describe('[P0] verified mapper - problem parity', () => {
	it('maps canonical Unauthorized problem', () => {
		const mapped = mapVerifiedProblemToDomainError(fixtures.dto.errors.unauthorizedProblem());
		expect(mapped.kind).toBe('Unauthorized');
		expect(mapped.status).toBe(401);
	});

	it('maps tournamentCancelled code to TournamentCancelled', () => {
		const mapped = mapVerifiedProblemToDomainError(fixtures.dto.errors.tournamentCancelledProblem());
		expect(mapped.kind).toBe('TournamentCancelled');
		expect(mapped.code).toBe('tournamentCancelled');
	});
});
