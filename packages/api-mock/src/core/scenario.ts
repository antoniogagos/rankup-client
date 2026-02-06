export type ScenarioAuthMode = 'required' | 'disabled';

export type ScenarioDefaults = {
	delayMs?: number;
	forceStatus?: number;
	authMode?: ScenarioAuthMode;
};

export type ScenarioOverrides = {
	delayMs?: number;
	forceStatus?: number;
	authMode?: ScenarioAuthMode;
	reset?: boolean;
};

export type ScenarioRequestMeta = {
	headers?: Record<string, string | string[]>;
	query?: Record<string, string | string[]>;
};

export type ScenarioResult = {
	delayMs: number;
	forceStatus?: number;
	authMode: ScenarioAuthMode;
	reset: boolean;
};

export const SCENARIO_KEYS = {
	delayMs: 'x-rankup-mock-delay-ms',
	forceStatus: 'x-rankup-mock-force-status',
	reset: 'x-rankup-mock-reset',
	authMode: 'x-rankup-mock-auth',
} as const;

const DEFAULT_AUTH_MODE: ScenarioAuthMode = 'disabled';

function readValue(source: Record<string, string | string[]> | undefined, key: string): string | undefined {
	if (!source) return undefined;
	const direct = source[key];
	if (typeof direct === 'string') return direct;
	if (Array.isArray(direct)) return direct[0];
	const lower = source[key.toLowerCase()];
	if (typeof lower === 'string') return lower;
	if (Array.isArray(lower)) return lower[0];
	return undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
	if (!value) return undefined;
	const normalized = value.trim().toLowerCase();
	if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
	if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
	return undefined;
}

function parseNumber(value: string | undefined): number | undefined {
	if (!value) return undefined;
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return undefined;
	return parsed;
}

function parseAuthMode(value: string | undefined): ScenarioAuthMode | undefined {
	if (!value) return undefined;
	const normalized = value.trim().toLowerCase();
	if (['required', 'on', 'true', '1', 'yes'].includes(normalized)) return 'required';
	if (['disabled', 'off', 'false', '0', 'no'].includes(normalized)) return 'disabled';
	return undefined;
}

export function parseScenarioOverrides(meta: ScenarioRequestMeta): ScenarioOverrides {
	const headers = meta.headers ?? {};
	const query = meta.query ?? {};

	const delayMs = parseNumber(readValue(headers, SCENARIO_KEYS.delayMs) ?? readValue(query, SCENARIO_KEYS.delayMs));
	const forceStatus = parseNumber(readValue(headers, SCENARIO_KEYS.forceStatus) ?? readValue(query, SCENARIO_KEYS.forceStatus));
	const reset = parseBoolean(readValue(headers, SCENARIO_KEYS.reset) ?? readValue(query, SCENARIO_KEYS.reset));
	const authMode = parseAuthMode(readValue(headers, SCENARIO_KEYS.authMode) ?? readValue(query, SCENARIO_KEYS.authMode));

	return {
		delayMs: delayMs !== undefined && delayMs >= 0 ? delayMs : undefined,
		forceStatus: forceStatus !== undefined && forceStatus >= 100 && forceStatus <= 599 ? forceStatus : undefined,
		authMode,
		reset,
	};
}

export function resolveScenario(defaults: ScenarioDefaults | undefined, overrides: ScenarioOverrides): ScenarioResult {
	const delayMs = overrides.delayMs ?? defaults?.delayMs ?? 0;
	const forceStatus = overrides.forceStatus ?? defaults?.forceStatus;
	const authMode = overrides.authMode ?? defaults?.authMode ?? DEFAULT_AUTH_MODE;
	const reset = overrides.reset ?? false;
	return {
		delayMs: delayMs >= 0 ? delayMs : 0,
		forceStatus,
		authMode,
		reset,
	};
}
