# ADR 0021: Import formatting guardrail (single-line, no blank separators)

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Import formatting has drifted: multi-line named imports and blank-line separators between import statements are common.
This breaks readability expectations in this repo and makes diffs noisy when guardrails enforce a tighter format.
We already have repo guardrails for structural rules and inline decorators, so import formatting should be enforced
at the same level to keep the codebase consistent.

## Decision

Add repo guardrails that enforce:

-   Named imports must be on a single line (no multi-line import specifier blocks).
-   No blank lines between consecutive import statements.

Normalize the repo to comply with these rules.

## Constraints

-   Guardrails are monotonic; new rules must be enforceable with `yarn validate`.
-   Keep the change TS-only and compatible with existing lint/validate tooling.

## Consequences

### Positive

-   Consistent, predictable import formatting across the repo.
-   Less diff churn from format drift.
-   Guardrails catch violations early in `yarn validate`.

### Negative / Risks

-   Large formatting diff across many files.
-   Long import lines may reduce readability in some files.

## Alternatives considered

-   Rely on Prettier/ESLint formatting rules only.
-   Allow multi-line named imports and keep blank-line group separators.

## Implementation plan

-   [x] Add guardrails in `scripts/repo-guardrails.ts` for single-line imports and no blank-line separators.
-   [x] Normalize existing imports across repo TS sources (`packages/**`, `scripts/**`, root helpers).
-   [x] Update work tracking + ADR index.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/engineering/structural-change-protocol.md`
