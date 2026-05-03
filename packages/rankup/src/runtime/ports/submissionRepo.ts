import type { EngineSubmission } from '../types.js';

export interface SubmissionRepo {
	getByTournamentMatchdayUser(tournamentId: string, matchday: number, userId: string): Promise<EngineSubmission | null>;
	save(submission: EngineSubmission): Promise<void>;
	saveIfVersion(submission: EngineSubmission, expectedVersion: number): Promise<boolean>;
	listByTournamentMatchday(tournamentId: string, matchday: number): Promise<EngineSubmission[]>;
}
