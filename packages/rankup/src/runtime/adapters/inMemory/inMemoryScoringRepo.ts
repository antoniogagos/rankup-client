import type { ScoringRepo } from '../../ports/scoringRepo.js';
import type { EngineRankingSnapshot } from '../../types.js';

function cloneSnapshot(snapshot: EngineRankingSnapshot): EngineRankingSnapshot {
	return {
		...snapshot,
		entries: snapshot.entries.map(entry => ({
			...entry,
			metrics: { ...entry.metrics },
		})),
	};
}

export class InMemoryScoringRepo implements ScoringRepo {
	private readonly snapshots = new Map<string, EngineRankingSnapshot>();

	public constructor(seed: EngineRankingSnapshot[] = []) {
		for (const snapshot of seed) {
			this.snapshots.set(snapshot.snapshotId, cloneSnapshot(snapshot));
		}
	}

	public async getLatestSnapshot(tournamentId: string, scope: 'season' | 'matchday', matchday?: number): Promise<EngineRankingSnapshot | null> {
		const candidates = [...this.snapshots.values()]
			.filter(snapshot => snapshot.tournamentId === tournamentId && snapshot.scope === scope && snapshot.matchday === matchday)
			.sort((left, right) => {
				const byComputedAt = right.computedAt.localeCompare(left.computedAt);
				if (byComputedAt !== 0) {
					return byComputedAt;
				}
				return right.snapshotId.localeCompare(left.snapshotId);
			});
		const latest = candidates[0];
		return latest ? cloneSnapshot(latest) : null;
	}

	public async saveSnapshot(snapshot: EngineRankingSnapshot): Promise<void> {
		this.snapshots.set(snapshot.snapshotId, cloneSnapshot(snapshot));
	}

	public async listSnapshots(tournamentId: string): Promise<EngineRankingSnapshot[]> {
		const snapshots = [...this.snapshots.values()].filter(snapshot => snapshot.tournamentId === tournamentId);
		snapshots.sort((left, right) => left.computedAt.localeCompare(right.computedAt));
		return snapshots.map(cloneSnapshot);
	}
}
