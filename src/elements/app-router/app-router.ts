import { AppRouter } from './appRouter.js';

customElements.define('app-router', AppRouter);

declare global {
  interface HTMLElementTagNameMap {
    'app-router': AppRouter;
  }
}
