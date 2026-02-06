import type { ISessionManager } from '../common/sessionManager.js';
import { SessionManager } from './session-manager.js';
import type { ReactiveElement } from 'lit';

export function createSessionManager(host: ReactiveElement): ISessionManager {
	return new SessionManager(host);
}
