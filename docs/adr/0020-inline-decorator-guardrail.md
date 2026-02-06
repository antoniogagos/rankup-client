# ADR 0020: Inline decorator formatting guardrail for Lit fields

-   Status: Accepted
-   Date: 2026-01-30
-   Owners: Rankup maintainers
-   Scope: repo (guardrails + UI conventions)

## Context

We want consistent, VS Code-style component formatting for Lit decorators. In particular, field decorators
such as `@property`, `@state`, `@query`, and `@service` should remain on the same line as the field declaration
(e.g. `@property(...) foo = ''`). This keeps declarations compact and predictable, and prevents accidental
format drift during edits.

## Decision

Enforce inline decorator formatting via a repo guardrail:

-   Decorators `@property`, `@state`, `@query`, `@queryAll`, `@queryAsync`, and `@service` must appear on the same
    line as the field declaration.
-   The guardrail runs during `yarn validate` and fails on violations.

## Constraints

-   No UI tests (ADR 0002).
-   Guardrails remain monotonic (ADR 0008).

## Consequences

### Positive

-   Consistent, predictable formatting across UI components.
-   Prevents regressions without relying on manual review.

### Negative / Risks

-   Requires refactors to align existing code to the rule.
-   Guardrail is regex-based and must be kept in sync with decorator usage.

## Alternatives considered

-   Rely on formatter or manual review (rejected: does not prevent regressions).
-   Custom ESLint rule (deferred: higher maintenance and setup cost).

## Implementation plan

-   [x] Normalize decorator formatting across `packages/**`.
-   [x] Add guardrail to `scripts/repo-guardrails.ts`.
-   [x] Update documentation and work log.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   Guardrails pass with no decorator formatting violations.

## References

-   Docs: `docs/architecture/di.md`
-   Guardrail: `scripts/repo-guardrails.ts`
