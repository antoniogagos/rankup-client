import { join } from 'node:path';
import type { TournamentRepo } from '../../runtime/ports/tournamentRepo.js';
import type { EngineTournament } from '../../runtime/types.js';
import { createStructuredCloneCodec, PersistentJsonMapStore } from './persistentJsonMapStore.js';

const DEFAULT_FILE_NAME = 'tournaments.json';

export type PersistentTournamentRepoOptions = {
	baseDir: string;
	fileName?: string;
	seed?: ReadonlyArray<EngineTournament>;
};

export class PersistentTournamentRepo implements TournamentRepo {
	private readonly store: PersistentJsonMapStore<EngineTournament>;

	public constructor(options: PersistentTournamentRepoOptions) {
		this.store = new PersistentJsonMapStore<EngineTournament>({
			filePath: join(options.baseDir, options.fileName ?? DEFAULT_FILE_NAME),
			codec: createStructuredCloneCodec<EngineTournament>(),
			seed: (options.seed ?? []).map(tournament => ({ key: tournament.tournamentId, value: tournament })),
		});
	}

	public async getById(tournamentId: string): Promise<EngineTournament | null> {
		return this.store.get(tournamentId);
	}

	public async save(tournament: EngineTournament): Promise<void> {
		await this.store.set(tournament.tournamentId, tournament);
	}
}
