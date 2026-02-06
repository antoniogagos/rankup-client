import type { GetVerifiedEventParams, GetVerifiedEventQuery, GetVerifiedTournamentParams, ListVerifiedEventTournamentsParams, ListVerifiedEventTournamentsQuery, ListVerifiedEventsQuery, ListVerifiedTournamentsQuery, VerifiedEvent, VerifiedEventPage, VerifiedTournamentPage, VerifiedTournamentPreview } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IVerifiedEventsService {
	listVerifiedEvents(query?: ListVerifiedEventsQuery): Promise<VerifiedEventPage>;
	getVerifiedEvent(params: GetVerifiedEventParams, query?: GetVerifiedEventQuery): Promise<VerifiedEvent>;
	listVerifiedEventTournaments(
		params: ListVerifiedEventTournamentsParams,
		query?: ListVerifiedEventTournamentsQuery,
	): Promise<VerifiedTournamentPage>;
	listVerifiedTournaments(query?: ListVerifiedTournamentsQuery): Promise<VerifiedTournamentPage>;
	getVerifiedTournamentPreview(params: GetVerifiedTournamentParams): Promise<VerifiedTournamentPreview>;
}

export const IVerifiedEventsService = createDecorator<IVerifiedEventsService>('verifiedEventsService');
