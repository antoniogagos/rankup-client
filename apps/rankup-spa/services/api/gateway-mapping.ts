export type SharedKeys<TDomain, TApi> = readonly (keyof TDomain & keyof TApi)[];

export const defineSharedKeys =
	<TDomain, TApi>() =>
	<K extends SharedKeys<TDomain, TApi>>(keys: K): K =>
		keys;

export function pickFields<TSource, K extends readonly (keyof TSource)[]>(source: TSource, keys: K): Pick<TSource, K[number]> {
	const result = {} as Pick<TSource, K[number]>;
	for (const key of keys) {
		result[key] = source[key];
	}
	return result;
}

export function mapOptional<TSource, TTarget>(
	value: TSource | null | undefined,
	mapper: (value: TSource) => TTarget,
): TTarget | undefined {
	if (value === null || value === undefined) {
		return undefined;
	}
	return mapper(value);
}
