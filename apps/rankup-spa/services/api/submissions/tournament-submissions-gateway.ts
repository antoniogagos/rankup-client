import { mapMatchdaySubmission, mapMatchdaySubmissionSummaryPage, mapUpsertMatchdaySubmissionResult } from './submissions-mappers.js';
import type * as Api from '@rankup/api';
import type { ITournamentSubmissionsGateway } from '@rankup/rankup/domains/submissions/scorePrediction/contracts/tournamentSubmissionsGateway.js';
import type * as Domain from '@rankup/rankup/domains/submissions/scorePrediction/contracts/types.js';

export const operationOwners = {
	clearMyMatchdaySubmission: 'api.submissions.tournament.clearMyMatchdaySubmission',
	getMyMatchdaySubmission: 'api.submissions.tournament.getMyMatchdaySubmission',
	getUserMatchdaySubmission: 'api.submissions.tournament.getUserMatchdaySubmission',
	listMatchdaySubmissions: 'api.submissions.tournament.listMatchdaySubmissions',
	upsertMyMatchdaySubmission: 'api.submissions.tournament.upsertMyMatchdaySubmission',
} as const;

const mapListMatchdaySubmissionsQuery = (
	query?: Domain.ListMatchdaySubmissionsQuery,
): Api.ListMatchdaySubmissionsQuery | undefined =>
	query
		? {
				status: query.status,
				q: query.q,
				include: query.include,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapScorePredictionPredictionInput = (
	input: Domain.ScorePredictionPredictionInput,
): Api.ScorePredictionPredictionInput => ({
	matchId: input.matchId,
	homeScore: input.homeScore,
	awayScore: input.awayScore,
});

const isScorePredictionUpsertRequest = (
	request: Domain.UpsertMatchdaySubmissionRequest,
): request is Domain.UpsertScorePredictionMatchdaySubmissionRequest => request.gameModeId === 'scorePrediction';

const mapUpsertMatchdaySubmissionRequest = (
	request: Domain.UpsertMatchdaySubmissionRequest,
): Api.UpsertMatchdaySubmissionRequest => {
	if (isScorePredictionUpsertRequest(request)) {
		return {
			gameModeId: request.gameModeId,
			upserts: request.upserts?.map(mapScorePredictionPredictionInput),
			removes: request.removes,
			clientSubmittedAt: request.clientSubmittedAt,
		};
	}
	return request;
};

export class TournamentSubmissionsGateway implements ITournamentSubmissionsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMatchdaySubmissions(
		params: Domain.ListMatchdaySubmissionsParams,
		query?: Domain.ListMatchdaySubmissionsQuery,
	): Promise<Domain.MatchdaySubmissionSummaryPage> {
		const response = await this.apiClient.listMatchdaySubmissions(
			{ tournamentId: params.tournamentId, matchday: params.matchday },
			mapListMatchdaySubmissionsQuery(query),
		);
		return mapMatchdaySubmissionSummaryPage(response);
	}

	public async getMyMatchdaySubmission(params: Domain.GetMyMatchdaySubmissionParams): Promise<Domain.MatchdaySubmission> {
		const response = await this.apiClient.getMyMatchdaySubmission({
			tournamentId: params.tournamentId,
			matchday: params.matchday,
		});
		return mapMatchdaySubmission(response);
	}

	public async upsertMyMatchdaySubmission(
		params: Domain.UpsertMyMatchdaySubmissionParams,
		body: Domain.UpsertMatchdaySubmissionRequest,
	): Promise<Domain.UpsertMatchdaySubmissionResult> {
		const response = await this.apiClient.upsertMyMatchdaySubmission(
			{
				tournamentId: params.tournamentId,
				matchday: params.matchday,
				idempotencyKey: params.idempotencyKey,
				ifMatch: params.ifMatch,
			},
			mapUpsertMatchdaySubmissionRequest(body),
		);
		return mapUpsertMatchdaySubmissionResult(response);
	}

	public async clearMyMatchdaySubmission(params: Domain.ClearMyMatchdaySubmissionParams): Promise<void> {
		await this.apiClient.clearMyMatchdaySubmission({
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			idempotencyKey: params.idempotencyKey,
		});
	}

	public async getUserMatchdaySubmission(params: Domain.GetUserMatchdaySubmissionParams): Promise<Domain.MatchdaySubmission> {
		const response = await this.apiClient.getUserMatchdaySubmission({
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			userId: params.userId,
		});
		return mapMatchdaySubmission(response);
	}
}
