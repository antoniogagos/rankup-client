window.requestIdleCallback =
	window.requestIdleCallback ||
	function requestIdleCallback(
		callback: IdleRequestCallback,
		options?: IdleRequestOptions,
	): number {
		const start = Date.now();
		return window.setTimeout(() => {
			callback({
				didTimeout: false,
				timeRemaining() {
					return (options?.timeout ?? 16) - Date.now() - start;
				},
			});
		}, options?.timeout ?? 16);
	};

window.cancelIdleCallback =
	window.cancelIdleCallback ||
	function cancelIdleCallback(id) {
		clearTimeout(id);
	};
