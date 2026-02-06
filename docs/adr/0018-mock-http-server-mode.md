# ADR 0018: HTTP mock server mode (contract-first) as @rankup/api-mock/server

-   Status: Accepted
-   Date: 2026-01-30
-   Owner: Rankup maintainers

## Context

Rankup currently provides an in-memory mock API client (`@rankup/api-mock`) that unblocks UI development. This is necessary but not sufficient for VSCode-grade development because it does not exercise:

-   HTTP semantics (CORS, status codes, headers, preflight)
-   Network-level debugging (DevTools Network tab parity)
-   Latency/error simulation at the transport boundary
-   The eventual integration cliff when a real backend replaces the mock

We want to develop the full frontend without a backend while keeping OpenAPI (`packages/api/openapi.yaml`) as the single source of truth.

Constraints:

-   TS-only repo direction (Epic 005); avoid introducing new `.mjs/.cjs` or build-only workflows.
-   Local development only (no production/staging requirement).
-   UI packages must never import Node-only server code.

## Decision

We will introduce an HTTP mock server mode implemented as a Node-only adapter exported from the existing package via a subpath:

-   `@rankup/api-mock/core` (isomorphic, TS-only): store + handlers + scenario engine
-   `@rankup/api-mock` (in-memory client adapter): uses core handlers
-   `@rankup/api-mock/server` (Node-only adapter): HTTP server that routes/validates requests using OpenAPI and delegates to core handlers when present

Subpath exports will point to TypeScript sources and are executed under `node --import tsx` (TS runtime). We explicitly do not require a build step at this stage.

Routing/validation is contract-first and uses the fallback stack:

-   Load/dereference `packages/api/openapi.yaml` with `@apidevtools/swagger-parser`
-   Match requests to `operationId` using the OpenAPI path templates
-   Validate requests with `ajv` (body + params + query)
-   If no custom handler exists, generate a spec-valid mock response with `openapi-sampler`

Guardrails are mandatory:

-   UI packages (see `docs/architecture/ui-packages.md`) must not import `@rankup/api-mock/server`
-   Core must not import `node:*` or filesystem modules

## Consequences

Positive:

-   Frontend can run against a realistic backend boundary (HTTP) without a real backend.
-   Contract violations become visible immediately (400 on invalid requests).
-   A single shared mock core prevents duplication between in-memory mock and HTTP mock.
-   Default mocking for unimplemented operations keeps the server aligned with spec evolution.

Negative / Costs:

-   Additional dev process (running a second process) when using HTTP mode.
-   Need strict anti-leakage enforcement to prevent Node-only code from entering browser bundles.
-   Requires a spike to confirm the chosen OpenAPI routing/validation library fits TS-only runtime constraints.

## Alternatives considered

1. Keep only in-memory mock (rejected)

-   Does not exercise transport semantics; increases integration cliff.

2. Use Prism / static OpenAPI mock (rejected)

-   Stateless and insufficient for stateful CRUD and scenario logic.

3. Separate workspace package `@rankup/api-mock-server` (rejected for now)

-   Increases workspace proliferation; subpath exports provide sufficient separation.

4. MSW (service worker) (rejected)

-   Blurs boundaries (mock logic inside UI); weaker contract enforcement at server boundary.

5. openapi-backend (rejected)

-   Runtime incompatibility under Node v24.13.0 with `node --import tsx` (SyntaxError in `async-function/require.mjs`).

## Implementation plan

-   WP-006-00: Create this ADR + architecture doc + initial Codex skill.
-   WP-006-01: Add package subpath exports for `./core` and `./server` (TS-only).
-   WP-006-07: Add anti-leakage guardrail to `yarn validate`.
-   WP-006-02: Extract handler registry + core boundary; refactor in-memory client to use the registry.
-   WP-006-03: Spike OpenAPI routing/validation/mocking stack (swagger-parser + ajv + openapi-sampler).
-   WP-006-04: Implement server skeleton using chosen stack (candidate: hono + node adapter).
-   WP-006-05: Implement stateful CRUD for key entities used by UI.
-   WP-006-06: Implement scenario engine (delay/errors/auth simulation/reset).
-   WP-006-08: Final docs + Codex skills + epic closeout evidence.

## Verification

-   `yarn validate` PASS
-   `rg -n "@rankup/api-mock/server" apps/rankup-spa packages/samba` -> 0 matches
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
-   Mock server can:
    -   Serve a handler-backed operation with stateful behavior
    -   Serve an unhandled operation with a spec-valid mock response
    -   Reject invalid requests with 400 + diagnostic payload

## Amendments

### 2026-01-30 — WP-006-03 spike result

-   `openapi-backend@5.15.0` fails under Node v24.13.0 when run via `node --import tsx` (SyntaxError in `async-function/require.mjs` due to `export { ... as 'module.exports' }`).
-   Decision: treat `openapi-backend` as incompatible with the current TS runtime and pivot to a fallback stack:
    -   `@apidevtools/swagger-parser` for loading/dereferencing OpenAPI
    -   `ajv` for request validation
    -   `openapi-sampler` (or equivalent) for default mock generation
-   Fallback spike PASS: `yarn workspace @rankup/api-mock spike:openapi-contract` (Node v24.13.0, `node --import tsx`).
