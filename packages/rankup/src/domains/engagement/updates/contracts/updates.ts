import type { ListMyUpdatesQuery, MeUpdatePage, StreamMyLiveUpdatesQuery, StreamMyLiveUpdatesResponse } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IUpdatesService {
	listMyUpdates(query?: ListMyUpdatesQuery): Promise<MeUpdatePage>;
	streamMyLiveUpdates(query?: StreamMyLiveUpdatesQuery): Promise<StreamMyLiveUpdatesResponse>;
}

export const IUpdatesService = createDecorator<IUpdatesService>('updatesService');
