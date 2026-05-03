import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapRankedProblemToDomainError } from '../../../ranked-mappers.js';

describe('[P0] ranked mapper - problem parity', () => {
	it('maps canonical server errors to ServerError', () => {
		const mapped = mapRankedProblemToDomainError(fixtures.dto.errors.internalServerErrorProblem());
		expect(mapped.kind).toBe('ServerError');
		expect(mapped.status).toBe(500);
	});

	it('maps etagMismatch code to EtagMismatch', () => {
		const mapped = mapRankedProblemToDomainError(fixtures.dto.errors.etagMismatchProblem());
		expect(mapped.kind).toBe('EtagMismatch');
		expect(mapped.code).toBe('etagMismatch');
		expect(mapped.status).toBe(412);
	});
});
