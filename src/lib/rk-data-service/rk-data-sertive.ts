import type { ReactiveControllerHost } from 'lit';
import type { IApiService, LoggedUser } from '../data-service/types.js';
import { DataService } from '../data-service/data-service-controller.js';
import { RkSessionProviders } from './session-providers.js';
import { RkApiService } from './api-service.js';

export class RkDataService extends DataService<IApiService> {
  constructor(
    host: HTMLElement & ReactiveControllerHost,
    { onUserChanged }: { onUserChanged?: (loggedUser: LoggedUser) => void } = {},
  ) {
    super(host, RkSessionProviders, RkApiService, { onUserChanged });
  }
}
