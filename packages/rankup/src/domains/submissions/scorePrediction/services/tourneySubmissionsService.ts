import type { ITourneySubmissionsService } from '../contracts/tourneySubmissions.js';
import type { ITourneySubmissionsGateway as TourneySubmissionsGateway } from '../contracts/tourneySubmissionsGateway.js';
import { ITourneySubmissionsGateway } from '../contracts/tourneySubmissionsGateway.js';
import type { ClearMyMatchdaySubmissionParams, GetMyMatchdaySubmissionParams, GetUserMatchdaySubmissionParams, ListMatchdaySubmissionsParams, ListMatchdaySubmissionsQuery, MatchdaySubmission, MatchdaySubmissionSummaryPage, UpsertMatchdaySubmissionRequest, UpsertMatchdaySubmissionResult, UpsertMyMatchdaySubmissionParams } from '../contracts/types.js';

export class TourneySubmissionsService implements ITourneySubmissionsService {
	public constructor(@ITourneySubmissionsGateway private readonly gateway: TourneySubmissionsGateway) {}

	public async listMatchdaySubmissions(
		params: ListMatchdaySubmissionsParams,
		query?: ListMatchdaySubmissionsQuery,
	): Promise<MatchdaySubmissionSummaryPage> {
		return this.gateway.listMatchdaySubmissions(params, query);
	}

	public async getMyMatchdaySubmission(params: GetMyMatchdaySubmissionParams): Promise<MatchdaySubmission> {
		return this.gateway.getMyMatchdaySubmission(params);
	}

	public async upsertMyMatchdaySubmission(
		params: UpsertMyMatchdaySubmissionParams,
		body: UpsertMatchdaySubmissionRequest,
	): Promise<UpsertMatchdaySubmissionResult> {
		return this.gateway.upsertMyMatchdaySubmission(params, body);
	}

	public async clearMyMatchdaySubmission(params: ClearMyMatchdaySubmissionParams): Promise<void> {
		return this.gateway.clearMyMatchdaySubmission(params);
	}

	public async getUserMatchdaySubmission(params: GetUserMatchdaySubmissionParams): Promise<MatchdaySubmission> {
		return this.gateway.getUserMatchdaySubmission(params);
	}
}
