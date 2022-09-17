import { CancelablePromise, cancelablePromise } from './cancelable-promise.js';

const requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(
    cb: (p: { didTimeout: boolean; timeRemaining: () => number }) => void,
  ) {
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
  function cancelIdleCallback(id: NodeJS.Timeout) {
    window.clearTimeout(id);
  };

/**
 * Wait until an element is rendered to resolve.
 *
 * If IntersectionObserver is not available, by default it checks that offsetHeight is > 0, but
 * you can pass a different property (but the check will be the same: prop>0)
 */
export function whenVisible(
  element: HTMLElement,
  opts?: { rootMargin?: string; threshold?: number; timeout?: number },
): CancelablePromise<void> {
  const { timeout, rootMargin, threshold } = opts ?? {};
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

function _whenVisibleUsingIntersectionObs({
  element,
  rootMargin,
  threshold,
}: {
  element: HTMLElement;
  rootMargin?: string;
  threshold?: number;
}) {
  let obs: IntersectionObserver | null;
  return cancelablePromise(
    resolve => {
      obs = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            obs?.disconnect();
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

function _whenVisibleUsingSize(
  el: HTMLElement,
  opts: { timeout: number },
): CancelablePromise<void> {
  const { timeout = 2500 } = opts ?? {};
  let idleReq: NodeJS.Timeout | number | null;
  let raf: number;
  return cancelablePromise<void>(
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
      cancelIdleCallback(idleReq as NodeJS.Timeout & number);
      idleReq = null;
    },
  );
}
