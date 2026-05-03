import { describe, expect, it } from 'vitest';
import { mapProblemToDomainError } from '../../mapProblemToDomainError.js';

describe('[P0] problem mapper - canonical Problem to DomainError', () => {
	it('maps engine-specific tournament lock code without collapsing to generic conflict', () => {
		const mapped = mapProblemToDomainError({
			type: 'https://errors.rankup.dev/tournaments/locked',
			title: 'Conflict',
			status: 409,
			code: 'tournamentLocked',
			detail: 'Tournament is locked.',
		});

		expect(mapped.kind).toBe('TournamentLocked');
		expect(mapped.code).toBe('tournamentLocked');
		expect(mapped.status).toBe(409);
	});

	it('maps idempotencyOutcomeInvalid to a dedicated domain kind', () => {
		const mapped = mapProblemToDomainError({
			type: 'https://errors.rankup.dev/idempotency/outcome-invalid',
			title: 'Internal Server Error',
			status: 500,
			code: 'idempotencyOutcomeInvalid',
			detail: 'Stored idempotency outcome is invalid.',
		});

		expect(mapped.kind).toBe('IdempotencyOutcomeInvalid');
		expect(mapped.code).toBe('idempotencyOutcomeInvalid');
		expect(mapped.status).toBe(500);
	});

	it('maps 429 status to RateLimited when no domain code is present', () => {
		const mapped = mapProblemToDomainError({
			type: 'https://errors.rankup.dev/rate-limit/too-many-requests',
			title: 'Too Many Requests',
			status: 429,
		});

		expect(mapped.kind).toBe('RateLimited');
		expect(mapped.status).toBe(429);
	});

	it('maps 5xx status to ServerError', () => {
		const mapped = mapProblemToDomainError({
			type: 'https://errors.rankup.dev/internal',
			title: 'Internal Server Error',
			status: 503,
		});

		expect(mapped.kind).toBe('ServerError');
		expect(mapped.status).toBe(503);
	});
});
