# Epic 007: Workspace archetype alignment (Hadron/VS Code)

## Status

-   Status: Done (Epic 007 closed; WP-007-01..07 complete)
-   Owner: Rankup maintainers
-   Last updated: 2026-01-31
-   Depends on: Epic 002 closeout (done)
-   Note (2026-01-31): ESLint migrated to flat config + lint wrapper (ADR 0026).
-   Note (2026-01-31): Lit html template formatting guardrail + autofix added (ADR 0029).
-   Note (2026-01-31): API request flow standardized (ADR 0028).
-   Note (2026-01-31): Lit css closing backtick alignment enforced; lint wrapper runs Prettier on non-TS files (ADR 0024, ADR 0026).
-   Note (2026-01-31): Validation builds workspace deps for project references (ADR 0030).
-   Note (2026-01-31): UI tournament pages now consume ITournamentService (no IRankupApiClient injection).
-   Note (2026-01-31): Legacy app data-service retired (ADR 0031).
-   Note (2026-01-31): API facade/network request service decision deferred (ADR 0032).

## Goal

Align the workspace layout to the Hadron/VS Code archetype:

-   Introduce a base layer (`@rankup/base`) with common/browser primitives.
-   Remove unused global event bus patterns.
-   Prepare for future extraction of `platform` into its own package.
-   Formalize the API request flow (UI -> domain -> API client).

## Non-goals

-   Full platform extraction in one step.
-   Feature work unrelated to layering.
-   UI tests (forbidden by ADR 0002).

## Invariants (must not regress)

-   OpenAPI-first (ADR 0006).
-   Mock-first (ADR 0007).
-   UI cannot import implementations (ADR 0010).
-   Composition root is the only wiring place (ADR 0016).
-   TS-only repo sources (ADR 0005).

---

## Work packets overview

| Order | WP        | Title                                                        | Depends on | Blocking | Hotspots               |
| ----: | --------- | ------------------------------------------------------------ | ---------- | -------- | ---------------------- |
|     1 | WP-007-01 | @rankup/base + event/disposable migration + remove IEventBus | none       | YES      | workspace + app wiring |
|     2 | WP-007-02 | Extract platform into `packages/platform`                    | WP-007-01  | NO       | platform imports       |
|     3 | WP-007-03 | Adopt base helpers in UI/controllers where relevant          | WP-007-01  | NO       | UI components          |
|     4 | WP-007-04 | API request flow formalization (docs + ADR)                  | WP-007-02  | NO       | docs + catalog         |
|     5 | WP-007-05 | Migrate UI off `IRankupApiClient`                            | WP-007-04  | NO       | UI pages/elements      |
|     6 | WP-007-06 | Retire legacy `DataService`                                  | WP-007-05  | NO       | app/lib                |
|     7 | WP-007-07 | Decide on API facade / network request service               | WP-007-04  | NO       | platform services      |

---

## WP-007-01: @rankup/base + event/disposable migration + remove IEventBus

### Goal

-   Create `packages/base` with `common/` and `browser/` helpers.
-   Relocate event/disposable modules into base.
-   Remove `IEventBus` service and UI injection.

### DoR

-   [x] Epic 002 closed with verification.

### DoD

-   [x] `@rankup/base` workspace exists with `common/` + `browser/` folders.
-   [x] Root-level event/disposable helpers moved into base.
-   [x] `IEventBus` removed from platform wiring, service catalog, and UI.
-   [x] ADR 0025 added and ADR 0022 updated.
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-007-02: Extract platform into `packages/platform`

### Goal

Move `packages/app/src/platform/**` into a dedicated workspace package while preserving boundaries.

### DoD

-   [x] `packages/platform` exists with app updated to import from it.
-   [x] Lint/guardrails updated to reflect new boundaries.
-   [x] `yarn validate` PASS recorded.

---

## WP-007-03: Adopt base helpers incrementally

### Goal

Migrate consumers to use `@rankup/base` helpers where appropriate (events, disposables, DOM listeners).

### DoD

-   [x] Targeted consumers migrated without UI boundary violations.
-   [x] `yarn validate` PASS recorded (after workspace typecheck step).

---

## WP-007-04: API request flow formalization (docs + ADR)

### Goal

Define the normative API request flow and align documentation with Hadron/VS Code patterns.

### DoD

-   [x] `docs/architecture/api-request-flow.md` added.
-   [x] ADR 0028 added and ADR index updated.
-   [x] Service catalog updated for API client consumers.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

---

## WP-007-05: Migrate UI off `IRankupApiClient`

### Goal

Move UI access to API data through domain services/controllers only.

### DoD

-   [x] UI no longer injects `IRankupApiClient` directly.
-   [x] `rg -n "@service\(IRankupApiClient" packages/app` returns 0.
    -   UI packages = `packages/app/pages/**`, `packages/app/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
-   [x] Domain services expanded to cover tournament pages (matchday, ranking, header/footer).
-   [x] `yarn validate` PASS recorded.

---

## WP-007-06: Retire legacy `DataService`

### Goal

Remove the legacy `packages/app/lib/data-service/*` path after migrations complete.

### DoD

-   [x] `packages/app/lib/data-service/*` removed or archived per ADR.
-   [x] `rg -n "data-service" packages/app` returns 0.
    -   UI packages = `packages/app/pages/**`, `packages/app/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
-   [x] `yarn validate` PASS recorded.

---

## WP-007-07: Decide on API facade / network request service

### Goal

Determine whether a shared API facade or network request service is required for cross-cutting behavior.

### DoD

-   [x] ADR updated with the decision (add/skip facade and/or network request service).
-   [x] Service catalog updated if new services are introduced.
-   [x] Guardrails or migration plan documented if needed.
-   [x] `yarn validate` PASS recorded.
