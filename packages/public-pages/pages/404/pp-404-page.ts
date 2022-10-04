import { ContextConsumer, contextProvided } from '@lit-labs/context';
import { routerContext } from '@rankup/common/contexts/main-router-context.js';
import {
	SessionManager,
	sessionManagerContext,
} from '@rankup/common/contexts/session-manager-context.js';
import { msg } from '@rankup/common/i18n/localize.js';
import { RoutesController } from '@rankup/common/router/routes.js';
import { DisposableStore } from '@rankup/common/utils/disposable';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

@customElement('pp-404-page')
export class Pp404Page extends LitElement {
	@contextProvided({ context: routerContext })
	router!: RoutesController;

	public sessionManager = new ContextConsumer(
		this,
		sessionManagerContext,
		this._sessionManagerChanged.bind(this),
		true,
	);

	private _sessionManagerListeners: DisposableStore = new DisposableStore();

	private _sessionManagerChanged(sessionManager: SessionManager) {
		this._sessionManagerListeners.clear();
		this._sessionManagerListeners.add(
			sessionManager?.listen('session-updated', () => this.requestUpdate),
		);
	}

	render() {
		return html`
			<h1>Page not found</h1>
			<a href="${this.router.link(this.sessionManager.value?.isLogged ? 'my-contests' : '/')}"
				>${msg('Volver')}</a
			>
		`;
	}

	static styles = [
		css`
			:host {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				color: #333;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'app-404-page': Pp404Page;
	}
}
