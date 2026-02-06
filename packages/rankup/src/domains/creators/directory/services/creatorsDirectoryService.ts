import type { ICreatorsDirectoryService } from '../contracts/creatorsDirectory.js';
import type { ICreatorsDirectoryGateway as CreatorsDirectoryGateway } from '../contracts/creatorsDirectoryGateway.js';
import { ICreatorsDirectoryGateway } from '../contracts/creatorsDirectoryGateway.js';
import type { CreatorPage, CreatorProfile, GetCreatorParams, GetCreatorQuery, ListCreatorsQuery } from '../contracts/types.js';

export class CreatorsDirectoryService implements ICreatorsDirectoryService {
	public constructor(@ICreatorsDirectoryGateway private readonly gateway: CreatorsDirectoryGateway) {}

	public async listCreators(query?: ListCreatorsQuery): Promise<CreatorPage> {
		return this.gateway.listCreators(query);
	}

	public async getCreator(params: GetCreatorParams, query?: GetCreatorQuery): Promise<CreatorProfile> {
		return this.gateway.getCreator(params, query);
	}
}
