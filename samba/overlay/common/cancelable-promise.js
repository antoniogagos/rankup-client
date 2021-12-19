/**
 * @template T
 * @typedef {Promise<T> & {cancel(): void}} CancelablePromise<T>
 */

/**
 * @template T
 * @param {function((value: any) => void, (reason?: any) => void):void} cb
 * @param {function():void | Promise<void>} [onCancel]
 * @returns {CancelablePromise<T>}
 */
export function cancelablePromise(cb, onCancel) {
  /** @type { (reason?: any) => void} */
  let promiseReject;
  const promise = new Promise((resolve, reject) => {
    try {
      promiseReject = reject;
      cb(resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
  return {
    get [Symbol.toStringTag]() {
      return '[object CancelablePromise]';
    },
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
    cancel: async (...args) => {
      try {
        await onCancel?.(...args);
      } catch (err) {
        console.error(err);
      } finally {
        promiseReject('canceled');
      }
    },
  };
}
