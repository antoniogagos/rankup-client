import type { SportDefinition } from './types.js';

export const footballRegistry: SportDefinition = {
	sportId: 'football',
	providerPolicy: {
		mapping: 'canonical-pass-through-v1',
	},
	supportedGameModes: ['scorePrediction'],
};
