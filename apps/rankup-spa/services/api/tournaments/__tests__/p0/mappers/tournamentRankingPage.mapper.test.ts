import { mapRankingPage, mapTournamentProblemToDomainError } from '../../../tournament-mappers.js';
import { assertNoUndefinedDeep } from '@rankup/testkit/assert/no-undefined.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

describe('[P0] tournament mapper - tournament ranking page', () => {
	it('maps TournamentRankingPage DTO to domain shape', () => {
		const dto = fixtures.dto.rankings.tournamentRankingPage();
		const mapped = mapRankingPage(dto as never);
		assertNoUndefinedDeep(mapped);
		expect(mapped).toEqual(fixtures.domain.rankings.tournamentRankingPage());
	});

	it('maps Problem Details to NotFound domain error', () => {
		const problem = fixtures.dto.errors.notFoundProblem();
		const mapped = mapTournamentProblemToDomainError(problem);
		expect(mapped.kind).toBe('NotFound');
		expect(mapped.code).toBe('notFound');
	});
});
