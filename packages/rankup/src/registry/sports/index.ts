import { footballRegistry } from './footballRegistry.js';
import type { SportDefinition } from './types.js';

const sportRegistry: Record<string, SportDefinition> = {
	[footballRegistry.sportId]: footballRegistry,
};

export function resolveSportDefinition(sportId: string): SportDefinition {
	const definition = sportRegistry[sportId];
	if (!definition) {
		throw new Error(`Unsupported sportId: ${sportId}`);
	}
	return definition;
}

export { footballRegistry };
export type { CanonicalMatchStatus, SportDefinition } from './types.js';
