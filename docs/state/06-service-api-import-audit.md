# Service/API import audit

-   Date: 2026-02-02
-   Commit: working tree

## Commands run

-   `rg -n "@rankup/api-mock" apps/rankup-spa --glob "*.ts"`
-   `rg -n "@rankup/api-mock" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba`
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
-   `rg -n "createMockRankupApiClient|createHttpRankupApiClient" apps/rankup-spa packages/samba`
-   `rg -n "fetch\(|fetchFn\(" packages/platform apps/rankup-spa packages/samba`

## Results

### @rankup/api-mock imports

```
apps/rankup-spa/lib/composition-root.ts:1:import { createMockRankupApiClient } from '@rankup/api-mock';
```

No matches in `apps/rankup-spa/pages`, `apps/rankup-spa/elements`, or `packages/samba`.

### API client factories

```
apps/rankup-spa/services/api/http-client.ts:25:export function createHttpRankupApiClient(options: HttpClientOptions): RankupApiClient {
apps/rankup-spa/services/api/create-rankup-api-client.ts:1:import { createHttpRankupApiClient } from './http-client.js';
apps/rankup-spa/lib/composition-root.ts:1:import { createMockRankupApiClient } from '@rankup/api-mock';
```

### fetch usage

```
apps/rankup-spa/services/api/http-client.ts:40:	const resp = await fetchFn(input, init);
apps/rankup-spa/services/api/http-client.ts:77:	const resp = await fetchFn(url, { redirect: 'manual' });
packages/platform/src/session/browser/session-manager.ts:266:		const authResp = await fetch(`${OAuthServerURL}/token`, {
```
