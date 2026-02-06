import type { CreatorPage, CreatorProfile, GetCreatorParams, GetCreatorQuery, ListCreatorsQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ICreatorsDirectoryService {
	listCreators(query?: ListCreatorsQuery): Promise<CreatorPage>;
	getCreator(params: GetCreatorParams, query?: GetCreatorQuery): Promise<CreatorProfile>;
}

export const ICreatorsDirectoryService = createDecorator<ICreatorsDirectoryService>('creatorsDirectoryService');
