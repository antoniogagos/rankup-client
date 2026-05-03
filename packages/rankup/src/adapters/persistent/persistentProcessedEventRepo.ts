import { join } from 'node:path';
import type { ProcessedEventRepo } from '../../runtime/ports/processedEventRepo.js';
import { createStructuredCloneCodec, PersistentJsonMapStore } from './persistentJsonMapStore.js';

const DEFAULT_FILE_NAME = 'processed-events.json';

export type PersistentProcessedEventRepoOptions = {
	baseDir: string;
	fileName?: string;
	seed?: ReadonlyArray<string>;
};

export class PersistentProcessedEventRepo implements ProcessedEventRepo {
	private readonly store: PersistentJsonMapStore<boolean>;

	public constructor(options: PersistentProcessedEventRepoOptions) {
		this.store = new PersistentJsonMapStore<boolean>({
			filePath: join(options.baseDir, options.fileName ?? DEFAULT_FILE_NAME),
			codec: createStructuredCloneCodec<boolean>(),
			seed: (options.seed ?? []).map(eventKey => ({ key: eventKey, value: true })),
		});
	}

	public async has(eventKey: string): Promise<boolean> {
		return this.store.has(eventKey);
	}

	public async mark(eventKey: string): Promise<void> {
		await this.store.set(eventKey, true);
	}

	public async markIfAbsent(eventKey: string): Promise<boolean> {
		return this.store.transact(records => {
			if (records.has(eventKey)) {
				return { result: false, persist: false };
			}
			records.set(eventKey, true);
			return { result: true, persist: true };
		});
	}
}
