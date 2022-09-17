export class VisibilityController {
    constructor(host, callback) {
        if (host.nodeType !== Node.ELEMENT_NODE)
            throw new Error('InvalidHost');
        this.host = host;
        this.#callback = callback;
        host.addController(this);
    }
    host;
    #callback;
    #visible = false;
    #obs = null;
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
    #setVisibility(visible) {
        if (visible !== this.#visible) {
            this.#visible = visible;
            this.#callback?.(visible);
            if (visible) {
                this.host.requestUpdate();
            }
        }
    }
}
//# sourceMappingURL=visibility-controller.js.map