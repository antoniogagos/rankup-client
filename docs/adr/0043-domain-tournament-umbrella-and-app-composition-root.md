# ADR 0043: Domain tournament umbrella + app-owned composition root

-   Status: Superseded (ADR 0049)
-   Date: 2026-02-02
-   Owners: Rankup maintainers
-   Scope: domain layering, composition root placement, guardrails

## Context

Rankup is tournament-centric and frontend-first. As the spec grows, we need clear domain boundaries without over‑engineering. Guidance from Apibase indicates that when ownership and reuse are not split, a single umbrella domain is preferred over many packages. In addition, platform must remain infra-only, so it must not depend on domain packages. This requires moving domain wiring (composition root + AppServices) into the app layer.

## Decision

-   Create a single domain package: `packages/domain-tournament/`.
-   Model submodules **inside** the package (e.g., matchdays, submissions, ranking, ranked) rather than separate packages.
-   Contracts live in `packages/domain-tournament/src/contracts/**` and implementations in `packages/domain-tournament/src/browser/**`.
-   Mocks and fixtures live in `packages/domain-tournament/src/mock/**` with deterministic seeds.
-   Move the composition root to the app: `apps/rankup-spa/lib/composition-root.ts`.
-   Move AppServices to the app: `apps/rankup-spa/lib/app-services.ts`.
-   Platform remains infra-only and must not depend on domain packages.
-   **No compatibility shims**: legacy paths are removed immediately (greenfield mode).

## Constraints

-   OpenAPI-first and mock-first remain mandatory.
-   UI packages must not import domain implementations (browser/mock).
-   Platform must not import domains.
-   No UI tests.

## Consequences

### Positive

-   Clear domain boundary without premature fragmentation.
-   Platform stays infra-only; dependency direction is enforced.
-   App-level composition root mirrors Apibase’s workbench bootstrapping model.

### Negative / Risks

-   Larger single domain package until ownership splits.
-   Requires coordination when submodules expand.
-   Requires guardrails to prevent accidental cross‑submodule coupling.

## Alternatives considered

-   Split into `packages/domain-*` per subdomain now (rejected: adds friction without reuse/ownership split).
-   Keep domain wiring inside platform (rejected: violates platform‑only infra rule).
-   Create a shared-kernel package now (deferred: use `packages/common` until ownership stabilizes).

## Implementation plan

-   [ ] Create `packages/domain-tournament` (contracts/browser/mock/common/tests).
-   [ ] Move `ITournamentService` contract + implementation into domain package.
-   [ ] Move composition root + AppServices into `apps/rankup-spa`.
-   [ ] Add guardrails: UI cannot import domain implementations; platform cannot import domains.
-   [ ] Update docs + work tracking + run `yarn validate`.

## Verification

-   `yarn validate`

## References

-   `docs/diagnostics/APIBASE-ALIGNMENT.md`
-   `docs/architecture/di.md`
-   `docs/architecture/api-request-flow.md`
