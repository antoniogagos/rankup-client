import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapMediaProblemToDomainError } from '../../../media-mappers.js';

describe('[P0] media mapper - problem parity', () => {
	it('maps canonical ValidationFailed problem', () => {
		const mapped = mapMediaProblemToDomainError(fixtures.dto.errors.validationFailedProblem());
		expect(mapped.kind).toBe('ValidationFailed');
		expect(mapped.status).toBe(422);
	});

	it('maps idempotencyKeyReused code to IdempotencyKeyReused', () => {
		const mapped = mapMediaProblemToDomainError(fixtures.dto.errors.idempotencyKeyReusedProblem());
		expect(mapped.kind).toBe('IdempotencyKeyReused');
		expect(mapped.code).toBe('idempotencyKeyReused');
	});
});
