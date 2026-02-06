import { AppRouter } from './appRouter.js';

export type { EventsMap } from './appRouter.js';

customElements.define('app-router', AppRouter);

declare global {
	interface HTMLElementTagNameMap {
		'app-router': AppRouter;
	}
}

export { AppRouter } from './appRouter.js';
