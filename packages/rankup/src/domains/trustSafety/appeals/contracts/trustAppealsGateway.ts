import type { Appeal, AppealPage, CreateAppealRequest, GetMyAppealParams, ListMyAppealsQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITrustAppealsGateway {
	listMyAppeals(query?: ListMyAppealsQuery): Promise<AppealPage>;
	createMyAppeal(body: CreateAppealRequest): Promise<Appeal>;
	getMyAppeal(params: GetMyAppealParams): Promise<Appeal>;
}

export const ITrustAppealsGateway = createDecorator<ITrustAppealsGateway>('trustAppealsGateway');
