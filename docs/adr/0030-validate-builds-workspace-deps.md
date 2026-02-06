# ADR 0030: Validate builds workspace deps for project references

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

App validation (`yarn workspace @rankup/app validate`) uses `tsc --noEmit` with project references. After extracting `@rankup/base` and `@rankup/platform`, the app now depends on composite workspaces whose `dist/**` outputs must exist. Without building those workspaces first, `yarn validate` fails with TS6305 because referenced project outputs are missing or stale.

We need `yarn validate` to stay green while keeping the app validate step as a no-emit typecheck.

## Decision

Add a workspace-level typecheck step that builds composite workspace dependencies before running the app validate step:

-   Introduce `typecheck:workspace` to build `packages/base`, `packages/common`, `packages/samba`, `packages/api`, `packages/api-mock`, and `packages/platform`.
-   Update `yarn validate` to run `typecheck:workspace` instead of only `typecheck:api`.
-   Keep workspace build outputs available through the app validate step by running `yarn clean` at the end of `yarn validate` (not inside `typecheck:workspace`).

## Constraints

-   OpenAPI remains the single source of truth (ADR 0006).
-   Mock-first development remains mandatory (ADR 0007).
-   No UI tests (ADR 0002).
-   Generated artifacts are not edited by hand (ADR 0017).

## Consequences

### Positive

-   `yarn validate` succeeds with project references enabled.
-   Workspace package outputs stay in sync with source before app typecheck.
-   App `tsc --noEmit` can read built workspace outputs without TS6305 failures.

### Negative / Risks

-   `yarn validate` emits `dist/**` outputs for workspace packages, increasing runtime.
-   Local `dist/**` directories update more frequently during validation.
-   Build outputs live for the duration of `yarn validate` until the final clean.

## Alternatives considered

-   Change app validation to `tsc -b --noEmit` (not allowed with referenced projects).
-   Change app validation to `tsc -b` (would emit app output and duplicate build work).
-   Disable project reference redirects or remove references (breaks intended TS project structure).
-   Require manual pre-build steps before `yarn validate` (error-prone).

## Implementation plan

-   [x] Add `typecheck:workspace` script in the root `package.json`.
-   [x] Update `yarn validate` to run `typecheck:workspace`.
-   [x] Run `yarn validate` and record evidence.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/work/epics/007-workspace-archetype-alignment.md`
