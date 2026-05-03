# ADR 0068: Engine test platform Vitest v1

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: packages/rankup + repo tooling

## Context

Epic 010 acceptance closure (`WP-010-F3`) requires scaling deterministic engine test coverage (`AC-010-F3-16/17`) on top of a single test runner. The previous baseline used `node:test`, which is valid but diverged from the requested long-term direction and did not provide a unified runner contract for future suites.

## Decision

-   Standardize engine tests on `Vitest`.
-   `yarn engine:test` now runs `vitest run -c vitest.engine.config.ts`.
-   Engine tests remain Node-only (no DOM/browser/happy-dom) and continue to follow ADR 0002.
-   Keep a temporary bridge command `engine:test:legacy` using `node:test` for short-term diagnostics only.
-   Enforce discipline through guardrails on `packages/rankup/test/**`:
    -   forbid `.only()` / `.skip()`,
    -   forbid imports of `node:test` and `node:assert/strict`.

## Constraints

-   No UI/component/browser test suites are introduced.
-   OpenAPI, runtime contracts, and domain APIs remain unchanged by this ADR.
-   Test setup must stay deterministic (`TZ=UTC`, restored mocks/timers).

## Consequences

### Positive

-   Single runner for engine acceptance closure and future expansion.
-   Better maintainability for replay/golden/concurrency suites.
-   Guardrails prevent accidental fallback to mixed runner semantics.

### Negative / Risks

-   Additional dev dependency (`vitest`) and config maintenance.
-   Bridge period can cause confusion if contributors use `engine:test:legacy` as the default.

## Alternatives considered

-   Keep `node:test` as the long-term runner (rejected for Epic 010 target alignment).
-   Dual-runner permanent model (rejected due to complexity and drift risk).

## Implementation plan

-   [x] Add `vitest.engine.config.ts` and deterministic setup under `packages/rankup/test/setup.ts`.
-   [x] Migrate `packages/rankup/test/engine-runtime.test.ts` from `node:test` to Vitest APIs.
-   [x] Add reusable runtime fixtures under `packages/rankup/test/testkit/runtime-fixtures.ts`.
-   [x] Update scripts: `engine:test`, `engine:test:watch`, `engine:test:legacy`.
-   [x] Add guardrails for runner discipline in `scripts/repo-guardrails.ts`.

## Verification

-   `yarn engine:test`
-   `yarn validate`
