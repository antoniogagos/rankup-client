import { AuthWall } from '../../lib/data-service/elements/auth-wall/authWall.js';
import { RkSessionProviders } from '../../rk-lib/rk-data-service/session-providers.js';
import { RkApiService } from '../../rk-lib/rk-data-service/api-service.js';

export class RkAuthWall extends AuthWall {
  sessionProviders = RkSessionProviders;

  apiService = RkApiService;
}

window.customElements.define('rk-auth-wall', RkAuthWall);
