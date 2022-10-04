window.requestIdleCallback =
	window.requestIdleCallback ||
	function requestIdleCallback(callback: IdleRequestCallback): number {
		const start = Date.now();
		return window.setTimeout(() => {
			callback({
				didTimeout: false,
				timeRemaining() {
					return Math.max(0, 50 - (Date.now() - start));
				},
			});
		}, 1);
	};

window.cancelIdleCallback =
	window.cancelIdleCallback ||
	function cancelIdleCallback(id) {
		clearTimeout(id);
	};
