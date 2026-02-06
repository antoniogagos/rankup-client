import type { ReactiveController, ReactiveElement } from 'lit';

export class VisibilityController implements ReactiveController {
	constructor(host: ReactiveElement, callback: (isVisible: boolean) => void) {
		if (host.nodeType !== Node.ELEMENT_NODE) throw new Error('InvalidHost');
		this.host = host;
		this.#callback = callback;
		host.addController(this);
	}

	host: ReactiveElement;

	#callback: (isVisible: boolean) => void;

	#visible = false;

	#obs: IntersectionObserver | null = null;

	get visible() {
		return this.#visible;
	}

	hostConnected() {
		this.#observeVisibility();
	}

	hostDisconnected() {
		this.#unobserveVisibility();
		this.#setVisibility(false);
	}

	detach() {
		this.#unobserveVisibility();
		this.host.removeController(this);
	}

	#observeVisibility() {
		this.#obs = new IntersectionObserver(([entry]) => this.#setVisibility(entry.isIntersecting), {
			rootMargin: '0px',
		});
		this.#obs.observe(this.host);
	}

	#unobserveVisibility() {
		this.#obs?.disconnect();
		this.#obs = null;
	}

	#setVisibility(visible: boolean) {
		if (visible !== this.#visible) {
			this.#visible = visible;
			this.#callback?.(visible);
			if (visible) {
				this.host.requestUpdate();
			}
		}
	}
}
