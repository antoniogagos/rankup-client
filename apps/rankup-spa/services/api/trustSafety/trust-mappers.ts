import { mapOptional } from '../gateway-mapping.js';
import { mapProblemToDomainError } from '../problem/mapProblemToDomainError.js';
import type * as Api from '@rankup/api';
import type { DomainError } from '@rankup/rankup/domains/shared/errors/domainError.js';
import type * as Appeals from '@rankup/rankup/domains/trustSafety/appeals/contracts/types.js';
import type * as Enforcement from '@rankup/rankup/domains/trustSafety/enforcement/contracts/types.js';
import type * as Reports from '@rankup/rankup/domains/trustSafety/reports/contracts/types.js';
import type * as Shared from '@rankup/rankup/domains/trustSafety/shared/contracts/types.js';

export function mapTrustPolicy(policy: Api.TrustPolicy): Shared.TrustPolicy {
	return {
		policyId: policy.policyId,
		title: policy.title,
		version: policy.version,
		updatedAt: policy.updatedAt,
		url: policy.url,
		content: policy.content,
		summary: policy.summary,
	};
}

export function mapTrustPolicyList(list: Api.TrustPolicyList): Shared.TrustPolicyList {
	return {
		items: list.items.map(mapTrustPolicy),
	};
}

export function mapEnforcementScope(scope: Api.EnforcementScope): Enforcement.EnforcementScope {
	return {
		tournamentId: scope.tournamentId,
		chatOnly: scope.chatOnly,
		featureFlags: scope.featureFlags,
	};
}

export function mapEnforcementAction(action: Api.EnforcementAction): Enforcement.EnforcementAction {
	return {
		actionId: action.actionId,
		type: action.type,
		scope: mapOptional(action.scope, mapEnforcementScope),
		reasonCode: action.reasonCode,
		reasonText: action.reasonText,
		createdAt: action.createdAt,
		startsAt: action.startsAt,
		endsAt: action.endsAt,
		appealable: action.appealable,
		policyId: action.policyId,
	};
}

export function mapEnforcementStatus(status: Api.EnforcementStatus): Enforcement.EnforcementStatus {
	return {
		serverTime: status.serverTime,
		isRestricted: status.isRestricted,
		actions: status.actions.map(mapEnforcementAction),
	};
}

export function mapReportTarget(target: Api.ReportTarget): Reports.ReportTarget {
	return {
		type: target.type,
		tournamentId: target.tournamentId,
		messageId: target.messageId,
		userId: target.userId,
		creatorId: target.creatorId,
		url: target.url,
	};
}

export function mapReport(report: Api.Report): Reports.Report {
	return {
		reportId: report.reportId,
		target: mapReportTarget(report.target),
		reason: report.reason,
		comment: report.comment,
		status: report.status,
		createdAt: report.createdAt,
		updatedAt: report.updatedAt,
	};
}

export function mapReportPage(page: Api.ReportPage): Reports.ReportPage {
	return {
		items: page.items.map(mapReport),
		nextCursor: page.nextCursor,
	};
}

export function mapTrustBlockEntry(entry: Api.TrustBlockEntry): Reports.TrustBlockEntry {
	return {
		user: entry.user,
		blockedAt: entry.blockedAt,
		reason: entry.reason,
	};
}

export function mapTrustBlockPage(page: Api.TrustBlockPage): Reports.TrustBlockPage {
	return {
		items: page.items.map(mapTrustBlockEntry),
		nextCursor: page.nextCursor,
	};
}

export function mapAppeal(appeal: Api.Appeal): Appeals.Appeal {
	return {
		appealId: appeal.appealId,
		actionId: appeal.actionId,
		status: appeal.status,
		message: appeal.message,
		responseMessage: appeal.responseMessage,
		createdAt: appeal.createdAt,
		updatedAt: appeal.updatedAt,
	};
}

export function mapAppealPage(page: Api.AppealPage): Appeals.AppealPage {
	return {
		items: page.items.map(mapAppeal),
		nextCursor: page.nextCursor,
	};
}

export function mapReportTargetRequest(target: Reports.ReportTarget): Api.ReportTarget {
	return {
		type: target.type,
		tournamentId: target.tournamentId,
		messageId: target.messageId,
		userId: target.userId,
		creatorId: target.creatorId,
		url: target.url,
	};
}

export function mapCreateReportRequest(body: Reports.CreateReportRequest): Api.CreateReportRequest {
	return {
		target: mapReportTargetRequest(body.target),
		reason: body.reason,
		comment: body.comment,
		context: body.context,
	};
}

export function mapCreateAppealRequest(body: Appeals.CreateAppealRequest): Api.CreateAppealRequest {
	return {
		actionId: body.actionId,
		message: body.message,
		attachments: body.attachments,
	};
}

export const mapTrustSafetyProblemToDomainError = (problem: unknown): DomainError => mapProblemToDomainError(problem);
