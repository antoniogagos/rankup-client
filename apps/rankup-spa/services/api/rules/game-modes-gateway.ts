import { mapGameMode, mapGameModeList } from './rules-mappers.js';
import type * as Api from '@rankup/api';
import type { IGameModesGateway } from '@rankup/rankup/domains/rules/gameModes/contracts/gameModesGateway.js';
import type * as Domain from '@rankup/rankup/domains/rules/gameModes/contracts/types.js';

const mapListGameModesQuery = (query?: Domain.ListGameModesQuery): Api.ListGameModesQuery | undefined =>
	query
		? {
			status: query.status,
			sportId: query.sportId,
			modality: query.modality,
		}
		: undefined;

export class GameModesGateway implements IGameModesGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listGameModes(query?: Domain.ListGameModesQuery): Promise<Domain.GameModeList> {
		const response = await this.apiClient.listGameModes(mapListGameModesQuery(query));
		return mapGameModeList(response);
	}

	public async getGameMode(params: Domain.GetGameModeParams): Promise<Domain.GameMode> {
		const response = await this.apiClient.getGameMode({ gameModeId: params.gameModeId });
		return mapGameMode(response);
	}
}
