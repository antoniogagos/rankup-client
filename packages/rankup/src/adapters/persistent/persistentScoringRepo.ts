import { join } from 'node:path';
import type { ScoringRepo } from '../../runtime/ports/scoringRepo.js';
import type { EngineRankingSnapshot } from '../../runtime/types.js';
import { createStructuredCloneCodec, PersistentJsonMapStore } from './persistentJsonMapStore.js';

const DEFAULT_FILE_NAME = 'scoring-snapshots.json';

export type PersistentScoringRepoOptions = {
	baseDir: string;
	fileName?: string;
	seed?: ReadonlyArray<EngineRankingSnapshot>;
};

export class PersistentScoringRepo implements ScoringRepo {
	private readonly store: PersistentJsonMapStore<EngineRankingSnapshot>;

	public constructor(options: PersistentScoringRepoOptions) {
		this.store = new PersistentJsonMapStore<EngineRankingSnapshot>({
			filePath: join(options.baseDir, options.fileName ?? DEFAULT_FILE_NAME),
			codec: createStructuredCloneCodec<EngineRankingSnapshot>(),
			seed: (options.seed ?? []).map(snapshot => ({ key: snapshot.snapshotId, value: snapshot })),
		});
	}

	public async getLatestSnapshot(tournamentId: string, scope: 'season' | 'matchday', matchday?: number): Promise<EngineRankingSnapshot | null> {
		return this.store.transact(records => {
			const snapshots = [...records.values()]
				.filter(snapshot => snapshot.tournamentId === tournamentId && snapshot.scope === scope && snapshot.matchday === matchday)
				.sort((left, right) => {
					const byComputedAt = right.computedAt.localeCompare(left.computedAt);
					if (byComputedAt !== 0) {
						return byComputedAt;
					}
					return right.snapshotId.localeCompare(left.snapshotId);
				});
			const latest = snapshots[0];
			if (latest === undefined) {
				return { result: null, persist: false };
			}
			return { result: structuredClone(latest), persist: false };
		});
	}

	public async saveSnapshot(snapshot: EngineRankingSnapshot): Promise<void> {
		await this.store.set(snapshot.snapshotId, snapshot);
	}

	public async listSnapshots(tournamentId: string): Promise<EngineRankingSnapshot[]> {
		return this.store.transact(records => {
			const snapshots = [...records.values()]
				.filter(snapshot => snapshot.tournamentId === tournamentId)
				.sort((left, right) => left.computedAt.localeCompare(right.computedAt))
				.map(snapshot => structuredClone(snapshot));
			return { result: snapshots, persist: false };
		});
	}
}
