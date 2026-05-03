import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapAccountsProblemToDomainError } from '../../../accounts-mappers.js';

describe('[P0] accounts mapper - problem parity', () => {
	it('maps canonical Unauthorized problem', () => {
		const mapped = mapAccountsProblemToDomainError(fixtures.dto.errors.unauthorizedProblem());
		expect(mapped.kind).toBe('Unauthorized');
		expect(mapped.status).toBe(401);
	});

	it('maps forbiddenRole code to ForbiddenRole', () => {
		const mapped = mapAccountsProblemToDomainError(fixtures.dto.errors.forbiddenRoleProblem());
		expect(mapped.kind).toBe('ForbiddenRole');
		expect(mapped.code).toBe('forbiddenRole');
	});
});
