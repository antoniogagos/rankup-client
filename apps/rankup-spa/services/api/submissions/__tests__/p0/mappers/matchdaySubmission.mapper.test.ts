import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapMatchdaySubmission, mapSubmissionsProblemToDomainError } from '../../../submissions-mappers.js';

describe('[P0] submissions mapper - matchday submission', () => {
	it('maps scorePrediction matchday submission DTO to domain shape', () => {
		const dto = fixtures.dto.submissions.matchdaySubmission();
		const mapped = mapMatchdaySubmission(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.submissions.matchdaySubmission());
	});

	it('maps Problem Details to SubmissionLocked domain error', () => {
		const problem = fixtures.dto.errors.submissionLockedProblem();
		const mapped = mapSubmissionsProblemToDomainError(problem);
		expect(mapped.kind).toBe('SubmissionLocked');
		expect(mapped.code).toBe('submissionLocked');
	});
});
