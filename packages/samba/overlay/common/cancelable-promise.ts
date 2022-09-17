export type CancelablePromise<T> = Promise<T> & {
  cancel(): void;
};

export function cancelablePromise<T = void>(
  cb: (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: unknown) => void,
  ) => void | Promise<void>,
  onCancel?: () => void | Promise<void>,
): CancelablePromise<T> {
  let promiseReject: (reason?: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    try {
      promiseReject = reject;
      cb(resolve, reject);
    } catch (error) {
      reject(error);
    }
  });
  return {
    get [Symbol.toStringTag]() {
      return '[object CancelablePromise]';
    },
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
    cancel: async () => {
      try {
        await onCancel?.();
      } catch (error) {
        console.error(error);
      } finally {
        promiseReject('canceled');
      }
    },
  };
}
