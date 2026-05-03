import type { SportId } from '../../domains/tournaments/shared/models/ids.js';

export type CanonicalMatchStatus = 'pending' | 'provisional' | 'final' | 'void';

export type SportDefinition = {
	sportId: SportId;
	providerPolicy: {
		mapping: 'canonical-pass-through-v1';
	};
	supportedGameModes: string[];
};
