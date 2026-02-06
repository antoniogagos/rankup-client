import { mapVerifiedEvent, mapVerifiedEventPage, mapVerifiedTournamentPage, mapVerifiedTournamentPreview } from './verified-mappers.js';
import type * as Api from '@rankup/api';
import type { IVerifiedEventsGateway } from '@rankup/rankup/domains/verified/events/contracts/eventsGateway.js';
import type * as Domain from '@rankup/rankup/domains/verified/events/contracts/types.js';

const mapListVerifiedEventsQuery = (query?: Domain.ListVerifiedEventsQuery): Api.ListVerifiedEventsQuery | undefined =>
	query
		? {
			status: query.status,
			sportId: query.sportId,
			gameModeId: query.gameModeId,
			region: query.region,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetVerifiedEventQuery = (query?: Domain.GetVerifiedEventQuery): Api.GetVerifiedEventQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapListVerifiedEventTournamentsQuery = (
	query?: Domain.ListVerifiedEventTournamentsQuery,
): Api.ListVerifiedEventTournamentsQuery | undefined =>
	query
		? {
			status: query.status,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListVerifiedTournamentsQuery = (query?: Domain.ListVerifiedTournamentsQuery): Api.ListVerifiedTournamentsQuery | undefined =>
	query
		? {
			status: query.status,
			sportId: query.sportId,
			gameModeId: query.gameModeId,
			eventId: query.eventId,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class VerifiedEventsGateway implements IVerifiedEventsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listVerifiedEvents(query?: Domain.ListVerifiedEventsQuery): Promise<Domain.VerifiedEventPage> {
		const response = await this.apiClient.listVerifiedEvents(mapListVerifiedEventsQuery(query));
		return mapVerifiedEventPage(response);
	}

	public async getVerifiedEvent(
		params: Domain.GetVerifiedEventParams,
		query?: Domain.GetVerifiedEventQuery,
	): Promise<Domain.VerifiedEvent> {
		const response = await this.apiClient.getVerifiedEvent({ eventId: params.eventId }, mapGetVerifiedEventQuery(query));
		return mapVerifiedEvent(response);
	}

	public async listVerifiedEventTournaments(
		params: Domain.ListVerifiedEventTournamentsParams,
		query?: Domain.ListVerifiedEventTournamentsQuery,
	): Promise<Domain.VerifiedTournamentPage> {
		const response = await this.apiClient.listVerifiedEventTournaments(
			{ eventId: params.eventId },
			mapListVerifiedEventTournamentsQuery(query),
		);
		return mapVerifiedTournamentPage(response);
	}

	public async listVerifiedTournaments(query?: Domain.ListVerifiedTournamentsQuery): Promise<Domain.VerifiedTournamentPage> {
		const response = await this.apiClient.listVerifiedTournaments(mapListVerifiedTournamentsQuery(query));
		return mapVerifiedTournamentPage(response);
	}

	public async getVerifiedTournamentPreview(
		params: Domain.GetVerifiedTournamentParams,
	): Promise<Domain.VerifiedTournamentPreview> {
		const response = await this.apiClient.getVerifiedTournamentPreview({ tournamentId: params.tournamentId });
		return mapVerifiedTournamentPreview(response);
	}
}
