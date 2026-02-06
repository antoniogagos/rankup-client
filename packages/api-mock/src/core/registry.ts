import type { MockDb } from '../mock-db.js';
import { createMockDb } from '../mock-db.js';
import { defaultMockHandlers } from './handlers.js';
import type { MockHandlerContextMap, MockHandlerResponseMap, MockHandlerResult, MockHandlers, OperationId } from './types.js';

export type MockRegistry = {
	db: MockDb;
	handlers: MockHandlers;
};

export type MockRegistryOptions = {
	db?: MockDb;
	handlers?: Partial<MockHandlers>;
};

export function createMockRegistry(options: MockRegistryOptions = {}): MockRegistry {
	const db = options.db ?? createMockDb();
	const handlers: MockHandlers = {
		...defaultMockHandlers,
		...(options.handlers ?? {}),
	} as MockHandlers;

	return { db, handlers };
}

export function executeMockHandler<K extends OperationId>(registry: MockRegistry, operationId: K, context: MockHandlerContextMap[K]): MockHandlerResult<MockHandlerResponseMap[K]> {
	return registry.handlers[operationId](context, registry.db);
}
