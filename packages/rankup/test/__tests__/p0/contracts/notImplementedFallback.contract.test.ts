import { createNotImplementedMockHandler } from '../../../../../api-mock/src/core/not-implemented-handler.js';
import { createMockDb } from '../../../../../api-mock/src/mock-db.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type ReleaseCriticalCatalog = {
	operationIds: string[];
};

describe('[P0] contract fallback canonicalization', () => {
	it('keeps non-critical notImplemented fallback in canonical ProblemDetails shape', () => {
		const releaseCatalog = JSON.parse(
			readFileSync(resolve(process.cwd(), 'diagnostics/release-critical-operations.json'), 'utf8'),
		) as ReleaseCriticalCatalog;
		const operationId = 'getMyPreferences';
		expect(releaseCatalog.operationIds).not.toContain(operationId);

		const response = createNotImplementedMockHandler(operationId)({}, createMockDb());
		expect(response.status).toBe(501);
		expect(response.response).toMatchObject({
			type: 'https://errors.rankup.dev/mock/not-implemented',
			title: 'Mock Handler Not Implemented',
			status: 501,
			code: 'mockHandlerNotImplemented',
		});
		expect(response.response.detail).toContain(operationId);
	});
});
