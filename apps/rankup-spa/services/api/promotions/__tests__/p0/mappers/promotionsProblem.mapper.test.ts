import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapPromotionsProblemToDomainError } from '../../../promotions-mappers.js';

describe('[P0] promotions mapper - problem parity', () => {
	it('maps canonical TooManyRequests problem', () => {
		const mapped = mapPromotionsProblemToDomainError(fixtures.dto.errors.tooManyRequestsProblem());
		expect(mapped.kind).toBe('RateLimited');
		expect(mapped.status).toBe(429);
	});

	it('maps tournamentArchived code to TournamentArchived', () => {
		const mapped = mapPromotionsProblemToDomainError(fixtures.dto.errors.tournamentArchivedProblem());
		expect(mapped.kind).toBe('TournamentArchived');
		expect(mapped.code).toBe('tournamentArchived');
	});
});
