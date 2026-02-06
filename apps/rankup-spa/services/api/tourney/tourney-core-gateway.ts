import { mapDuelPage, mapMyTournamentPage, mapTournament, mapTournamentPreview } from './tourney-mappers.js';
import type * as Api from '@rankup/api';
import type { ITourneyCoreGateway } from '@rankup/rankup/domains/tournaments/core/contracts/tourneyCoreGateway.js';
import type * as Domain from '@rankup/rankup/domains/tournaments/core/contracts/types.js';

export const operationOwners = {
	archiveTournament: 'api.tourney.core.archiveTournament',
	createDuel: 'api.tourney.core.createDuel',
	createDuelRematch: 'api.tourney.core.createDuelRematch',
	createTournament: 'api.tourney.core.createTournament',
	deleteTournament: 'api.tourney.core.deleteTournament',
	getTournament: 'api.tourney.core.getTournament',
	getTournamentPreview: 'api.tourney.core.getTournamentPreview',
	getTournamentRules: 'api.tourney.core.getTournamentRules',
	listDiscoverableTournaments: 'api.tourney.core.listDiscoverableTournaments',
	listMyDuels: 'api.tourney.core.listMyDuels',
	listMyTournaments: 'api.tourney.core.listMyTournaments',
	lockTournament: 'api.tourney.core.lockTournament',
	transferTournamentOwnership: 'api.tourney.core.transferTournamentOwnership',
	unarchiveTournament: 'api.tourney.core.unarchiveTournament',
	unlockTournament: 'api.tourney.core.unlockTournament',
	updateTournament: 'api.tourney.core.updateTournament',
} as const;

const mapListMyTournamentsQuery = (query?: Domain.ListMyTournamentsQuery): Api.ListMyTournamentsQuery | undefined =>
	query
		? {
				status: query.status,
				verificationStatus: query.verificationStatus,
				sportId: query.sportId,
				gameModeId: query.gameModeId,
				formatId: query.formatId,
				includeArchived: query.includeArchived,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapListMyDuelsQuery = (query?: Domain.ListMyDuelsQuery): Api.ListMyDuelsQuery | undefined =>
	query
		? {
			status: query.status,
			include: query.include ? query.include.slice() : undefined,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapTournamentJoinPolicyRequest = (policy: Domain.TournamentJoinPolicy): Api.CreateTournamentRequest['joinPolicy'] => ({
	joinMode: policy.joinMode,
	joinMidSeasonAllowed: policy.joinMidSeasonAllowed,
	maxPlayers: policy.maxPlayers,
	locked: policy.locked,
	joinClosesAt: policy.joinClosesAt,
});

const mapTournamentTimingRequest = (timing: Domain.TournamentTiming): Api.CreateTournamentRequest['timing'] => ({
	competitionId: timing.competitionId,
	seasonId: timing.seasonId,
	startMatchday: timing.startMatchday,
	endMatchday: timing.endMatchday,
	startsAt: timing.startsAt,
	endsAt: timing.endsAt,
});

const mapHeadsUpTieBreakerRuleRequest = (rule: Domain.HeadsUpTieBreakerRule): Api.HeadsUpTieBreakerRule => ({
	kind: rule.kind,
	metricId: rule.metricId,
	order: rule.order,
});

const mapHeadsUpDurationRequest = (duration: Domain.HeadsUpDuration): Api.HeadsUpDuration => ({
	type: duration.type,
	roundCount: duration.roundCount,
	startMatchday: duration.startMatchday,
	endMatchday: duration.endMatchday,
});

const mapHeadsUpFormatConfigRequest = (config: Domain.HeadsUpFormatConfig): Api.HeadsUpFormatConfig => ({
	roundUnit: config.roundUnit,
	duration: mapHeadsUpDurationRequest(config.duration),
	victoryCondition: config.victoryCondition,
	tieBreakers: config.tieBreakers ? config.tieBreakers.map(mapHeadsUpTieBreakerRuleRequest) : undefined,
	requiresDirectInvite: config.requiresDirectInvite,
	onPlayerLeave: config.onPlayerLeave,
});

const isHeadsUpFormatConfig = (
	config: Domain.TournamentFormatConfig,
): config is Domain.HeadsUpFormatConfig => 'roundUnit' in config && 'duration' in config;

const mapTournamentFormatConfigRequest = (
	config?: Domain.TournamentFormatConfig,
): Api.TournamentFormatConfig | undefined => {
	if (!config) {
		return undefined;
	}
	if (isHeadsUpFormatConfig(config)) {
		return mapHeadsUpFormatConfigRequest(config);
	}
	return {};
};

const mapCreateTournamentRequest = (body: Domain.CreateTournamentRequest): Api.CreateTournamentRequest => ({
	name: body.name,
	description: body.description,
	visibility: body.visibility,
	discoverability: body.discoverability,
	sportId: body.sportId,
	gameModeId: body.gameModeId,
	formatId: body.formatId,
	formatConfig: mapTournamentFormatConfigRequest(body.formatConfig),
	opponentUserId: body.opponentUserId,
	modality: body.modality,
	timing: mapTournamentTimingRequest(body.timing),
	joinPolicy: mapTournamentJoinPolicyRequest(body.joinPolicy),
	chatEnabled: body.chatEnabled,
	rulesetId: body.rulesetId,
	rulesetConfig: body.rulesetConfig,
});

const mapCreateDuelRequest = (body: Domain.CreateDuelRequest): Api.CreateDuelRequest => ({
	name: body.name,
	description: body.description,
	visibility: body.visibility,
	discoverability: body.discoverability,
	sportId: body.sportId,
	gameModeId: body.gameModeId,
	modality: body.modality,
	timing: mapTournamentTimingRequest(body.timing),
	joinPolicy: mapTournamentJoinPolicyRequest(body.joinPolicy),
	chatEnabled: body.chatEnabled,
	rulesetId: body.rulesetId,
	rulesetConfig: body.rulesetConfig,
	formatId: 'headsUp',
	opponentUserId: body.opponentUserId,
	formatConfig: body.formatConfig ? mapHeadsUpFormatConfigRequest(body.formatConfig) : undefined,
});

const mapCreateRematchRequest = (body?: Domain.CreateRematchRequest): Api.CreateRematchRequest | undefined =>
	body
		? {
			name: body.name,
			startMatchday: body.startMatchday,
			formatConfigOverrides: body.formatConfigOverrides
				? mapHeadsUpFormatConfigRequest(body.formatConfigOverrides)
				: undefined,
		}
		: undefined;

const mapGetTournamentPreviewQuery = (query?: Domain.GetTournamentPreviewQuery): Api.GetTournamentPreviewQuery | undefined =>
	query
		? {
			invitationCode: query.invitationCode,
		}
		: undefined;

export class TourneyCoreGateway implements ITourneyCoreGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyTournaments(query?: Domain.ListMyTournamentsQuery): Promise<Domain.MyTournamentPage> {
		const response = await this.apiClient.listMyTournaments(mapListMyTournamentsQuery(query));
		return mapMyTournamentPage(response);
	}

	public async listMyDuels(query?: Domain.ListMyDuelsQuery): Promise<Domain.DuelPage> {
		const response = await this.apiClient.listMyDuels(mapListMyDuelsQuery(query));
		return mapDuelPage(response);
	}

	public async createTournament(body: Domain.CreateTournamentRequest): Promise<Domain.Tournament> {
		const response = await this.apiClient.createTournament(mapCreateTournamentRequest(body));
		return mapTournament(response);
	}

	public async createDuel(body: Domain.CreateDuelRequest): Promise<Domain.Tournament> {
		const response = await this.apiClient.createDuel(mapCreateDuelRequest(body));
		return mapTournament(response);
	}

	public async createDuelRematch(
		params: Domain.CreateDuelRematchParams,
		body?: Domain.CreateRematchRequest,
	): Promise<Domain.Tournament> {
		const response = await this.apiClient.createDuelRematch(
			{ tournamentId: params.tournamentId },
			mapCreateRematchRequest(body),
		);
		return mapTournament(response);
	}

	public async getTournamentPreview(
		params: Domain.GetTournamentPreviewParams,
		query?: Domain.GetTournamentPreviewQuery,
	): Promise<Domain.TournamentPreview> {
		const response = await this.apiClient.getTournamentPreview(
			{ tournamentId: params.tournamentId },
			mapGetTournamentPreviewQuery(query),
		);
		return mapTournamentPreview(response);
	}
}
