import type { GameMode, GameModeList, GetGameModeParams, ListGameModesQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IGameModesService {
	listGameModes(query?: ListGameModesQuery): Promise<GameModeList>;
	getGameMode(params: GetGameModeParams): Promise<GameMode>;
}

export const IGameModesService = createDecorator<IGameModesService>('gameModesService');
