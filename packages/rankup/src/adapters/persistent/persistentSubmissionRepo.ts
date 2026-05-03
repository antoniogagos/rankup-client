import { join } from 'node:path';
import type { SubmissionRepo } from '../../runtime/ports/submissionRepo.js';
import type { EngineSubmission } from '../../runtime/types.js';
import { createStructuredCloneCodec, PersistentJsonMapStore } from './persistentJsonMapStore.js';

const DEFAULT_FILE_NAME = 'submissions.json';

function toSubmissionKey(tournamentId: string, matchday: number, userId: string): string {
	return `${tournamentId}:${matchday}:${userId}`;
}

export type PersistentSubmissionRepoOptions = {
	baseDir: string;
	fileName?: string;
	seed?: ReadonlyArray<EngineSubmission>;
};

export class PersistentSubmissionRepo implements SubmissionRepo {
	private readonly store: PersistentJsonMapStore<EngineSubmission>;

	public constructor(options: PersistentSubmissionRepoOptions) {
		this.store = new PersistentJsonMapStore<EngineSubmission>({
			filePath: join(options.baseDir, options.fileName ?? DEFAULT_FILE_NAME),
			codec: createStructuredCloneCodec<EngineSubmission>(),
			seed: (options.seed ?? []).map(submission => ({ key: toSubmissionKey(submission.tournamentId, submission.matchday, submission.userId), value: submission })),
		});
	}

	public async getByTournamentMatchdayUser(tournamentId: string, matchday: number, userId: string): Promise<EngineSubmission | null> {
		return this.store.get(toSubmissionKey(tournamentId, matchday, userId));
	}

	public async save(submission: EngineSubmission): Promise<void> {
		await this.store.set(toSubmissionKey(submission.tournamentId, submission.matchday, submission.userId), submission);
	}

	public async saveIfVersion(submission: EngineSubmission, expectedVersion: number): Promise<boolean> {
		return this.store.transact(records => {
			const key = toSubmissionKey(submission.tournamentId, submission.matchday, submission.userId);
			const existing = records.get(key);
			if (existing === undefined) {
				if (expectedVersion !== 1) {
					return { result: false, persist: false };
				}
				records.set(key, structuredClone(submission));
				return { result: true, persist: true };
			}
			if (existing.version !== expectedVersion) {
				return { result: false, persist: false };
			}
			records.set(key, structuredClone(submission));
			return { result: true, persist: true };
		});
	}

	public async listByTournamentMatchday(tournamentId: string, matchday: number): Promise<EngineSubmission[]> {
		return this.store.transact(records => {
			const submissions: EngineSubmission[] = [];
			for (const submission of records.values()) {
				if (submission.tournamentId === tournamentId && submission.matchday === matchday) {
					submissions.push(structuredClone(submission));
				}
			}
			return { result: submissions, persist: false };
		});
	}
}
