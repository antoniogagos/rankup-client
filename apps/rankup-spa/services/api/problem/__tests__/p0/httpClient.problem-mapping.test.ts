import { createHttpRankupApiClient } from '../../../http-client.js';
import { describe, expect, it } from 'vitest';

const jsonResponse = (status: number, body: unknown): Response =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	});

const textResponse = (status: number, body: string): Response =>
	new Response(body, {
		status,
		headers: {
			'content-type': 'text/plain',
		},
	});

describe('[P0] http client - ProblemDetails mapping', () => {
	it('maps non-2xx JSON problems to canonical DomainError in typed client methods', async () => {
		const client = createHttpRankupApiClient({
			apiBaseUrl: 'https://api.rankup.dev',
			fetchFn: async () =>
				jsonResponse(404, {
					type: 'https://errors.rankup.dev/not-found',
					title: 'Not found',
					status: 404,
					code: 'notFound',
					detail: 'Resource not found',
				}),
		});

		await expect(client.getMe()).rejects.toMatchObject({
			kind: 'NotFound',
			status: 404,
			code: 'notFound',
		});
	});

	it('maps non-2xx text responses to status-derived DomainError', async () => {
		const client = createHttpRankupApiClient({
			apiBaseUrl: 'https://api.rankup.dev',
			fetchFn: async () => textResponse(503, 'upstream gateway timed out'),
		});

		await expect(client.getMe()).rejects.toMatchObject({
			kind: 'ServerError',
			status: 503,
			message: 'upstream gateway timed out',
		});
	});
});
