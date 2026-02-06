import type { IVerifiedEventsService } from '../contracts/events.js';
import type { IVerifiedEventsGateway as VerifiedEventsGateway } from '../contracts/eventsGateway.js';
import { IVerifiedEventsGateway } from '../contracts/eventsGateway.js';
import type { GetVerifiedEventParams, GetVerifiedEventQuery, GetVerifiedTournamentParams, ListVerifiedEventTournamentsParams, ListVerifiedEventTournamentsQuery, ListVerifiedEventsQuery, ListVerifiedTournamentsQuery, VerifiedEvent, VerifiedEventPage, VerifiedTournamentPage, VerifiedTournamentPreview } from '../contracts/types.js';

export class VerifiedEventsService implements IVerifiedEventsService {
	public constructor(@IVerifiedEventsGateway private readonly gateway: VerifiedEventsGateway) {}

	public async listVerifiedEvents(query?: ListVerifiedEventsQuery): Promise<VerifiedEventPage> {
		return this.gateway.listVerifiedEvents(query);
	}

	public async getVerifiedEvent(params: GetVerifiedEventParams, query?: GetVerifiedEventQuery): Promise<VerifiedEvent> {
		return this.gateway.getVerifiedEvent(params, query);
	}

	public async listVerifiedEventTournaments(
		params: ListVerifiedEventTournamentsParams,
		query?: ListVerifiedEventTournamentsQuery,
	): Promise<VerifiedTournamentPage> {
		return this.gateway.listVerifiedEventTournaments(params, query);
	}

	public async listVerifiedTournaments(query?: ListVerifiedTournamentsQuery): Promise<VerifiedTournamentPage> {
		return this.gateway.listVerifiedTournaments(query);
	}

	public async getVerifiedTournamentPreview(params: GetVerifiedTournamentParams): Promise<VerifiedTournamentPreview> {
		return this.gateway.getVerifiedTournamentPreview(params);
	}
}
