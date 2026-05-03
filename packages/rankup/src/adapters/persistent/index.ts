import type { EngineRankingSnapshot, EngineSubmission, EngineTournament } from '../../runtime/types.js';
import type { PersistentIdempotencySeedEntry } from './persistentIdempotencyPort.js';
import { PersistentIdempotencyPort } from './persistentIdempotencyPort.js';
import { PersistentProcessedEventRepo } from './persistentProcessedEventRepo.js';
import { PersistentScoringRepo } from './persistentScoringRepo.js';
import { PersistentSubmissionRepo } from './persistentSubmissionRepo.js';
import { PersistentTournamentRepo } from './persistentTournamentRepo.js';

export { PersistentIdempotencyPort } from './persistentIdempotencyPort.js';
export { PersistentProcessedEventRepo } from './persistentProcessedEventRepo.js';
export { PersistentScoringRepo } from './persistentScoringRepo.js';
export { PersistentSubmissionRepo } from './persistentSubmissionRepo.js';
export { PersistentTournamentRepo } from './persistentTournamentRepo.js';

export type PersistentRuntimeAdaptersSeed = {
	tournaments?: ReadonlyArray<EngineTournament>;
	submissions?: ReadonlyArray<EngineSubmission>;
	idempotencyOutcomes?: ReadonlyArray<PersistentIdempotencySeedEntry>;
	processedEventKeys?: ReadonlyArray<string>;
	scoringSnapshots?: ReadonlyArray<EngineRankingSnapshot>;
};

export type PersistentRuntimeAdapterFiles = {
	tournaments?: string;
	submissions?: string;
	idempotency?: string;
	processedEvents?: string;
	scoringSnapshots?: string;
};

export type PersistentRuntimeAdaptersOptions = {
	baseDir: string;
	seed?: PersistentRuntimeAdaptersSeed;
	files?: PersistentRuntimeAdapterFiles;
};

export type PersistentRuntimeAdapters = {
	tournamentRepo: PersistentTournamentRepo;
	submissionRepo: PersistentSubmissionRepo;
	idempotencyPort: PersistentIdempotencyPort;
	processedEventRepo: PersistentProcessedEventRepo;
	scoringRepo: PersistentScoringRepo;
};

export function createPersistentRuntimeAdapters(options: PersistentRuntimeAdaptersOptions): PersistentRuntimeAdapters {
	const seed = options.seed ?? {};
	const files = options.files ?? {};
	return {
		tournamentRepo: new PersistentTournamentRepo({ baseDir: options.baseDir, fileName: files.tournaments, seed: seed.tournaments }),
		submissionRepo: new PersistentSubmissionRepo({ baseDir: options.baseDir, fileName: files.submissions, seed: seed.submissions }),
		idempotencyPort: new PersistentIdempotencyPort({ baseDir: options.baseDir, fileName: files.idempotency, seed: seed.idempotencyOutcomes }),
		processedEventRepo: new PersistentProcessedEventRepo({ baseDir: options.baseDir, fileName: files.processedEvents, seed: seed.processedEventKeys }),
		scoringRepo: new PersistentScoringRepo({ baseDir: options.baseDir, fileName: files.scoringSnapshots, seed: seed.scoringSnapshots }),
	};
}
