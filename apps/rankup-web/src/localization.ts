export type LandingLocale = 'es' | 'en';

const SUPPORTED_LOCALES: readonly LandingLocale[] = ['es', 'en'] as const;

export function resolveLandingLocale(pathname: string): LandingLocale {
	const firstSegment = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
	if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as LandingLocale)) {
		return firstSegment as LandingLocale;
	}
	return 'es';
}

export function buildLocalizedPath(targetLocale: LandingLocale, pathname: string): string {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) {
		return `/${targetLocale}`;
	}
	if (SUPPORTED_LOCALES.includes(segments[0] as LandingLocale)) {
		segments[0] = targetLocale;
		return `/${segments.join('/')}`;
	}
	return `/${targetLocale}/${segments.join('/')}`;
}
