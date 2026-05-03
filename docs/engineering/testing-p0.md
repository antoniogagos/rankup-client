# P0 Testing Policy (Vitest, Engine-first)

## Scope

-   P0 tests run with `yarn test:p0`.
-   P0 include pattern: `**/__tests__/p0/**/*.test.ts`.
-   Environment: Node-only.

## Determinism Gates

-   Global setup must pin timezone and disable network by default (`vitest.setup.ts`).
-   P0 scope forbids direct `Date.now()`, `Math.random()`, `setTimeout()`, and `sleep()` calls.
-   Any exception requires an explicit allowlist entry with reason in `scripts/test-p0-determinism.ts`.
-   No `.only` / `.skip` in P0 suites.

## ProblemDetails Canonicalization Guardrails

-   `apps/rankup-spa/services/api/http-client.ts` must not reintroduce generic `throw new Error("HTTP ...")` paths for non-2xx responses.
-   API mapper files (`apps/rankup-spa/services/api/**/*-mappers.ts`) must delegate every `*ProblemToDomainError` export to canonical `mapProblemToDomainError` (direct delegation or alias chain).
-   Any ad-hoc ProblemDetails-to-domain-error shape in mapper exports is blocked by `scripts/test-guardrails-p0.ts`.

## Runtime Budget Gates

-   Total P0 runtime budget in CI: `<= 7 minutes` (`420000ms`).
-   Layer budgets (enforced from Vitest JSON report):
	-   mapper suites: `<= 90s`
	-   contract suites: `<= 120s`
	-   smoke suites: `<= 180s`
	-   streaming suites: `<= 60s`

## Layer Model

-   Mapper tests: DTO/domain mapping stability.
-   Contract tests: domain services + fake gateways.
-   Smoke tests: runtime wiring with mock HTTP server.
-   Streaming tests: reconnect/dedupe/ordering policy.

## CI Flow

-   `.github/workflows/test-p0.yml` runs:
	1. `yarn test:guardrails:p0`
	2. `yarn test:determinism:p0`
	3. `yarn test:budget:p0` (executes P0 suite and enforces budgets)

## Commands

-   `yarn test:p0`
-   `yarn test:p0:watch`
-   `yarn test:guardrails:p0`
-   `yarn test:determinism:p0`
-   `yarn test:budget:p0`
-   `yarn test:p0:ci`
-   `yarn engine:test`
-   `yarn validate`
