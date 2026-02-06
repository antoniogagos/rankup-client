# ADR 0027: Extract platform into @rankup/platform

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, packages/platform, apps/rankup-spa

## Context

The workspace is being aligned to the Hadron/VS Code archetype (base/platform/app).
Platform services, DI primitives, and composition root wiring currently live under
`packages/app/src/platform` (now `apps/rankup-spa/src/platform` after ADR 0042), which blurs package boundaries and makes reuse harder.

## Decision

-   Create a dedicated `@rankup/platform` workspace package.
-   Move `packages/app/src/platform/**` (now `apps/rankup-spa/src/platform/**`) into `packages/platform/src/**`.
-   Move environment config and session manager implementation into the platform package.
-   Update app imports to consume platform APIs via `@rankup/platform/*`.

## Constraints

-   TS-only repo sources (ADR 0005).
-   UI boundaries remain enforced (ADR 0010, ADR 0019).
-   Composition root remains the only wiring place (ADR 0016).

## Consequences

### Positive

-   Workspace layout matches the Hadron/VS Code layering model.
-   Platform services can evolve independently of the app package.

### Negative / Risks

-   Large import churn across the app package.
-   Future refactors may be needed to further separate app vs platform responsibilities.

## Alternatives considered

-   Keep platform under `packages/app/src/platform` (now `apps/rankup-spa/src/platform`) and rely on lint boundaries.
-   Split only DI primitives into a separate package and keep services in app.

## Implementation plan

-   [x] Add `packages/platform` with tsconfig + package.json.
-   [x] Move platform sources into `packages/platform/src`.
-   [x] Move env + session manager implementation into platform.
-   [x] Update app imports and configuration.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/engineering/structural-change-protocol.md`
