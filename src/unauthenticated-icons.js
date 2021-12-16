import { svg } from 'lit';

/**
 * @typedef {keyof ICONS[24]
 *  | keyof ICONS[16]
 *  | keyof ICONS[12]
 *  | keyof ICONS[10]
 *  | keyof ICONS[8]} Icon
 */

// prettier-ignore
const ICONS = {
  24: {
    "back-arrow": `<svg width="16" height="13" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`
  },

  16: {
    "back-arrow": `<svg width="16" height="13" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`
  },

  12: {
    "back-arrow": `<svg width="16" height="13" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`
  },

  10: {
    "back-arrow": `<svg width="16" height="13" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`
  },

  8: {
    "back-arrow": `<svg width="16" height="13" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.032.426 15.59 5.2c.273.264.409.623.409 1.018 0 .396-.136.75-.41 1.018l-4.558 4.791a1.344 1.344 0 0 1-1.964 0 1.503 1.503 0 0 1 0-2.054L11.26 7.68H1.395C.623 7.68 0 7.03 0 6.226c0-.804.623-1.454 1.39-1.454h9.864L9.065 2.48a1.503 1.503 0 0 1 0-2.055 1.35 1.35 0 0 1 1.968 0Z"/></svg>`
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
