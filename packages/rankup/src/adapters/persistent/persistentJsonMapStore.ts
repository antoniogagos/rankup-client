import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { JsonObject, JsonValue } from '../../shared/models/json.js';

export type PersistentJsonMapCodec<TValue> = {
	clone: (value: TValue) => TValue;
	fromJson: (value: JsonValue, key: string, filePath: string) => TValue;
	toJson: (value: TValue) => JsonValue;
};

type PersistentJsonMapSeedEntry<TValue> = {
	key: string;
	value: TValue;
};

type PersistentJsonMapMutationResult<TResult> = {
	result: TResult;
	persist: boolean;
};

export type PersistentJsonMapStoreOptions<TValue> = {
	filePath: string;
	codec: PersistentJsonMapCodec<TValue>;
	seed?: ReadonlyArray<PersistentJsonMapSeedEntry<TValue>>;
};

function toJsonObject(filePath: string, value: JsonValue): JsonObject {
	if (value === null || Array.isArray(value) || typeof value !== 'object') {
		throw new Error(`Persistent store file ${filePath} must contain a JSON object.`);
	}
	return value as JsonObject;
}

function isErrorWithCode(error: object, code: string): boolean {
	if (!('code' in error)) {
		return false;
	}
	const candidate = error as { code?: string };
	return candidate.code === code;
}

export function createStructuredCloneCodec<TValue>(): PersistentJsonMapCodec<TValue> {
	return {
		clone: value => structuredClone(value),
		fromJson: value => structuredClone(value as TValue),
		toJson: value => structuredClone(value) as JsonValue,
	};
}

export class PersistentJsonMapStore<TValue> {
	private readonly filePath: string;
	private readonly codec: PersistentJsonMapCodec<TValue>;
	private readonly seed: ReadonlyArray<PersistentJsonMapSeedEntry<TValue>>;
	private readonly records = new Map<string, TValue>();
	private readonly ready: Promise<void>;
	private queue: Promise<void> = Promise.resolve();

	public constructor(options: PersistentJsonMapStoreOptions<TValue>) {
		this.filePath = options.filePath;
		this.codec = options.codec;
		this.seed = options.seed ?? [];
		this.ready = this.initialize();
	}

	public async get(key: string): Promise<TValue | null> {
		return this.transact(records => {
			const value = records.get(key);
			if (value === undefined) {
				return { result: null, persist: false };
			}
			return { result: this.codec.clone(value), persist: false };
		});
	}

	public async set(key: string, value: TValue): Promise<void> {
		await this.transact(records => {
			records.set(key, this.codec.clone(value));
			return { result: undefined, persist: true };
		});
	}

	public async has(key: string): Promise<boolean> {
		return this.transact(records => ({ result: records.has(key), persist: false }));
	}

	public async listValues(): Promise<TValue[]> {
		return this.transact(records => ({ result: [...records.values()].map(value => this.codec.clone(value)), persist: false }));
	}

	public async transact<TResult>(operation: (records: Map<string, TValue>) => PersistentJsonMapMutationResult<TResult> | Promise<PersistentJsonMapMutationResult<TResult>>): Promise<TResult> {
		return this.runExclusive(async () => {
			const outcome = await operation(this.records);
			if (outcome.persist) {
				await this.persist();
			}
			return outcome.result;
		});
	}

	private async runExclusive<TResult>(operation: () => Promise<TResult>): Promise<TResult> {
		const execute = async (): Promise<TResult> => {
			await this.ready;
			return operation();
		};
		const next = this.queue.then(execute, execute);
		this.queue = next.then(() => undefined, () => undefined);
		return next;
	}

	private async initialize(): Promise<void> {
		await mkdir(dirname(this.filePath), { recursive: true });
		try {
			await this.loadFromFile();
			return;
		} catch (error) {
			if (typeof error === 'object' && error !== null && isErrorWithCode(error, 'ENOENT')) {
				this.applySeed();
				await this.persist();
				return;
			}
			throw error;
		}
	}

	private applySeed(): void {
		this.records.clear();
		for (const entry of this.seed) {
			this.records.set(entry.key, this.codec.clone(entry.value));
		}
	}

	private async loadFromFile(): Promise<void> {
		const contents = await readFile(this.filePath, 'utf8');
		const parsed = JSON.parse(contents) as JsonValue;
		const object = toJsonObject(this.filePath, parsed);
		this.records.clear();
		for (const [key, value] of Object.entries(object)) {
			this.records.set(key, this.codec.fromJson(value, key, this.filePath));
		}
	}

	private async persist(): Promise<void> {
		const object: JsonObject = {};
		for (const [key, value] of this.records) {
			object[key] = this.codec.toJson(value);
		}
		const serialized = `${JSON.stringify(object, null, 2)}\n`;
		const tempPath = `${this.filePath}.tmp`;
		await writeFile(tempPath, serialized, 'utf8');
		await rename(tempPath, this.filePath);
	}
}
