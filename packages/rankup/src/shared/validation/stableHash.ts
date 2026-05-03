import type { JsonObject, JsonValue } from '../models/json.js';

function stableStringify(value: JsonValue): string {
	if (value === null || typeof value !== 'object') {
		return JSON.stringify(value);
	}
	if (Array.isArray(value)) {
		return `[${value.map(item => stableStringify(item)).join(',')}]`;
	}
	const record = value as JsonObject;
	const keys = Object.keys(record).sort((a, b) => a.localeCompare(b));
	const serialized = keys.map(key => `${JSON.stringify(key)}:${stableStringify(record[key])}`);
	return `{${serialized.join(',')}}`;
}

export function stableHash(value: JsonValue): string {
	const serialized = stableStringify(value);
	let hash = 2166136261;
	for (let index = 0; index < serialized.length; index += 1) {
		hash ^= serialized.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(16).padStart(8, '0');
}
