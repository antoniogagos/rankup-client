// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.
// Source: packages/api/openapi.yaml (components.schemas.MatchStatus.x-rankup-canonical-statuses)

export const matchStatusCatalog = {
	pending: ['NS', 'POSTP', 'CANCL'],
	provisional: ['LIVE', 'IN_PLAY', 'HT', 'provisional'],
	final: ['FT', 'AET', 'PEN', 'FINAL', 'completed'],
	void: ['CANC', 'ABAN', 'void'],
} as const;

export type CanonicalMatchStatus = 'pending' | 'provisional' | 'final' | 'void';
export const knownProviderMatchStatuses = ['NS', 'POSTP', 'CANCL', 'LIVE', 'IN_PLAY', 'HT', 'provisional', 'FT', 'AET', 'PEN', 'FINAL', 'completed', 'CANC', 'ABAN', 'void'] as const;

