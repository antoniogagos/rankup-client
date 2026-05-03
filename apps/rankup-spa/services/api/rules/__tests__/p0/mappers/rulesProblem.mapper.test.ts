import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapRulesProblemToDomainError } from '../../../rules-mappers.js';

describe('[P0] rules mapper - problem parity', () => {
	it('maps canonical Forbidden problem', () => {
		const mapped = mapRulesProblemToDomainError(fixtures.dto.errors.forbiddenProblem());
		expect(mapped.kind).toBe('Forbidden');
		expect(mapped.status).toBe(403);
	});

	it('maps joinClosed code to JoinClosed', () => {
		const mapped = mapRulesProblemToDomainError(fixtures.dto.errors.joinClosedProblem());
		expect(mapped.kind).toBe('JoinClosed');
		expect(mapped.code).toBe('joinClosed');
	});
});
