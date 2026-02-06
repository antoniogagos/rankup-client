# ADR 0029: Lit html template formatting guardrail + autofix

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Lit ` html\`` templates were being indented inconsistently (extra indentation, mixed tabs/spaces), especially in nested ternaries and multiline layouts. This creates noisy diffs and undermines the repo's tabs-only indentation rule. The repo already enforces Lit  `css\`` formatting via guardrails and ESLint autofix, so HTML templates should
follow a consistent, enforced layout as well.

## Decision

-   Add a local ESLint rule (fixable) to:
    -   indent ` html\`` template content one tab beyond the  `html\`` line
    -   align the closing backtick with the `html\`` line
-   Add a repo guardrail to enforce the same rules in `yarn validate`.
-   Normalize existing `html\`` templates across packages.

## Constraints

-   No UI tests (ADR 0002).
-   Guardrails must remain enforceable under `yarn validate` (ADR 0008).
-   Tabs-only indentation remains required (ADR 0024).

## Consequences

### Positive

-   Consistent Lit HTML template formatting across the codebase.
-   Editors can auto-fix template indentation on save.

### Negative / Risks

-   Requires a one-time reformat across existing `html\`` templates.
-   ESLint + guardrails must remain aligned to avoid formatting churn.

## Alternatives considered

-   Rely on editor-specific formatting (rejected; not enforceable in CI).
-   Prettier plugin for Lit templates (rejected; not compatible with desired layout).

## Implementation plan

-   [x] Add local ESLint rule with fixers for Lit `html\`` formatting.
-   [x] Extend repo guardrails to enforce Lit `html\`` indentation and closing backtick alignment.
-   [x] Reformat existing `html\`` templates.
-   [x] Update work tracking docs and ADR index.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0023 (Lit css template indent guardrail)
-   ADR 0024 (Lit css autofix + tabs)
