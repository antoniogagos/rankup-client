# Epic 006: HTTP Mock Server (contract-first, stateful)

## Status

-   Status: Done (WP-006-08 complete; docs + skill + evidence)
-   Owner: Rankup maintainers
-   Last updated: 2026-01-31
-   Depends on: Epic 005 TS-only direction (must not be violated)

## Progress

-   WP-006-00: Done (ADR 0018, architecture doc, initial skill).
-   WP-006-01: Done (TS-only exports + `dev:server` script).
-   WP-006-02: Done (mock core registry + handler extraction).
-   WP-006-07: Done (anti-leakage guardrail in validate).
-   WP-006-03: Done (fallback stack validated: swagger-parser + ajv + openapi-sampler; openapi-backend rejected under Node 24 + `node --import tsx`).
-   WP-006-04: Done (server skeleton wired to core handlers + default mocks).
-   WP-006-05: Done (stateful CRUD in core store).
-   WP-006-06: Done (scenario engine: delay/status/auth/reset via headers/query).
-   WP-006-08: Done (docs + skill final + closeout evidence).

## Goal

Deliver a local HTTP mock server that:

-   Routes and validates requests using `packages/api/openapi.yaml`
-   Provides default spec-valid mocks for unhandled endpoints
-   Provides stateful CRUD and realistic behavior for key endpoints
-   Supports scenario controls (delay/errors/auth simulation)
-   Enforces anti-leakage guardrails (server code cannot enter browser bundles)

## Non-goals

-   Production deployment
-   CI E2E testing
-   Real authentication
-   Full parity for every endpoint on day 1 (default mocking covers the long tail)

## Invariants (must not regress)

-   OpenAPI remains the single source of truth (ADR 0006)
-   UI packages must not import `@rankup/api-mock/server`
-   `@rankup/api-mock/core` must remain isomorphic (no `node:*`)
-   TS-only workflow (no new `.mjs/.cjs` artifacts)

---

## Work packets overview (execution order)

| Order | WP        | Title                                                   | Depends on     | Blocking | Hotspots                                         |
| ----: | --------- | ------------------------------------------------------- | -------------- | -------- | ------------------------------------------------ |
|     1 | WP-006-00 | ADR 0018 + architecture doc + initial Codex skill       | none           | YES      | docs                                             |
|     2 | WP-006-01 | Subpath exports + public surface (`./core`, `./server`) | WP-006-00      | YES      | `packages/api-mock/package.json`                 |
|     3 | WP-006-07 | Guardrail anti-leakage in validate                      | WP-006-01      | YES      | `scripts/repo-guardrails.ts` / validate pipeline |
|     4 | WP-006-02 | Handler registry + core extraction                      | WP-006-07      | NO       | `packages/api-mock/src/index.ts`                 |
|     5 | WP-006-03 | Spike: OpenAPI routing/validation/mocking               | WP-006-02      | YES      | deps + server prototype                          |
|     6 | WP-006-04 | Server skeleton                                         | WP-006-03 PASS | NO       | `packages/api-mock/src/server/**`                |
|     7 | WP-006-05 | Stateful CRUD                                           | WP-006-04      | NO       | core store/handlers                              |
|     8 | WP-006-06 | Scenario engine                                         | WP-006-05      | NO       | shared core                                      |
|     9 | WP-006-08 | Docs + skill final + closeout evidence                  | all            | NO       | docs                                             |

---

## WP-006-00: ADR 0018 + architecture doc + initial Codex skill

### Goal

Create ADR and baseline documentation that locks decisions and vocabulary.

### DoR

-   [x] ADR number available (0018)
-   [x] Agreement that subpath exports is the chosen packaging strategy

### DoD

-   [x] `docs/adr/0018-mock-http-server-mode.md` merged
-   [x] `docs/architecture/mock-server.md` merged
-   [x] Initial Codex skill created (minimal but usable)

### Verification

-   Docs render in repo; no code changes required

---

## WP-006-01: Subpath exports + public surface

### Goal

Enable imports:

-   `@rankup/api-mock/core`
-   `@rankup/api-mock/server`

### Decision (explicit)

-   Runtime is TS-only via `node --import tsx`
-   Exports point to `./src/**` (no `dist` required)

### DoR

-   [x] WP-006-00 merged

### DoD

-   [x] `packages/api-mock/package.json` has `exports` for `.`, `./core`, `./server`
-   [x] Workspace scripts exist for running server in dev (name TBD)
-   [x] `yarn validate` PASS

---

## WP-006-07: Guardrail anti-leakage (must be early)

### Goal

Prevent browser packages from importing Node-only server code.

### DoR

-   [x] WP-006-01 merged

### DoD

-   [x] Guardrail runs during `yarn validate`
-   [x] It fails if `@rankup/api-mock/server` is imported from UI packages (see `docs/architecture/ui-packages.md`)
-   [x] Evidence recorded in work log

### Verification

-   `rg -n "@rankup/api-mock/server" packages/app packages/samba` -> 0 matches (UI packages)
    -   UI packages = `packages/app/pages/**`, `packages/app/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)

---

## WP-006-02: Handler registry + core extraction

### Goal

Refactor in-memory mock to use:

-   `core/store`
-   `core/handlers registry (operationId -> handler)`

### Constraints

-   core remains isomorphic (no node imports)

### DoD

-   [x] handlers are no longer inline inside `createMockRankupApiClient()`
-   [x] registry exists and is reused by client adapter
-   [x] `yarn validate` PASS

---

## WP-006-03: Spike (blocking) — OpenAPI routing/validation/mocking

### Goal

Prove viability of the contract-first stack.

### Stack (validated)

-   `@apidevtools/swagger-parser` (load/dereference)
-   `ajv` (request validation)
-   `openapi-sampler` (default mocks)

### Spike PASS criteria

-   [x] Load `packages/api/openapi.yaml`
-   [x] Route to operationId from real HTTP request
-   [x] Validate request body against schema -> returns 400 on invalid
-   [x] Generate mock response for an operation without custom handler
-   [x] Runs with `node --import tsx` (no build)

### Outcome

-   PASS -> adopt stack
-   FAIL -> decide fallback and update ADR 0018 with amendment

### Notes (2026-01-30)

-   `openapi-backend@5.15.0` fails under Node v24.13.0 with `node --import tsx` (SyntaxError in `async-function/require.mjs`).
-   Fallback spike PASS: `@apidevtools/swagger-parser` + `ajv` + `openapi-sampler` can load spec, route, validate, and mock under `node --import tsx`.

---

## WP-006-04: Server skeleton

### Goal

Implement Node-only HTTP server adapter:

-   CORS
-   routing via OpenAPI
-   dispatch to core handlers when present
-   default mock for unhandled operations

### DoD

-   [x] `yarn workspace @rankup/api-mock dev:server` starts server
-   [x] At least one request served end-to-end
-   [x] `yarn validate` PASS

---

## WP-006-05: Stateful CRUD

### Goal

Implement stateful behavior for the endpoints needed by UI now.

### DoD

-   [x] Create/update/delete reflected in subsequent GETs
-   [x] Deterministic fixtures supported

---

## WP-006-06: Scenario engine

### Goal

Add delay/errors/auth simulation and reset control.

### DoD

-   [x] Delay works via header/query
-   [x] Forced status works via header/query
-   [x] Reset clears store

---

## WP-006-08: Docs + skill final + closeout

### Goal

Make it maintainable and agent-operable.

### DoD

-   [x] Docs updated, commands documented
-   [x] Codex skill complete
-   [x] Work log evidence recorded
