import { createMockApiServer, type MockApiServerOptions } from '@rankup/api-mock/create-server.js';

export type StartedApiMock = {
	baseUrl: string;
	stop: () => Promise<void>;
};

export async function startApiMock(options: MockApiServerOptions = {}): Promise<StartedApiMock> {
	const server = await createMockApiServer({
		...options,
		port: options.port ?? 0,
	});

	return {
		baseUrl: server.url,
		stop: async () => {
			await server.close();
		},
	};
}
