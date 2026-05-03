import type { MyTournamentItem, MyTournamentPage } from '@rankup/api';
import { startOpenApiMockServer } from './openapi-contract.js';
import type { MockRegistry } from '../core/registry.js';

async function fetchTournaments(baseUrl: string): Promise<MyTournamentItem[]> {
	const response = await fetch(`${baseUrl}/me/tournaments`);
	const page = (await response.json()) as MyTournamentPage;
	return page.items ?? [];
}

async function runSelfTest(baseUrl: string, registry?: MockRegistry) {
	const results: Array<{ name: string; status: number }> = [];

	const userResponse = await fetch(`${baseUrl}/users/test-user`);
	results.push({ name: 'getUser (mocked)', status: userResponse.status });

	const competitionResponse = await fetch(`${baseUrl}/competitions`);
	results.push({ name: 'listCompetitions (mocked)', status: competitionResponse.status });

	const tokenResponse = await fetch(`${baseUrl}/auth/oauth/token`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ grantType: 'authorization_code', provider: 'google', code: 'mock-code', redirectUri: 'http://localhost' }),
	});

	results.push({ name: 'token (validation fail)', status: tokenResponse.status });

	if (registry?.db?.tournaments) {
		const before = await fetchTournaments(baseUrl);
		const base = before[0];
		if (base) {
			const created = registry.db.tournaments.create({
				tournamentId: 'tournament-crud',
				tournament: {
					...base.tournament,
					tournamentId: 'tournament-crud',
					name: 'CRUD: created',
				},
				membership: base.membership,
			});
			const afterCreate = await fetchTournaments(baseUrl);
			results.push({
				name: 'tournament create reflected',
				status: afterCreate.length === before.length + 1 ? 200 : 500,
			});

			registry.db.tournaments.update(created.tournamentId, {
				tournament: { ...created.tournament, name: 'CRUD: updated' },
			});
			const afterUpdate = await fetchTournaments(baseUrl);
			const updated = afterUpdate.find(item => item.tournament.tournamentId === created.tournamentId);
			results.push({
				name: 'tournament update reflected',
				status: updated?.tournament.name === 'CRUD: updated' ? 200 : 500,
			});

			registry.db.tournaments.remove(created.tournamentId);
			const afterDelete = await fetchTournaments(baseUrl);
			results.push({
				name: 'tournament delete reflected',
				status: afterDelete.length === before.length ? 200 : 500,
			});
		}
	}

	console.log('[spike-contract] self-test results');
	for (const result of results) {
		console.log(`- ${result.name}: ${result.status}`);
	}
}

async function main() {
	const serveOnly = process.argv.includes('--serve');
	const { server, baseUrl, registry } = await startOpenApiMockServer({
		port: serveOnly ? 4010 : 0,
	});
	console.log(`[spike-contract] server listening on ${baseUrl}`);

	if (serveOnly) return;

	try {
		await runSelfTest(baseUrl, registry);
	} finally {
		server.close();
	}
}

main().catch(error => {
	console.error('[spike-contract] fatal error', error);
	process.exitCode = 1;
});
