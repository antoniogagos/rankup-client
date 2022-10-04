import { ContextConsumer, ContextType, createContext } from '@lit-labs/context';
import type {
	EventsMap,
	SessionManager,
} from '@rankup/authentication/managers/session/session-manager.js';
import { ReactiveElement } from 'lit';

import {
	EventsListenerController,
	Listeners,
} from '../lit-controllers/events-listener-controller.js';

export const sessionManagerContext = createContext<SessionManager>('session-manager');

export { EventsMap, SessionManager };

/**
 * Extends Lit's ContextConsumer to add listeners support.
 * With this we reduce the risk of mem leaks
 */
export class SessionManagerConsumer<Host extends ReactiveElement> extends ContextConsumer<
	typeof sessionManagerContext,
	Host
> {
	listeners?: EventsListenerController<EventsMap>;

	constructor(
		protected host: Host,
		callback?: (value: ContextType<typeof sessionManagerContext>, dispose?: () => void) => void,
		listeners?: Partial<Listeners<EventsMap>>,
	) {
		super(
			host,
			sessionManagerContext,
			(sessionManager: SessionManager, dispose) => {
				callback?.(sessionManager, dispose);
				if (sessionManager) {
					if (listeners) {
						this.listeners = new EventsListenerController(host, listeners, {
							target: sessionManager.host,
						});
					}
				} else {
					this.listeners?.detach();
				}
			},
			true,
		);
	}
}
