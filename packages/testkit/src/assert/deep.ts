export function assertNoUndefinedDeep(value: unknown, path: string = '$'): void {
	if (value === undefined) {
		throw new Error(`[P0] Undefined found at ${path}`);
	}
	if (value === null) {
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			assertNoUndefinedDeep(item, `${path}[${index}]`);
		});
		return;
	}
	if (typeof value === 'object') {
		for (const [key, nested] of Object.entries(value)) {
			assertNoUndefinedDeep(nested, `${path}.${key}`);
		}
	}
}
