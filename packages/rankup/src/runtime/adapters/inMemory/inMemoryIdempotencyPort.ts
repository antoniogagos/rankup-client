import type { IdempotencyPort } from '../../ports/idempotencyPort.js';
import type { IdempotencyOutcome, IdempotencyScope } from '../../types.js';
import { toIdempotencyStorageKey } from '../../utils/idempotency.js';

function cloneOutcome(outcome: IdempotencyOutcome): IdempotencyOutcome {
	return {
		...outcome,
		headers: { ...outcome.headers },
	};
}

export class InMemoryIdempotencyPort implements IdempotencyPort {
	private readonly outcomes = new Map<string, IdempotencyOutcome>();

	public async get(scope: IdempotencyScope): Promise<IdempotencyOutcome | null> {
		const outcome = this.outcomes.get(toIdempotencyStorageKey(scope));
		return outcome ? cloneOutcome(outcome) : null;
	}

	public async set(scope: IdempotencyScope, outcome: IdempotencyOutcome): Promise<void> {
		this.outcomes.set(toIdempotencyStorageKey(scope), cloneOutcome(outcome));
	}
}
