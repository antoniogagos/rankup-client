import type { ITourneyCoreService } from '../contracts/tourneyCore.js';
import type { ITourneyCoreGateway as TourneyCoreGateway } from '../contracts/tourneyCoreGateway.js';
import { ITourneyCoreGateway } from '../contracts/tourneyCoreGateway.js';
import type { CreateDuelRematchParams, CreateDuelRequest, CreateRematchRequest, CreateTournamentRequest, DuelPage, GetTournamentPreviewParams, GetTournamentPreviewQuery, ListMyDuelsQuery, ListMyTournamentsQuery, MyTournamentPage, Tournament, TournamentPreview } from '../contracts/types.js';
import { validateCreateTournamentRequest } from '../validation/validateCreateTournamentRequest.js';

export class TourneyCoreService implements ITourneyCoreService {
	public constructor(@ITourneyCoreGateway private readonly gateway: TourneyCoreGateway) {}

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
