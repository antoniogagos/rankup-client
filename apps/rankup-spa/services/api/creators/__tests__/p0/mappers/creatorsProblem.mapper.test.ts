import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';
import { mapCreatorsProblemToDomainError } from '../../../creators-mappers.js';

describe('[P0] creators mapper - problem parity', () => {
	it('maps canonical NotFound problem', () => {
		const mapped = mapCreatorsProblemToDomainError(fixtures.dto.errors.notFoundProblem());
		expect(mapped.kind).toBe('NotFound');
		expect(mapped.status).toBe(404);
	});

	it('maps notMember code to NotMember', () => {
		const mapped = mapCreatorsProblemToDomainError(fixtures.dto.errors.notMemberProblem());
		expect(mapped.kind).toBe('NotMember');
		expect(mapped.code).toBe('notMember');
	});
});
