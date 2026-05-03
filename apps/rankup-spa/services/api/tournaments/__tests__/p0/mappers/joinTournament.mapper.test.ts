import { mapJoinByInvitationCodeResult, mapTournamentProblemToDomainError } from '../../../tournament-mappers.js';
import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

describe('[P0] tournament mapper - join tournament', () => {
	it('maps JoinByInvitationCodeResult DTO to domain shape', () => {
		const dto = fixtures.dto.tournaments.joinByInvitationCodeResult();
		const mapped = mapJoinByInvitationCodeResult(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.tournaments.joinByInvitationCodeResult());
	});

	it('maps Problem Details to SubmissionLocked domain error', () => {
		const problem = fixtures.dto.errors.submissionLockedProblem();
		const mapped = mapTournamentProblemToDomainError(problem);
		expect(mapped.kind).toBe('SubmissionLocked');
		expect(mapped.code).toBe('submissionLocked');
	});
});
