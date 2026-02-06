import { isMockMode } from '@rankup/platform/environment/browser/env.js';

const bannerId = 'rk-mock-banner';

export function ensureMockBanner() {
	if (!isMockMode || typeof document === 'undefined') {
		return;
	}
	let banner = document.getElementById(bannerId);
	if (!banner) {
		banner = document.createElement('div');
		banner.id = bannerId;
		banner.textContent = 'Mock mode';
		banner.style.position = 'fixed';
		banner.style.bottom = '12px';
		banner.style.right = '12px';
		banner.style.zIndex = '9999';
		banner.style.background = '#f59e0b';
		banner.style.color = '#111827';
		banner.style.fontSize = '12px';
		banner.style.fontWeight = '600';
		banner.style.padding = '6px 8px';
		banner.style.borderRadius = '6px';
		banner.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
		banner.style.fontFamily = 'system-ui, -apple-system, Segoe UI, sans-serif';
		document.body.append(banner);
	}
}
