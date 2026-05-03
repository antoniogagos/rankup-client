import { stableHash } from '../../shared/validation/stableHash.js';
import type { JsonValue } from '../../shared/models/json.js';
import type { IdempotencyScope } from '../types.js';

export function toIdempotencyStorageKey(scope: IdempotencyScope): string {
	return `${scope.actorId}:${scope.operationId}:${scope.resourceKey}:${scope.idempotencyKey}`;
}

export function createRequestFingerprint(value: JsonValue): string {
	return stableHash(value);
}
