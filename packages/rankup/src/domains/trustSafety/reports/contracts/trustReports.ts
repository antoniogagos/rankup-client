import type { CreateReportRequest, GetMyReportParams, ListMyReportsQuery, ListMyTrustBlocksQuery, Report, ReportPage, TrustBlockPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITrustReportsService {
	listMyReports(query?: ListMyReportsQuery): Promise<ReportPage>;
	createReport(body: CreateReportRequest): Promise<Report>;
	getMyReport(params: GetMyReportParams): Promise<Report>;
	listMyTrustBlocks(query?: ListMyTrustBlocksQuery): Promise<TrustBlockPage>;
}

export const ITrustReportsService = createDecorator<ITrustReportsService>('trustReportsService');
