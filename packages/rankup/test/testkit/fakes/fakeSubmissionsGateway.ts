import type { ITournamentSubmissionsGateway } from '../../../src/domains/submissions/scorePrediction/contracts/tournamentSubmissionsGateway.js';
import type * as Submissions from '../../../src/domains/submissions/scorePrediction/contracts/types.js';
import { fixtures } from '@rankup/testkit/fixtures.js';

export type FakeSubmissionsGatewayCall = {
	op: keyof ITournamentSubmissionsGateway;
	params?: unknown;
	query?: unknown;
	body?: unknown;
};

export class FakeSubmissionsGateway implements ITournamentSubmissionsGateway {
	public readonly calls: FakeSubmissionsGatewayCall[] = [];

	public handlers: {
		listMatchdaySubmissions?: (
			params: Submissions.ListMatchdaySubmissionsParams,
			query?: Submissions.ListMatchdaySubmissionsQuery,
		) => Promise<Submissions.MatchdaySubmissionSummaryPage>;
		getMyMatchdaySubmission?: (params: Submissions.GetMyMatchdaySubmissionParams) => Promise<Submissions.MatchdaySubmission>;
		upsertMyMatchdaySubmission?: (
			params: Submissions.UpsertMyMatchdaySubmissionParams,
			body: Submissions.UpsertMatchdaySubmissionRequest,
		) => Promise<Submissions.UpsertMatchdaySubmissionResult>;
		clearMyMatchdaySubmission?: (params: Submissions.ClearMyMatchdaySubmissionParams) => Promise<void>;
		getUserMatchdaySubmission?: (params: Submissions.GetUserMatchdaySubmissionParams) => Promise<Submissions.MatchdaySubmission>;
	} = {};

	public async listMatchdaySubmissions(
		params: Submissions.ListMatchdaySubmissionsParams,
		query?: Submissions.ListMatchdaySubmissionsQuery,
	): Promise<Submissions.MatchdaySubmissionSummaryPage> {
		this.calls.push({ op: 'listMatchdaySubmissions', params, query });
		if (this.handlers.listMatchdaySubmissions) {
			return this.handlers.listMatchdaySubmissions(params, query);
		}
		return {
			serverTime: fixtures.builders.isoDate('2026-01-12T20:00:00.000Z'),
			items: [],
			nextCursor: undefined,
		};
	}

	public async getMyMatchdaySubmission(params: Submissions.GetMyMatchdaySubmissionParams): Promise<Submissions.MatchdaySubmission> {
		this.calls.push({ op: 'getMyMatchdaySubmission', params });
		if (this.handlers.getMyMatchdaySubmission) {
			return this.handlers.getMyMatchdaySubmission(params);
		}
		return fixtures.domain.submissions.matchdaySubmission() as Submissions.MatchdaySubmission;
	}

	public async upsertMyMatchdaySubmission(
		params: Submissions.UpsertMyMatchdaySubmissionParams,
		body: Submissions.UpsertMatchdaySubmissionRequest,
	): Promise<Submissions.UpsertMatchdaySubmissionResult> {
		this.calls.push({ op: 'upsertMyMatchdaySubmission', params, body });
		if (this.handlers.upsertMyMatchdaySubmission) {
			return this.handlers.upsertMyMatchdaySubmission(params, body);
		}
		return fixtures.domain.submissions.upsertMatchdaySubmissionResult() as Submissions.UpsertMatchdaySubmissionResult;
	}

	public async clearMyMatchdaySubmission(params: Submissions.ClearMyMatchdaySubmissionParams): Promise<void> {
		this.calls.push({ op: 'clearMyMatchdaySubmission', params });
		if (this.handlers.clearMyMatchdaySubmission) {
			return this.handlers.clearMyMatchdaySubmission(params);
		}
	}

	public async getUserMatchdaySubmission(params: Submissions.GetUserMatchdaySubmissionParams): Promise<Submissions.MatchdaySubmission> {
		this.calls.push({ op: 'getUserMatchdaySubmission', params });
		if (this.handlers.getUserMatchdaySubmission) {
			return this.handlers.getUserMatchdaySubmission(params);
		}
		return fixtures.domain.submissions.matchdaySubmission() as Submissions.MatchdaySubmission;
	}
}
