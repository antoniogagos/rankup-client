import { mapCreateReportRequest, mapReport, mapReportPage, mapTrustBlockPage } from './trust-mappers.js';
import type * as Api from '@rankup/api';
import type { ITrustReportsGateway } from '@rankup/rankup/domains/trustSafety/reports/contracts/trustReportsGateway.js';
import type * as Domain from '@rankup/rankup/domains/trustSafety/reports/contracts/types.js';

const mapListMyReportsQuery = (query?: Domain.ListMyReportsQuery): Api.ListMyReportsQuery | undefined =>
	query
		? {
			status: query.status,
			type: query.type,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListMyTrustBlocksQuery = (query?: Domain.ListMyTrustBlocksQuery): Api.ListMyTrustBlocksQuery | undefined =>
	query
		? {
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class TrustReportsGateway implements ITrustReportsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyReports(query?: Domain.ListMyReportsQuery): Promise<Domain.ReportPage> {
		const response = await this.apiClient.listMyReports(mapListMyReportsQuery(query));
		return mapReportPage(response);
	}

	public async createReport(body: Domain.CreateReportRequest): Promise<Domain.Report> {
		const response = await this.apiClient.createReport(mapCreateReportRequest(body));
		return mapReport(response);
	}

	public async getMyReport(params: Domain.GetMyReportParams): Promise<Domain.Report> {
		const response = await this.apiClient.getMyReport({ reportId: params.reportId });
		return mapReport(response);
	}

	public async listMyTrustBlocks(query?: Domain.ListMyTrustBlocksQuery): Promise<Domain.TrustBlockPage> {
		const response = await this.apiClient.listMyTrustBlocks(mapListMyTrustBlocksQuery(query));
		return mapTrustBlockPage(response);
	}
}
