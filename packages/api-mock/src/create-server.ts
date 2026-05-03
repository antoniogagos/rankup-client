import { once } from 'node:events';
import type { Server } from 'node:http';
import { startOpenApiMockServer, type OpenApiMockServerOptions } from './server/openapi-contract.js';

export type MockApiServerOptions = OpenApiMockServerOptions & {
	port?: number;
	seed?: string;
	scenarioName?: string;
};

export type MockApiServer = {
	server: Server;
	url: string;
	port: number;
	close(): Promise<void>;
};

export async function createMockApiServer(options: MockApiServerOptions = {}): Promise<MockApiServer> {
	const running = await startOpenApiMockServer({
		...options,
		port: options.port ?? 0,
	});

	return {
		server: running.server,
		url: running.baseUrl,
		port: running.port,
		async close(): Promise<void> {
			running.server.close();
			await once(running.server, 'close');
		},
	};
}
