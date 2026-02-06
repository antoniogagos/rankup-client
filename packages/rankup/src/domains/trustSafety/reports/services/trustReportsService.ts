import type { ITrustReportsService } from '../contracts/trustReports.js';
import type { ITrustReportsGateway as TrustReportsGateway } from '../contracts/trustReportsGateway.js';
import { ITrustReportsGateway } from '../contracts/trustReportsGateway.js';
import type { CreateReportRequest, GetMyReportParams, ListMyReportsQuery, ListMyTrustBlocksQuery, Report, ReportPage, TrustBlockPage } from '../contracts/types.js';

export class TrustReportsService implements ITrustReportsService {
	public constructor(@ITrustReportsGateway private readonly gateway: TrustReportsGateway) {}

	public async listMyReports(query?: ListMyReportsQuery): Promise<ReportPage> {
		return this.gateway.listMyReports(query);
	}

	public async createReport(body: CreateReportRequest): Promise<Report> {
		return this.gateway.createReport(body);
	}

	public async getMyReport(params: GetMyReportParams): Promise<Report> {
		return this.gateway.getMyReport(params);
	}

	public async listMyTrustBlocks(query?: ListMyTrustBlocksQuery): Promise<TrustBlockPage> {
		return this.gateway.listMyTrustBlocks(query);
	}
}
