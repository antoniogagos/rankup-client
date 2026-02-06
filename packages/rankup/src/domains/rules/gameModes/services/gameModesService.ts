import type { IGameModesService } from '../contracts/gameModes.js';
import type { IGameModesGateway as GameModesGateway } from '../contracts/gameModesGateway.js';
import { IGameModesGateway } from '../contracts/gameModesGateway.js';
import type { GameMode, GameModeList, GetGameModeParams, ListGameModesQuery } from '../contracts/types.js';

export class GameModesService implements IGameModesService {
	public constructor(@IGameModesGateway private readonly gateway: GameModesGateway) {}

	public async listGameModes(query?: ListGameModesQuery): Promise<GameModeList> {
		return this.gateway.listGameModes(query);
	}

	public async getGameMode(params: GetGameModeParams): Promise<GameMode> {
		return this.gateway.getGameMode(params);
	}
}
