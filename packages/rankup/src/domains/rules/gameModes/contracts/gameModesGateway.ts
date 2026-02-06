import type { GameMode, GameModeList, GetGameModeParams, ListGameModesQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IGameModesGateway {
	listGameModes(query?: ListGameModesQuery): Promise<GameModeList>;
	getGameMode(params: GetGameModeParams): Promise<GameMode>;
}

export const IGameModesGateway = createDecorator<IGameModesGateway>('gameModesGateway');
