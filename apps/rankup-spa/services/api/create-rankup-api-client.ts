import { createHttpRankupApiClient } from './http-client.js';
import type { RankupApiClient } from '@rankup/api';

export type ApiClientOptions = {
	apiBaseUrl: string;
	authBaseUrl?: string;
	getAccessToken?: () => string | null | undefined;
};

export function createRankupApiClient(options: ApiClientOptions): RankupApiClient {
	if (!options.apiBaseUrl) {
		throw new Error('ApiClient requires apiBaseUrl.');
	}
	return createHttpRankupApiClient({
		apiBaseUrl: options.apiBaseUrl,
		authBaseUrl: options.authBaseUrl ?? '',
		getAccessToken: options.getAccessToken,
	});
}
