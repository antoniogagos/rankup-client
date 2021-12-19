import { cancelablePromise } from './cancelable-promise.js';
/** @template T @typedef {import('./cancelable-promise').CancelablePromise<T>} CancelablePromise<T> */

const requestIdleCallback =
  window.requestIdleCallback ||
  /** @param {(p: {didTimeout: boolean, timeRemaining: () => number}) => void} cb */
  function requestIdleCallback(cb) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

const cancelIdleCallback =
  window.cancelIdleCallback ||
  /** @param {NodeJS.Timeout} id */
  function cancelIdleCallback(id) {
    window.clearTimeout(id);
  };

/**
 * Wait until an element is rendered to resolve. By default it checks that offsetHeight is > 0, but
 * you can pass a different property (but the check will be the same: prop>0)
 *
 * @param {HTMLElement} element Element to wait for
 * @param {object} [options]
 * @param {string} [options.rootMargin]
 * @param {number} [options.threshold]
 * @param {number} [options.timeout=2500] Finish after (ms). Default is `2500`
 * @returns {CancelablePromise<void>} Returns if the element was finally rendered.
 */
export function whenVisible(element, { timeout, rootMargin, threshold } = {}) {
  if ('IntersectionObserver' in window) {
    const res = _whenVisibleUsingIntersectionObs({ element, rootMargin, threshold });
    if (timeout != null) {
      const timeoutId = setTimeout(() => res.cancel(), timeout);
      res.finally(() => clearTimeout(timeoutId));
    }
    return res;
  }
  return _whenVisibleUsingSize(element, { timeout: timeout ?? 2500 });
}

/**
 *
 * @param {{
 *   element?: Element
 *   rootMargin?: string
 *   threshold?: number
 * }} param0
 * @returns
 */
function _whenVisibleUsingIntersectionObs({ element, rootMargin, threshold }) {
  /** @type {IntersectionObserver} */
  let obs;
  return cancelablePromise(
    resolve => {
      obs = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            obs.disconnect();
            obs = null;
            resolve();
          }
        },
        {
          rootMargin,
          threshold: threshold ?? 0,
        },
      );
      obs.observe(element);
    },
    () => {
      obs?.disconnect();
      obs = null;
    },
  );
}

/**
 * @param {HTMLElement} el
 * @param {Object} param1
 * @param {number} [param1.timeout=2500]
 * @returns {CancelablePromise<void>}
 */
function _whenVisibleUsingSize(el, { timeout = 2500 } = {}) {
  /** @type {NodeJS.Timeout} */
  let idleReq = null;
  /** @type {number} */
  let raf = null;
  return cancelablePromise(
    resolve => {
      const start = performance.now();
      const assureRendered = () => {
        const timeRunning = performance.now() - start;
        raf = requestAnimationFrame(() => {
          const rendered = el.offsetWidth > 0 || el.offsetHeight > 0;
          const waitExpired = timeRunning > timeout;
          if (!rendered && !waitExpired) {
            idleReq = requestIdleCallback(assureRendered);
          } else {
            resolve();
          }
        });
      };
      idleReq = requestIdleCallback(assureRendered);
    },
    () => {
      cancelAnimationFrame(raf);
      cancelIdleCallback(idleReq);
      idleReq = null;
    },
  );
}
