import type { GameModeStatus, TournamentFormatId, TournamentModality } from '../../shared/models/enums.js';
import type { GameModeId, RulesetId, SportId } from '../../shared/models/ids.js';

export type GameModeCapabilities = {
	submissionModel: string;
	supportsLiveUpdates: boolean;
	supportsNegativePoints: boolean;
	supportsEditsBeforeLock?: boolean;
	lockGranularity?: string;
};

export type GameMode = {
	gameModeId: GameModeId;
	name: string;
	status: GameModeStatus;
	supportedSportIds: SportId[];
	supportedModalities: TournamentModality[];
	supportedFormats?: TournamentFormatId[];
	capabilities: GameModeCapabilities;
	shortName?: string;
	description?: string;
	defaultRulesetId?: RulesetId;
	tournamentRulesetConfigSchema?: Record<string, unknown>;
};

export type GameModeList = {
	items: GameMode[];
};

export type ListGameModesQuery = {
	status?: GameModeStatus;
	sportId?: SportId;
	modality?: TournamentModality;
};

export type GetGameModeParams = {
	gameModeId: GameModeId;
};
