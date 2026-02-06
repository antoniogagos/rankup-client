# ADR 0024: Lit css autofix + tabs (4 spaces)

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

The repo enforces Lit ` css\`` formatting via guardrails, but editors still need an auto-fix path on save. Additionally, indentation must be consistent with tabs at size 4 across the repo. Prettier cannot express the desired  `css\`` closing layout, so ESLint needs a local rule with
fixes.

## Decision

-   Add a local ESLint rule (fixable) to:
    -   align ` css\`` template content with the  `css\`` line, and
    -   align the closing backtick with the `css\`` line, and
    -   enforce ` css\`` closing backtick adjacent to the closing  `]`in`static styles` arrays.
-   Enable the rule via `--rulesdir` and VS Code ESLint settings for on-save fixes.
-   Standardize indentation to tabs with size 4 via `.editorconfig`, VS Code settings, and Prettier.
-   Allow a `.js` file under `scripts/eslint-rules/` as a tooling exception to TS-only rules.

## Constraints

-   No UI tests (ADR 0002).
-   Guardrails must remain enforceable under `yarn validate` (ADR 0008).
-   Tracked JS/CJS files remain forbidden except for this explicit tooling exception (ADR 0017).

## Consequences

### Positive

-   Editors can auto-fix Lit `css\`` formatting on save.
-   Consistent indentation across the repo (tabs, width 4).

### Negative / Risks

-   Adds a small JS exception in tooling for ESLint rule loading.
-   Prettier and ESLint formatting must be kept aligned to avoid churn.

## Alternatives considered

-   Prettier plugin for Lit templates (rejected; not supported for the desired layout).
-   No autofix (rejected; too much manual editing friction).

## Implementation plan

-   [x] Add local ESLint rule with fixers for Lit `css\`` formatting.
-   [x] Update editor + Prettier indentation settings to tabs width 4.
-   [x] Extend guardrails and normalize existing `css\`` templates.
-   [x] Update work tracking docs and ADR index.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0023 (Lit css template indent guardrail)
