import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapAchievementsProblemToDomainError } from '../../../achievements-mappers.js';

describe('[P0] achievements mapper - problem parity', () => {
	it('maps canonical Forbidden problem', () => {
		const mapped = mapAchievementsProblemToDomainError(fixtures.dto.errors.forbiddenProblem());
		expect(mapped.kind).toBe('Forbidden');
		expect(mapped.status).toBe(403);
	});

	it('maps validationFailed code to ValidationFailed', () => {
		const mapped = mapAchievementsProblemToDomainError(fixtures.dto.errors.validationFailedProblem());
		expect(mapped.kind).toBe('ValidationFailed');
		expect(mapped.code).toBe('validationFailed');
	});
});
