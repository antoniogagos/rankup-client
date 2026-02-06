# ADR 0004: Enforce package dependency boundaries via ESLint

-   Status: Accepted
-   Date: YYYY-MM-DD
-   Owners: Rankup maintainers
-   Scope: repo

## Context

The repo is a monorepo with three workspaces: common, samba, app.
Without enforced boundaries, accidental upstream dependencies will create cycles and architectural drift.

## Decision

We enforce workspace dependency direction using ESLint:

-   common must not import from samba or app
-   samba must not import from app
-   app may import from samba and common

We implement this with:

-   eslint-plugin-import `import/no-restricted-paths`
-   eslint-import-resolver-typescript for correct TS/paths resolution

Implementation is deferred until the toolchain baseline is upgraded (ADR 0005).

## Constraints

-   No UI tests.

## Consequences

### Positive

-   Violations fail fast during lint.
-   Maintains a clear layering model.

### Negative / Risks

-   Requires correct import resolution config; misconfiguration can create false negatives/positives.

## Implementation plan

-   [ ] Add eslint-import-resolver-typescript
-   [ ] Add ESLint zone rules
-   [ ] Add `yarn lint` script and run it in `validate`

## Verification

-   `yarn lint`
-   Manual sanity check (do not commit):
    -   Add an import in `packages/common` from any module in `apps/rankup-spa`
    -   Expect: ESLint error "packages/common must not depend on apps/rankup-spa"
