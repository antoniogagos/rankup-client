import { svg, type TemplateResult } from 'lit';

type Icon = keyof typeof ICONS[48] | keyof typeof ICONS[24] | keyof typeof ICONS[16] | keyof typeof ICONS[10];

// prettier-ignore
const ICONS = {

  48: {
    "google": `<svg style="transform: scale(1.35)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48" height="48"><defs><filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation=".5" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.168 0" in="shadowBlurOuter1" result="shadowMatrixOuter1"/><feOffset in="SourceAlpha" result="shadowOffsetOuter2"/><feGaussianBlur stdDeviation=".5" in="shadowOffsetOuter2" result="shadowBlurOuter2"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.084 0" in="shadowBlurOuter2" result="shadowMatrixOuter2"/><feMerge><feMergeNode in="shadowMatrixOuter1"/><feMergeNode in="shadowMatrixOuter2"/><feMergeNode in="SourceGraphic"/></feMerge></filter><rect id="b" x="0" y="0" width="40" height="40" rx="2"/></defs><g fill="none" fill-rule="evenodd"><g transform="translate(3 3)" filter="url(#a)"><use fill="#FFF" xlink:href="#b"/><use xlink:href="#b"/><use xlink:href="#b"/><use xlink:href="#b"/></g><path d="M31.64 23.205c0-.639-.057-1.252-.164-1.841H23v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M23 32c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711h-3.007v2.332A8.997 8.997 0 0 0 23 32Z" fill="#34A853"/><path d="M17.964 24.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71v-2.332h-3.007A8.996 8.996 0 0 0 14 23c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/><path d="M23 17.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C27.463 14.891 25.426 14 23 14a8.997 8.997 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71Z" fill="#EA4335"/><path d="M14 14h18v18H14V14Z"/></g></svg>`,
  },

  24: {
    "username": `<svg width="24" height="24" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><path d="M16 29a13 13 0 1 1 13-13 13 13 0 0 1-13 13Zm0-24a11 11 0 1 0 11 11A11 11 0 0 0 16 5Z"/><path d="M16 17a5 5 0 1 1 5-5 5 5 0 0 1-5 5Zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3ZM25.55 24a1 1 0 0 1-.74-.32A11.35 11.35 0 0 0 16.46 20h-.92a11.27 11.27 0 0 0-7.85 3.16 1 1 0 0 1-1.38-1.44A13.24 13.24 0 0 1 15.54 18h.92a13.39 13.39 0 0 1 9.82 4.32 1 1 0 0 1-.73 1.68Z"/></g><path fill="none" d="M0 0h32v32H0z"/></svg>`,
    "email-open": `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2 21c.994 0 1.8-.833 1.8-1.86V9.841c0-.677-.35-1.268-.873-1.594L12 3 3.873 8.247A1.871 1.871 0 0 0 3 9.841v9.3C3 20.166 3.806 21 4.8 21h14.4ZM4.8 9.842l7.2 4.649 7.2-4.649-7.2-4.65-7.2 4.65Zm7.2 6.841-7.2-4.647v7.104h14.4v-7.104L12 16.683Z" fill="currentColor"/></svg>`,
    "privacy": `<svg width="16" height="21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 .002a5.85 5.85 0 0 0-6 5.714v.952a1.969 1.969 0 0 0-2 1.9v9.534a1.97 1.97 0 0 0 2 1.9h12a1.97 1.97 0 0 0 2-1.9V8.573a1.969 1.969 0 0 0-2-1.9v-.957A5.85 5.85 0 0 0 8 .002Zm0 1.9a3.827 3.827 0 0 1 4 3.81v.952H4v-.948a3.827 3.827 0 0 1 4-3.814Zm6 16.2V8.573H2v9.529h12ZM8 9.525a3.908 3.908 0 0 0-4 3.81 3.908 3.908 0 0 0 4 3.81 3.908 3.908 0 0 0 4-3.81 3.908 3.908 0 0 0-4-3.809v-.001Zm.584 1.993A2.07 2.07 0 0 0 8 11.425v.004a2 2 0 1 0 2 1.9 1.8 1.8 0 0 0-.1-.556 1 1 0 0 1-.9.556.977.977 0 0 1-1-.952.945.945 0 0 1 .584-.859Z" fill="currentColor"/></svg>`,
  },

  16: {
    "arrow-left": `<svg width="16" height="12.45" style="transform: rotate(180deg)" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`,
    "arrow-right": `<svg width="16" height="12.45" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`,
    "eye": `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>`,
    "eye-hide": `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M4.52 5.934 1.393 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066zm10.237 10.238-1.464-1.464a3 3 0 0 1-4.001-4.001L7.828 9.243a5 5 0 0 0 6.929 6.929zM7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592l-3.86-3.86a5 5 0 0 0-5.68-5.68L7.974 3.761z"/></svg>`
  },

  10: {
    "person": `<svg width="10" height="14" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 12.954c0 .421-.32.763-.714.763-.395 0-.715-.342-.715-.763 0-2.1-1.602-3.81-3.571-3.81-1.97 0-3.571 1.71-3.571 3.81 0 .421-.32.763-.715.763-.395 0-.714-.342-.714-.763 0-2.94 2.244-5.334 5-5.334s5 2.393 5 5.334M5 1.524c.788 0 1.428.683 1.428 1.524 0 .84-.64 1.524-1.428 1.524-.788 0-1.429-.684-1.429-1.524S4.212 1.524 5 1.524m0 4.572c1.576 0 2.857-1.367 2.857-3.048C7.857 1.368 6.576 0 5 0 3.424 0 2.143 1.367 2.143 3.048S3.424 6.096 5 6.096" fill="#fff" fill-opacity=".9"/></svg>`,
  },

};

const CACHE = new WeakMap();

export function Icons(icon: Icon, size = 24, tagFn = svg): string | TemplateResult | null {
	if (tagFn == null) {
		return getIcon(icon, size);
	}
	if (!CACHE.has(tagFn)) {
		CACHE.set(tagFn, new Map());
	}
	const st = CACHE.get(tagFn);
	const key = icon + '__' + size;
	const cached = st.get(key);
	if (cached) {
		return cached;
	}
	const str = getIcon(icon, size);
	if (str) {
		const value = tagFn([str] as any);
		// @ts-ignore
		if (value.strings) value.strings.raw = [str];
		st.set(key, value);
		return value;
	}
	return null;
}

function getIcon(icon: Icon, size: number): string {
	// @ts-ignore
	return ICONS[size as keyof typeof ICONS]?.[icon] ?? '';
}
