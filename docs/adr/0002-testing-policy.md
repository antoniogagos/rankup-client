# ADR 0002: Testing policy (algorithm-only, no UI tests)

-   Status: Accepted
-   Date: YYYY-MM-DD
-   Owners: Rankup maintainers
-   Scope: repo

## Context

We want minimal tests focused on correctness of core algorithms and invariants. UI tests create maintenance cost and low ROI for this repo.

## Decision

-   No UI tests (no component snapshot tests, no browser interaction tests).
-   Tests are allowed only for:
    -   core scoring algorithms
    -   probability/odds computations
    -   ranking/tie-break logic
    -   draft allocation rules
    -   any critical pure functions where a regression would be costly
-   Everything else is validated by:
    -   `tsc --noEmit` (typecheck)
    -   `eslint` (lint)
    -   `build` (bundling succeeds)

## Constraints

-   Keep test count small and targeted.
-   Prefer pure functions and deterministic tests.

## Verification

-   `yarn validate` runs:
    -   typecheck
    -   lint
    -   unit tests (if any exist)
-   No test suite depends on DOM rendering.
