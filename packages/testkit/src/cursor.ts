export function buildCursor(parts: readonly string[]): string {
	return Buffer.from(parts.join('|')).toString('base64url');
}

export function parseCursor(cursor: string): string[] {
	const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
	if (!decoded) {
		return [];
	}
	return decoded.split('|');
}
