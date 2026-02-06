# ADR 0036: Forbid @rankup/api-mock imports outside platform wiring

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, apps/rankup-spa

## Context

UI packages are already guarded against `@rankup/api-mock` imports. However, other app workspace code (outside platform wiring) could still import the mock runtime and bypass the composition root. We want all mock/real selection to happen in the platform layer only.

## Decision

Add a guardrail that blocks `@rankup/api-mock` imports anywhere under `apps/rankup-spa/**`, except the platform wiring path:

-   Allowed: `packages/platform/src/**`
-   Forbidden: all other `apps/rankup-spa/**`

## Constraints

-   Mock selection happens only in the composition root (ADR 0016).
-   UI packages must not import runtime implementations (ADR 0010).

## Consequences

### Positive

-   Ensures mock usage is limited to the platform layer.
-   Prevents accidental coupling in app code outside platform.

### Negative / Risks

-   If any app code outside platform needs mock runtime, it must be refactored into platform services first.

## Alternatives considered

-   Allowlist specific app files (rejected: weakens boundary).
-   Rely on code review (rejected: guardrails are required).

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

-   ADR 0016: Composition root
-   ADR 0035: UI api-mock guardrail

## Update (2026-02-02)

-   Superseded by ADR 0048: mock selection moved to the app composition root.
-   Guardrail now allowlists `apps/rankup-spa/lib/composition-root.ts` instead of platform wiring.
