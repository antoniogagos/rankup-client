# ADR 0034: Guardrail to forbid UI fetch usage

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, apps/rankup-spa

## Context

ADR 0010 forbids UI from calling `fetch()` directly, but enforcement was implicit. With UI now fully routed through domain services and platform APIs, regressions should be blocked automatically.

## Decision

Add a guardrail in `scripts/repo-guardrails.ts` that fails if `fetch(` appears in UI packages under:

-   `apps/rankup-spa/pages/**`
-   `apps/rankup-spa/elements/**`

## Constraints

-   OpenAPI-first (ADR 0006)
-   Mock-first (ADR 0007)
-   UI packages must not import runtime API implementations (ADR 0010)

## Consequences

### Positive

-   Prevents UI regressions to direct HTTP usage.
-   Reinforces the platform/domain service boundary.

### Negative / Risks

-   False positives if UI ever needs to reference `fetch` in comments or strings.
-   Developers must route all network needs through platform/domain services.

## Alternatives considered

-   ESLint rule only (rejected: guardrails already enforce invariants in this repo).
-   Allowlist exceptions (rejected: undermines the boundary).

## Implementation plan

-   [x] Add guardrail in `scripts/repo-guardrails.ts`.
-   [x] Update ADR index.
-   [x] Record evidence in work log.
-   [x] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0010: UI does not import API implementations
