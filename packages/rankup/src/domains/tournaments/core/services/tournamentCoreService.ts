import type { ITournamentCoreService } from '../contracts/tournamentCore.js';
import type { ITournamentCoreGateway as TournamentCoreGateway } from '../contracts/tournamentCoreGateway.js';
import { ITournamentCoreGateway } from '../contracts/tournamentCoreGateway.js';
import type { CreateDuelRematchParams, CreateDuelRequest, CreateRematchRequest, CreateTournamentRequest, DuelPage, GetTournamentPreviewParams, GetTournamentPreviewQuery, ListMyDuelsQuery, ListMyTournamentsQuery, MyTournamentPage, Tournament, TournamentPreview } from '../contracts/types.js';
import { validateCreateTournamentRequest } from '../validation/validateCreateTournamentRequest.js';

export class TournamentCoreService implements ITournamentCoreService {
	public constructor(@ITournamentCoreGateway private readonly gateway: TournamentCoreGateway) {}

	public async listMyTournaments(query?: ListMyTournamentsQuery): Promise<MyTournamentPage> {
		return this.gateway.listMyTournaments(query);
	}

	public async listMyDuels(query?: ListMyDuelsQuery): Promise<DuelPage> {
		return this.gateway.listMyDuels(query);
	}

	public async createTournament(body: CreateTournamentRequest): Promise<Tournament> {
		validateCreateTournamentRequest(body);
		return this.gateway.createTournament(body);
	}

	public async createDuel(body: CreateDuelRequest): Promise<Tournament> {
		validateCreateTournamentRequest(body);
		return this.gateway.createDuel(body);
	}

	public async createDuelRematch(params: CreateDuelRematchParams, body?: CreateRematchRequest): Promise<Tournament> {
		return this.gateway.createDuelRematch(params, body);
	}

	public async getTournamentPreview(params: GetTournamentPreviewParams, query?: GetTournamentPreviewQuery): Promise<TournamentPreview> {
		return this.gateway.getTournamentPreview(params, query);
	}
}
