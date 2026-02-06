import type { CreatorPage, CreatorProfile, GetCreatorParams, GetCreatorQuery, ListCreatorsQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ICreatorsDirectoryGateway {
	listCreators(query?: ListCreatorsQuery): Promise<CreatorPage>;
	getCreator(params: GetCreatorParams, query?: GetCreatorQuery): Promise<CreatorProfile>;
}

export const ICreatorsDirectoryGateway = createDecorator<ICreatorsDirectoryGateway>('creatorsDirectoryGateway');
