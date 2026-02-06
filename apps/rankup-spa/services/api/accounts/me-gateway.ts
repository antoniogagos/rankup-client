import { mapMe } from './accounts-mappers.js';
import type * as Api from '@rankup/api';
import type { IMeGateway } from '@rankup/rankup/domains/accounts/me/contracts/meGateway.js';
import type * as Domain from '@rankup/rankup/domains/accounts/me/contracts/types.js';

const mapUpdateMeRequest = (request: Domain.UpdateMeRequest): Api.UpdateMeRequest => ({
	username: request.username,
	pictureUrl: request.pictureUrl,
	bio: request.bio,
});

export class MeGateway implements IMeGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getMe(): Promise<Domain.Me> {
		const response = await this.apiClient.getMe();
		return mapMe(response);
	}

	public async updateMe(request: Domain.UpdateMeRequest): Promise<Domain.Me> {
		const response = await this.apiClient.updateMe(mapUpdateMeRequest(request));
		return mapMe(response);
	}
}
