import { MeService } from '../../../../src/domains/accounts/me/services/meService.js';
import { UsersService } from '../../../../src/domains/accounts/users/services/usersService.js';
import { describe, expect, it } from 'vitest';

const unauthorizedDomainError = {
	kind: 'Unauthorized',
	status: 401,
	code: 'unauthorized',
	message: 'Authentication is required.',
} as const;

describe('[P0] accounts service contract', () => {
	it('passes query to users search gateway call', async () => {
		const calls: Array<{ op: string; query?: unknown }> = [];
		const gateway = {
			async searchUsers(query: unknown) {
				calls.push({ op: 'searchUsers', query });
				return { items: [], nextCursor: undefined } as never;
			},
			async getUserPublicProfile() {
				return { userId: 'user-1', username: 'mock-user', scope: 'public' } as never;
			},
			async resolveUserByUsername() {
				return { userId: 'user-1', username: 'mock-user', scope: 'public' } as never;
			},
		} as never;

		const service = new UsersService(gateway);
		await service.searchUsers({ q: 'cr7', pageSize: 10 } as never);

		expect(calls).toContainEqual(
			expect.objectContaining({
				op: 'searchUsers',
				query: expect.objectContaining({
					q: 'cr7',
					pageSize: 10,
				}),
			}),
		);
	});

	it('rethrows canonical DomainError from me gateway unchanged', async () => {
		const gateway = {
			async getMe() {
				throw unauthorizedDomainError;
			},
			async updateMe() {
				return { userId: 'user-1', username: 'mock-user' } as never;
			},
		} as never;

		const service = new MeService(gateway);

		await expect(service.getMe()).rejects.toMatchObject(unauthorizedDomainError);
	});
});
