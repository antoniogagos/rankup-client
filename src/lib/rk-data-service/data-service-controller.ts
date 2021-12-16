import type { ReactiveElement } from 'lit';
import type { LoggedUser } from '../data-service/types.js';
import { DataService } from '../data-service/data-service-controller.js';
import { RkSessionProviders } from './session-providers.js';
import { RkApiService } from './api-service.js';

export class RkDataServiceController extends DataService<RkApiService, typeof RkSessionProviders> {
  constructor(
    host: ReactiveElement,
    { onUserChanged }: { onUserChanged?: (loggedUser: LoggedUser) => void } = {},
  ) {
    super(host, RkSessionProviders, new RkApiService(), { onUserChanged });
  }
}
