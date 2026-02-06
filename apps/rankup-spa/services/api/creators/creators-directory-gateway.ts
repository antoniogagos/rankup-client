import { mapCreatorPage, mapCreatorProfile } from './creators-mappers.js';
import type * as Api from '@rankup/api';
import type { ICreatorsDirectoryGateway } from '@rankup/rankup/domains/creators/directory/contracts/creatorsDirectoryGateway.js';
import type * as Domain from '@rankup/rankup/domains/creators/directory/contracts/types.js';

const mapListCreatorsQuery = (query?: Domain.ListCreatorsQuery): Api.ListCreatorsQuery | undefined =>
	query
		? {
			q: query.q,
			featuredOnly: query.featuredOnly,
			type: query.type,
			sportId: query.sportId,
			gameModeId: query.gameModeId,
			locale: query.locale,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetCreatorQuery = (query?: Domain.GetCreatorQuery): Api.GetCreatorQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class CreatorsDirectoryGateway implements ICreatorsDirectoryGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listCreators(query?: Domain.ListCreatorsQuery): Promise<Domain.CreatorPage> {
		const response = await this.apiClient.listCreators(mapListCreatorsQuery(query));
		return mapCreatorPage(response);
	}

	public async getCreator(params: Domain.GetCreatorParams, query?: Domain.GetCreatorQuery): Promise<Domain.CreatorProfile> {
		const response = await this.apiClient.getCreator({ creatorId: params.creatorId }, mapGetCreatorQuery(query));
		return mapCreatorProfile(response);
	}
}
