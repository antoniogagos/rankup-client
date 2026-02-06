# Mock Server Architecture (contract-first, stateful)

## Purpose

Provide a VSCode-grade local HTTP mock backend that allows full frontend development without a real backend, while keeping `packages/api/openapi.yaml` as the source of truth and enforcing strict layering boundaries.

## High-level design

We split mock behavior into an isomorphic core and two adapters:

-   **Mock Core** (`@rankup/api-mock/core`)

    -   In-memory store (session-lifetime)
    -   CRUD store APIs for key entities (create/update/delete reflected in subsequent reads)
    -   Operation handlers keyed by `operationId`
    -   Scenario engine (delay/errors/auth simulation)
    -   Strict rule: **no `node:*` imports**, no filesystem, no HTTP

-   **In-memory client adapter** (`@rankup/api-mock`)

    -   Existing `createMockRankupApiClient()` becomes a thin adapter that dispatches to core handlers
    -   Keeps the platform mock client wiring intact (UI stays on services)

-   **HTTP server adapter** (`@rankup/api-mock/server`)
    -   Node-only HTTP server
    -   Loads `packages/api/openapi.yaml`
    -   Routes requests to `operationId`
    -   Validates requests against OpenAPI
    -   If handler exists -> execute handler against store (from `@rankup/api-mock/core`)
    -   If no handler exists -> return a spec-valid mock response generated from OpenAPI

## Implementation stack

-   OpenAPI loading/dereferencing: `@apidevtools/swagger-parser`
-   Request validation: `ajv`
-   Default mock generation: `openapi-sampler`
-   Routing: lightweight path matcher (method + path template)

## Diagram

UI (browser)
|
| (HTTP client @rankup/api)
v
HTTP boundary
|
v
@rankup/api-mock/server (Node-only adapter)

-   CORS / preflight
-   OpenAPI routing + request validation
-   Scenario engine (delay/errors)
-   Dispatch by operationId
    |
    v
    @rankup/api-mock/core (isomorphic)
-   store
-   handlers registry (operationId -> handler)
    |
    v
    Response (status + json)

In-memory mode:
UI (browser) -> domain service -> gateway -> SDK client (mock) -> @rankup/api-mock (client adapter) -> core handlers -> response

## Server-only controls (Scenario Engine)

We do not extend the OpenAPI contract for dev-only controls. We use request metadata instead
(either headers or query params with the same keys):

-   `x-rankup-mock-delay-ms: <number>`
-   `x-rankup-mock-force-status: 401|403|404|429|500`
-   `x-rankup-mock-reset: 1` (clears the in-memory core store)
-   `x-rankup-mock-auth: required|disabled`

Exact naming is owned by Epic 006; keep stable once published.

## Guardrails

Mandatory:

-   UI packages must not import server adapter:
    -   `rg -n "@rankup/api-mock/server" apps/rankup-spa packages/samba` must return 0 matches
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
-   Core must not import Node builtins:
    -   `rg -n "node:" packages/api-mock/src/core` must return 0 matches

Recommended (later, ESLint):

-   Add import restrictions preventing UI importing Node-only or server subpaths.

## How to add/extend behavior

1. Update `packages/api/openapi.yaml` (follow ADR 0006)
2. Regenerate/verify OpenAPI artifacts (repo command)
3. If UI needs realistic behavior, implement a handler in core:
    - Add handler keyed by `operationId`
    - Use store for state
    - Ensure response matches spec types
4. If no handler exists, default mock response still works, but is stateless.

## Operational usage

-   Start mock server:
    -   `yarn workspace @rankup/api-mock dev:server` (command name to be defined in Epic 006)
-   Scenario smoke:
    -   `yarn workspace @rankup/api-mock smoke:scenario`
-   Point app to HTTP mock:
    -   Use existing HTTP client mode and set base URL to `http://localhost:4010`

## Notes

This architecture intentionally preserves the in-memory mock path. HTTP mode is an additional adapter that reduces the integration cliff and enables transport-level testing in local development.
