import { once } from 'node:events';
import { createOpenApiMockServer } from '../src/server/openapi-contract.js';
import type { MockRegistry } from '../src/core/registry.js';

type SmokeResult = {
	name: string;
	pass: boolean;
	details?: string;
};

async function fetchJson(baseUrl: string, path: string, init?: RequestInit) {
	const response = await fetch(`${baseUrl}${path}`, init);
	const bodyText = await response.text();
	let body: unknown = null;
	try {
		body = bodyText ? JSON.parse(bodyText) : null;
	} catch {
		body = bodyText;
	}
	return { response, body };
}

function assert(condition: boolean, message: string) {
	if (!condition) {
		throw new Error(message);
	}
}

async function runSmoke(baseUrl: string, registry?: MockRegistry) {
	const results: SmokeResult[] = [];

	// Force status
	{
		const { response, body } = await fetchJson(baseUrl, '/competitions', {
			headers: { 'x-rankup-mock-force-status': '500' },
		});
		const pass = response.status === 500 && typeof body === 'object' && body !== null && (body as { operationId?: string }).operationId === 'listCompetitions';
		results.push({
			name: 'force-status (500)',
			pass,
			details: pass ? undefined : `status=${response.status}`,
		});
	}

	// Auth required
	{
		const { response } = await fetchJson(baseUrl, '/competitions', {
			headers: { 'x-rankup-mock-auth': 'required' },
		});
		const pass = response.status === 401;
		results.push({
			name: 'auth-required (401)',
			pass,
			details: pass ? undefined : `status=${response.status}`,
		});
	}

	// Delay via query param
	{
		const start = Date.now();
		await fetchJson(baseUrl, '/tourneys?x-rankup-mock-delay-ms=200');
		const elapsed = Date.now() - start;
		const pass = elapsed >= 150;
		results.push({
			name: 'delay-ms (query)',
			pass,
			details: `elapsed_ms=${elapsed}`,
		});
	}

	// Reset clears store (requires core registry)
	{
		if (!registry) {
			results.push({ name: 'reset (registry)', pass: false, details: 'registry missing' });
		} else {
			const before = await fetchJson(baseUrl, '/tourneys');
			assert(Array.isArray(before.body), 'expected tourneys array');
			const beforeCount = (before.body as unknown[]).length;
			const base = (before.body as Array<Record<string, unknown>>)[0];
			assert(base, 'expected at least one tourney fixture');
			const { tourneyId: _ignore, ...rest } = base;
			registry.db.tourneys.create({
				...(rest as Record<string, unknown>),
				name: 'Scenario smoke created',
			});
			const afterCreate = await fetchJson(baseUrl, '/tourneys');
			assert(Array.isArray(afterCreate.body), 'expected tourneys array after create');
			const afterCreateCount = (afterCreate.body as unknown[]).length;

			await fetchJson(baseUrl, '/tourneys', {
				headers: { 'x-rankup-mock-reset': '1' },
			});
			const afterReset = await fetchJson(baseUrl, '/tourneys');
			assert(Array.isArray(afterReset.body), 'expected tourneys array after reset');
			const afterResetCount = (afterReset.body as unknown[]).length;

			const pass = afterCreateCount === beforeCount + 1 && afterResetCount === beforeCount;
			results.push({
				name: 'reset (clears store)',
				pass,
				details: `before=${beforeCount} afterCreate=${afterCreateCount} afterReset=${afterResetCount}`,
			});
		}
	}

	return results;
}

async function main() {
	const { server, registry } = await createOpenApiMockServer();
	server.listen(0);
	await once(server, 'listening');
	const address = server.address();
	if (!address || typeof address !== 'object') {
		throw new Error('Failed to start server');
	}
	const baseUrl = `http://127.0.0.1:${address.port}`;
	console.log(`[smoke-scenario] server listening on ${baseUrl}`);

	try {
		const results = await runSmoke(baseUrl, registry);
		let failed = 0;
		for (const result of results) {
			const status = result.pass ? 'PASS' : 'FAIL';
			console.log(`[smoke-scenario] ${status} ${result.name}${result.details ? ` (${result.details})` : ''}`);
			if (!result.pass) failed += 1;
		}
		if (failed > 0) {
			throw new Error(`${failed} scenario checks failed`);
		}
	} finally {
		server.close();
	}
}

main().catch(error => {
	console.error('[smoke-scenario] fatal error', error);
	process.exitCode = 1;
});
