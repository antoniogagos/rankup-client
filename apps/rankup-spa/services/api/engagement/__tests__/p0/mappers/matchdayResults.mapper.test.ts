import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapEngagementProblemToDomainError, mapScorePredictionMatchResultLine } from '../../../stats-mappers.js';

describe('[P0] engagement mapper - matchday results', () => {
	it('maps ScorePredictionMatchResultLine DTO to domain shape', () => {
		const dto = fixtures.dto.results.scorePredictionMatchResultLine();
		const mapped = mapScorePredictionMatchResultLine(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.results.scorePredictionMatchResultLine());
	});

	it('maps Problem Details to SubmissionLocked domain error', () => {
		const problem = fixtures.dto.errors.submissionLockedProblem();
		const mapped = mapEngagementProblemToDomainError(problem);
		expect(mapped.kind).toBe('SubmissionLocked');
		expect(mapped.status).toBe(409);
	});

	it('maps canonical TooManyRequests problem to RateLimited', () => {
		const mapped = mapEngagementProblemToDomainError(fixtures.dto.errors.tooManyRequestsProblem());
		expect(mapped.kind).toBe('RateLimited');
		expect(mapped.status).toBe(429);
	});
});
