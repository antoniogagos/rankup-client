# ADR 0026: ESLint flat config + import sorting alignment

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

ESLint v9 warns when using eslintrc-based configuration. The repo currently relies on
`eslintConfig` in `package.json`, plus custom rule loading via `--rulesdir`. We also need
`yarn lint --fix` to stop inserting blank lines between imports while still preserving
the import sorting rule.

## Decision

-   Migrate to `eslint.config.js` (flat config) to remove ESLintRC deprecation warnings.
-   Inline the local Lit ` css\`` rule as a flat-config plugin (no  `--rulesdir`).
-   Configure `simple-import-sort/imports` with a single group to avoid blank lines.
-   Route `yarn lint --fix` through a wrapper that runs Prettier on non-TS files before ESLint (avoid Lit template churn in TS).

## Constraints

-   Guardrails and lint must remain enforceable via `yarn validate`.
-   TS-only repo policy applies; `eslint.config.js` is explicitly allowlisted here.

## Consequences

### Positive

-   ESLint warnings are removed under v9+.
-   `yarn lint --fix` no longer introduces blank lines between imports.
-   Custom Lit `css\`` rule works without additional CLI flags.
-   Prettier no longer rewrites Lit template literals in TS.

### Negative / Risks

-   Requires updating tooling allowlists for the new JS config file.

## Alternatives considered

-   Keep eslintrc + warning (rejected; noisy for agents).
-   Disable import sorting (rejected; keep deterministic order without blank lines).

## Implementation plan

-   [x] Add `eslint.config.js` and remove `eslintConfig` from `package.json`.
-   [x] Allowlist `eslint.config.js` in repo artifacts policy + ratchet.
-   [x] Update lint script to use flat config.

## Verification

-   Command(s):
    -   `yarn lint --fix`
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0021 (import formatting guardrail)
-   ADR 0024 (Lit css autofix + tabs)
