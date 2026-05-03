import type { MockDb, MockDbOptions } from '../mock-db.js';
import { createMockDb } from '../mock-db.js';
import { defaultMockHandlers } from './handlers.js';
import type { MockHandlerContextMap, MockHandlerResponseMap, MockHandlerResult, MockHandlers, OperationId } from './types.js';

export type MockRegistry = {
	db: MockDb;
	handlers: MockHandlers;
};

export type MockRegistryOptions = {
	db?: MockDb;
	dbOptions?: MockDbOptions;
	handlers?: Partial<MockHandlers>;
};

export function createMockRegistry(options: MockRegistryOptions = {}): MockRegistry {
	const db = options.db ?? createMockDb(options.dbOptions);
	const handlers: MockHandlers = {
		...defaultMockHandlers,
		...(options.handlers ?? {}),
	} as MockHandlers;

	return { db, handlers };
}

export async function executeMockHandler<K extends OperationId>(
	registry: MockRegistry,
	operationId: K,
	context: MockHandlerContextMap[K],
): Promise<MockHandlerResult<MockHandlerResponseMap[K]>> {
	return await registry.handlers[operationId](context, registry.db);
}
