import type { ClearMyMatchdaySubmissionParams, GetMyMatchdaySubmissionParams, GetUserMatchdaySubmissionParams, ListMatchdaySubmissionsParams, ListMatchdaySubmissionsQuery, MatchdaySubmission, MatchdaySubmissionSummaryPage, UpsertMatchdaySubmissionRequest, UpsertMatchdaySubmissionResult, UpsertMyMatchdaySubmissionParams } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITourneySubmissionsService {
	listMatchdaySubmissions(
		params: ListMatchdaySubmissionsParams,
		query?: ListMatchdaySubmissionsQuery,
	): Promise<MatchdaySubmissionSummaryPage>;
	getMyMatchdaySubmission(params: GetMyMatchdaySubmissionParams): Promise<MatchdaySubmission>;
	upsertMyMatchdaySubmission(
		params: UpsertMyMatchdaySubmissionParams,
		body: UpsertMatchdaySubmissionRequest,
	): Promise<UpsertMatchdaySubmissionResult>;
	clearMyMatchdaySubmission(params: ClearMyMatchdaySubmissionParams): Promise<void>;
	getUserMatchdaySubmission(params: GetUserMatchdaySubmissionParams): Promise<MatchdaySubmission>;
}

export const ITourneySubmissionsService = createDecorator<ITourneySubmissionsService>('tourneySubmissionsService');
