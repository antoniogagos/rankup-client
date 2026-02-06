export function validateInvitationCode(code: string): void {
	const trimmed = String(code ?? '').trim();
	if (!trimmed) {
		throw new Error('Invitation code is required.');
	}
	if (trimmed.length < 6 || trimmed.length > 32) {
		throw new Error('Invitation code length is invalid.');
	}
	if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
		throw new Error('Invitation code contains invalid characters.');
	}
}
