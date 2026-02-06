import { startOpenApiMockServer } from './openapi-contract.js';

function parsePort(value: string | undefined) {
	if (!value) return 4010;
	const parsed = Number.parseInt(value, 10);
	return Number.isNaN(parsed) ? 4010 : parsed;
}

async function main() {
	const port = parsePort(process.env.RANKUP_MOCK_PORT ?? process.env.PORT);
	const { server, baseUrl } = await startOpenApiMockServer({ port });
	console.log(`[openapi-mock] listening on ${baseUrl}`);

	const shutdown = () => {
		server.close(() => {
			process.exit(0);
		});
	};

	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);
}

main().catch(error => {
	console.error('[openapi-mock] failed to start', error);
	process.exitCode = 1;
});
