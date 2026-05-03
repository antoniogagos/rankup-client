import type { EngineRankingSnapshot } from '../types.js';

export interface ScoringRepo {
	getLatestSnapshot(tournamentId: string, scope: 'season' | 'matchday', matchday?: number): Promise<EngineRankingSnapshot | null>;
	saveSnapshot(snapshot: EngineRankingSnapshot): Promise<void>;
	listSnapshots(tournamentId: string): Promise<EngineRankingSnapshot[]>;
}
