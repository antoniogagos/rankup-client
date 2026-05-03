import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapTrustSafetyProblemToDomainError } from '../../../trust-mappers.js';

describe('[P0] trustSafety mapper - problem parity', () => {
	it('maps canonical Forbidden problem', () => {
		const mapped = mapTrustSafetyProblemToDomainError(fixtures.dto.errors.forbiddenProblem());
		expect(mapped.kind).toBe('Forbidden');
		expect(mapped.status).toBe(403);
	});

	it('maps forbiddenRole code to ForbiddenRole', () => {
		const mapped = mapTrustSafetyProblemToDomainError(fixtures.dto.errors.forbiddenRoleProblem());
		expect(mapped.kind).toBe('ForbiddenRole');
		expect(mapped.code).toBe('forbiddenRole');
	});
});
