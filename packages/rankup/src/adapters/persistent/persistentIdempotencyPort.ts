import { join } from 'node:path';
import type { IdempotencyPort } from '../../runtime/ports/idempotencyPort.js';
import type { IdempotencyOutcome, IdempotencyScope } from '../../runtime/types.js';
import { toIdempotencyStorageKey } from '../../runtime/utils/idempotency.js';
import { createStructuredCloneCodec, PersistentJsonMapStore } from './persistentJsonMapStore.js';

const DEFAULT_FILE_NAME = 'idempotency.json';

export type PersistentIdempotencySeedEntry = {
	scope: IdempotencyScope;
	outcome: IdempotencyOutcome;
};

export type PersistentIdempotencyPortOptions = {
	baseDir: string;
	fileName?: string;
	seed?: ReadonlyArray<PersistentIdempotencySeedEntry>;
};

export class PersistentIdempotencyPort implements IdempotencyPort {
	private readonly store: PersistentJsonMapStore<IdempotencyOutcome>;

	public constructor(options: PersistentIdempotencyPortOptions) {
		this.store = new PersistentJsonMapStore<IdempotencyOutcome>({
			filePath: join(options.baseDir, options.fileName ?? DEFAULT_FILE_NAME),
			codec: createStructuredCloneCodec<IdempotencyOutcome>(),
			seed: (options.seed ?? []).map(entry => ({ key: toIdempotencyStorageKey(entry.scope), value: entry.outcome })),
		});
	}

	public async get(scope: IdempotencyScope): Promise<IdempotencyOutcome | null> {
		return this.store.get(toIdempotencyStorageKey(scope));
	}

	public async set(scope: IdempotencyScope, outcome: IdempotencyOutcome): Promise<void> {
		await this.store.set(toIdempotencyStorageKey(scope), outcome);
	}
}
