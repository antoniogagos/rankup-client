import { AuthWall } from '../../lib/data-service/elements/auth-wall/authWall.js';
// import { RkSessionProviders } from '../../rk-lib/rk-data-service/session-providers.js';
// import { RkApiService } from '../../rk-lib/rk-data-service/api-service.js';

export class RkAuthWall extends AuthWall {
  async lazyLoadSessionController() {
    const [res] = await Promise.all([
      super.lazyLoadSessionController(),
      import('../../lib/rk-data-service/session-providers.js').then(({ RkSessionProviders }) => {
        this.sessionProviders = RkSessionProviders;
      }),
      import('../../lib/rk-data-service/api-service.js').then(({ RkApiService }) => {
        this.apiService = RkApiService;
      }),
    ]);
    return res;
  }
}

window.customElements.define('rk-auth-wall', RkAuthWall);
