import type { SubmissionRepo } from '../../ports/submissionRepo.js';
import type { EngineSubmission } from '../../types.js';

function toKey(tournamentId: string, matchday: number, userId: string): string {
	return `${tournamentId}:${matchday}:${userId}`;
}

function cloneSubmission(submission: EngineSubmission): EngineSubmission {
	return {
		...submission,
		predictions: { ...submission.predictions },
		completion: { ...submission.completion },
	};
}

export class InMemorySubmissionRepo implements SubmissionRepo {
	private readonly submissions = new Map<string, EngineSubmission>();

	public constructor(seed: EngineSubmission[] = []) {
		for (const submission of seed) {
			this.submissions.set(toKey(submission.tournamentId, submission.matchday, submission.userId), cloneSubmission(submission));
		}
	}

	public async getByTournamentMatchdayUser(tournamentId: string, matchday: number, userId: string): Promise<EngineSubmission | null> {
		const submission = this.submissions.get(toKey(tournamentId, matchday, userId));
		return submission ? cloneSubmission(submission) : null;
	}

	public async save(submission: EngineSubmission): Promise<void> {
		this.submissions.set(toKey(submission.tournamentId, submission.matchday, submission.userId), cloneSubmission(submission));
	}

	public async saveIfVersion(submission: EngineSubmission, expectedVersion: number): Promise<boolean> {
		const key = toKey(submission.tournamentId, submission.matchday, submission.userId);
		const existing = this.submissions.get(key);
		if (!existing) {
			if (expectedVersion !== 1) {
				return false;
			}
			this.submissions.set(key, cloneSubmission(submission));
			return true;
		}
		if (existing.version !== expectedVersion) {
			return false;
		}
		this.submissions.set(key, cloneSubmission(submission));
		return true;
	}

	public async listByTournamentMatchday(tournamentId: string, matchday: number): Promise<EngineSubmission[]> {
		const entries: EngineSubmission[] = [];
		for (const submission of this.submissions.values()) {
			if (submission.tournamentId === tournamentId && submission.matchday === matchday) {
				entries.push(cloneSubmission(submission));
			}
		}
		return entries;
	}
}
