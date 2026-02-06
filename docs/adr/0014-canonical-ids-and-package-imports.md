# ADR 0014: Canonical IDs and workspace package import names

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup is multi-game and multi-sport. Stable identifiers are required for OpenAPI, registries, storage keys, and future migrations. The monorepo also needs a single, canonical import scheme to avoid drift (e.g., `@api` vs `@rankup/api`, deep imports, or relative paths into other packages).

## Decision

### Canonical IDs

-   Game mode IDs are stable, ASCII, and not localized:
    -   `scorePrediction` (display name: ScorePrediction)
    -   `draft` (display name: Draft)
-   Sport IDs are stable, ASCII, and not localized:
    -   `football`
    -   `basketball`
    -   `esports`

### Canonical workspace package names

-   Internal workspaces use the `@rankup/*` scope:
    -   `@rankup/app`
    -   `@rankup/api`
    -   `@rankup/api-mock`
    -   `@rankup/common`
    -   `@rankup/samba`

### Import rules

-   All cross-workspace imports must use canonical package names.
-   Deep imports are disallowed for contract/runtime packages (`@rankup/api`, `@rankup/api-mock`).
-   Other packages may temporarily use deep imports for assets (e.g., `@rankup/samba/styles/*`) until explicit public entrypoints exist; these exceptions must be recorded and reduced over time.

## Constraints

-   No UI tests.
-   OpenAPI-first, mock-first, and structural-change protocol remain mandatory.

## Consequences

### Positive

-   Stable identifiers prevent drift across OpenAPI, mocks, and UI.
-   Predictable import paths reduce refactors and tooling ambiguity.

### Negative / Risks

-   Requires coordinated updates in existing code and tooling.
-   Deep import exceptions must be tracked until public entrypoints exist.

## Alternatives considered

-   Allow ad-hoc aliases (rejected: creates import drift and inconsistent tooling).

## Implementation plan

-   [ ] Update workspace package names to `@rankup/*`.
-   [ ] Update TS path mappings and imports to use canonical names.
-   [ ] Add lint rules to forbid deep imports from `@rankup/api` and `@rankup/api-mock`.
-   [ ] Record canonical IDs in scope decisions and glossary.

## Verification

-   `rg -n "@api\\b|@common\\b|@samba\\b" packages docs` returns no matches.
-   `yarn lint` fails if a file imports `@rankup/api/*` or `@rankup/api-mock/*`.
