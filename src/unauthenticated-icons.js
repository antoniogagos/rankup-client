import { svg } from 'lit';

/**
 * @typedef {keyof ICONS[24]
 *  | keyof ICONS[18]
 *  | keyof ICONS[16]
 *  | keyof ICONS[12]
 *  | keyof ICONS[10]
 *  | keyof ICONS[8]} Icon
 */

// prettier-ignore
const ICONS = {
  24: {
    "email-open": `<svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2 21c.994 0 1.8-.833 1.8-1.86V9.841c0-.677-.35-1.268-.873-1.594L12 3 3.873 8.247A1.871 1.871 0 0 0 3 9.841v9.3C3 20.166 3.806 21 4.8 21h14.4ZM4.8 9.842l7.2 4.649 7.2-4.649-7.2-4.65-7.2 4.65Zm7.2 6.841-7.2-4.647v7.104h14.4v-7.104L12 16.683Z" fill="currentColor"/></svg>`,
    "privacy": `<svg width="16" height="21" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 .002a5.85 5.85 0 0 0-6 5.714v.952a1.969 1.969 0 0 0-2 1.9v9.534a1.97 1.97 0 0 0 2 1.9h12a1.97 1.97 0 0 0 2-1.9V8.573a1.969 1.969 0 0 0-2-1.9v-.957A5.85 5.85 0 0 0 8 .002Zm0 1.9a3.827 3.827 0 0 1 4 3.81v.952H4v-.948a3.827 3.827 0 0 1 4-3.814Zm6 16.2V8.573H2v9.529h12ZM8 9.525a3.908 3.908 0 0 0-4 3.81 3.908 3.908 0 0 0 4 3.81 3.908 3.908 0 0 0 4-3.81 3.908 3.908 0 0 0-4-3.809v-.001Zm.584 1.993A2.07 2.07 0 0 0 8 11.425v.004a2 2 0 1 0 2 1.9 1.8 1.8 0 0 0-.1-.556 1 1 0 0 1-.9.556.977.977 0 0 1-1-.952.945.945 0 0 1 .584-.859Z" fill="currentColor"/></svg>`,
  },

  18: {
    "google": `<svg xmlns="http://www.w3.org/2000/svg" class="google" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/><path d="M0 0h18v18H0z"/></g></svg>`,
  },

  16: {
    "back-arrow": `<svg width="16" height="12.45" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`,
    "eye": `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>`,
    "eye-hide": `<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M4.52 5.934 1.393 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066zm10.237 10.238-1.464-1.464a3 3 0 0 1-4.001-4.001L7.828 9.243a5 5 0 0 0 6.929 6.929zM7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592l-3.86-3.86a5 5 0 0 0-5.68-5.68L7.974 3.761z"/></svg>`
  },

  12: {
  },

  10: {
  },

  8: {
  },

};

const SIZES = Object.keys(ICONS).sort((a, b) => Number(a) - Number(b));
const CACHE = new WeakMap();

/**
 * @param {Icon} icon
 * @param {number} [size=24]
 * @param {function} [tagfn] template literal fn. If null or undefined, a string will be returned
 * @returns {Object | string}
 */
export function Icons(icon, size = 24, tagfn = svg) {
  if (tagfn == null) {
    return getIcon(icon, size);
  }
  if (!CACHE.has(tagfn)) {
    CACHE.set(tagfn, new Map());
  }
  const st = CACHE.get(tagfn);
  const key = icon + '__' + size;
  const cached = st.get(key);
  if (cached) {
    return cached;
  }
  const str = getIcon(icon, size);
  if (str) {
    const value = tagfn([str]);
    st.set(key, value);
    return value;
  }
  // console.warn(`Icon ${icon} doesn't exists at ${size} size`);
  return Icons.smallest(icon, tagfn);
}

/**
 * @param {string} icon
 * @param {number} size
 * @returns  {string}
 */
function getIcon(icon, size) {
  return /** @type {any}*/ (ICONS)[size]?.[icon] ?? '';
}

/**
 * @param {Icon} icon
 * @param {function} tagfn
 * @returns {boolean | null}
 */
Icons.smallest = function smallest(icon, tagfn = svg) {
  for (const size of SIZES) {
    if (/** @type {any}*/ (ICONS)[size][icon]) {
      return tagfn([/** @type {any}*/ (ICONS)[size][icon]]);
    }
  }
  return null;
};
