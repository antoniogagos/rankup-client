import type { ListMyUpdatesQuery, MeUpdatePage, StreamMyLiveUpdatesQuery, StreamMyLiveUpdatesResponse } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IUpdatesGateway {
	listMyUpdates(query?: ListMyUpdatesQuery): Promise<MeUpdatePage>;
	streamMyLiveUpdates(query?: StreamMyLiveUpdatesQuery): Promise<StreamMyLiveUpdatesResponse>;
}

export const IUpdatesGateway = createDecorator<IUpdatesGateway>('updatesGateway');
