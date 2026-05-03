# OpenAPI change protocol (normative)

This protocol defines the mandatory steps for any change to `packages/api/openapi.yaml`.
It is designed to prevent contract drift across domain models, gateways, and mocks.

## Scope

Applies to any change in:

-   Paths, operations, parameters, request/response bodies
-   Components/schemas
-   Error responses and headers

## Workflow (must follow in order)

1. **Edit OpenAPI first**

-   Update `packages/api/openapi.yaml`.
-   Keep `operationId` stable unless the endpoint is truly new.

2. **Lint + regenerate**

-   `yarn openapi:lint`
-   `yarn openapi:verify`

3. **Update SDK contract exports**

-   Ensure `packages/api/src/generated/openapi.ts` reflects the new spec.
-   Ensure OpenAPI-derived catalogs remain in sync (`packages/api/src/generated/operations.{ts,json}` and `packages/api/src/generated/match-status-catalog.{ts,json}`).
-   Update `packages/api/src/client.ts` and `packages/api/src/types.ts` if needed.

4. **Update domain models and contracts**

-   Update `packages/rankup/src/domains/*/<capability>/models/**` to reflect the new shapes.
-   Re-export from `<capability>/contracts/types.ts` (UI entry point).

5. **Update gateway mapping + HTTP client**

-   Map SDK DTOs to domain DTOs in `apps/rankup-spa/services/api/*-gateway.ts`.
-   Use `defineSharedKeys` + `pickFields` + `mapOptional` from `apps/rankup-spa/services/api/gateway-mapping.ts` when shapes align.
-   Update `apps/rankup-spa/services/api/http-client.ts` when new endpoints/params are added.

6. **Update mocks**

-   Mirror the changes in `packages/api-mock/src/**` (mock-first parity).

7. **Verify + log**

-   Run `yarn validate`.
-   Record PASS/FAIL in `docs/work/log/YYYY-MM-DD.md`.

## Quality checks

-   No new `.js/.mjs/.cjs` files are tracked.
-   No `@rankup/api` imports outside `apps/rankup-spa/services/api/**`.
-   UI does not import SDK or runtime implementations.

## Common failure modes

-   Updating mocks/UI without changing OpenAPI (drift).
-   Regenerating `openapi.ts` but forgetting to update domain models or gateways.
-   Introducing new endpoints without updating the HTTP client.
