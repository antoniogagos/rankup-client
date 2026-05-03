export function toEtag(version: number): string {
	return `"v${version}"`;
}

export function parseEtag(etag: string): number | null {
	const match = /^"v(\d+)"$/.exec(etag.trim());
	if (!match) {
		return null;
	}
	return Number(match[1]);
}
