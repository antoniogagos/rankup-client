import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapSubmissionsProblemToDomainError, mapUpsertMatchdaySubmissionResult } from '../../../submissions-mappers.js';

describe('[P0] submissions mapper - upsert result', () => {
	it('maps UpsertMatchdaySubmissionResult DTO to domain shape', () => {
		const dto = fixtures.dto.submissions.upsertMatchdaySubmissionResult();
		const mapped = mapUpsertMatchdaySubmissionResult(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.submissions.upsertMatchdaySubmissionResult());
	});

	it('maps Problem Details to ValidationFailed domain error', () => {
		const problem = fixtures.dto.errors.validationFailedProblem();
		const mapped = mapSubmissionsProblemToDomainError(problem);
		expect(mapped.kind).toBe('ValidationFailed');
		expect(mapped.code).toBe('validationFailed');
	});
});
