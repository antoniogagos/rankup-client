import type { IdempotencyOutcome, IdempotencyScope } from '../types.js';

export interface IdempotencyPort {
	get(scope: IdempotencyScope): Promise<IdempotencyOutcome | null>;
	set(scope: IdempotencyScope, outcome: IdempotencyOutcome): Promise<void>;
}
