import type { CreateDuelRematchParams, CreateDuelRequest, CreateRematchRequest, CreateTournamentRequest, DuelPage, GetTournamentPreviewParams, GetTournamentPreviewQuery, ListMyDuelsQuery, ListMyTournamentsQuery, MyTournamentPage, Tournament, TournamentPreview } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITourneyCoreService {
	listMyTournaments(query?: ListMyTournamentsQuery): Promise<MyTournamentPage>;
	listMyDuels(query?: ListMyDuelsQuery): Promise<DuelPage>;
	createTournament(body: CreateTournamentRequest): Promise<Tournament>;
	createDuel(body: CreateDuelRequest): Promise<Tournament>;
	createDuelRematch(params: CreateDuelRematchParams, body?: CreateRematchRequest): Promise<Tournament>;
	getTournamentPreview(params: GetTournamentPreviewParams, query?: GetTournamentPreviewQuery): Promise<TournamentPreview>;
}

export const ITourneyCoreService = createDecorator<ITourneyCoreService>('tourneyCoreService');
