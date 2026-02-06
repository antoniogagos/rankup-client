# Epic 009: Rankup web landing implementation + Lit Localize ID policy

## Status

-   Status: Backlog (paused until explicit resume request)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-06
-   Depends on: Epic 008

## Goal

-   Replace `apps/rankup-web` placeholder with the complete conversion landing defined in `docs/landing-page.md`.
-   Enforce explicit `msg(..., { id })` policy globally across apps/packages.
-   Keep work tracking + ADR coverage fully compliant with structural protocols.

## Invariants (must not regress)

-   OpenAPI-first (ADR 0006).
-   Mock-first (ADR 0007).
-   No UI tests (ADR 0002).
-   TS-only sources (ADR 0005 + ADR 0017).
-   Landing remains isolated in `apps/rankup-web` (ADR 0042).

---

## WP-009-01: Landing runtime architecture + structural tracking

### Goal

Codify landing runtime decisions and activate a dedicated epic for execution.

### DoD

-   [x] ADR 0057 added and ADR index updated.
-   [x] Epic 009 created and referenced from CURRENT/ROADMAP.
-   [x] AGENTS + daily log updated for structural evidence.
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-009-02: Implement full landing in apps/rankup-web

### Goal

Ship a complete marketing landing with cinematic structure and interactive sections.

### DoD

-   [x] `apps/rankup-web/index.html` upgraded with SEO metadata and JSON-LD.
-   [x] `apps/rankup-web/src/rk-web-landing.ts` implements sections 0..11 + sticky mobile CTA.
-   [x] Persistent particle canvas implemented via `apps/rankup-web/src/particle-field.ts`.
-   [x] Hero ranking mockup + live goal simulator implemented.
-   [x] CTA flow targets `/es/registro`.
-   [x] Locale toggling (`es`/`en`) implemented in landing runtime.
-   [x] `prefers-reduced-motion` handling implemented for motion fallbacks.
-   [x] `yarn workspace @rankup/web build` PASS recorded.

### Verification

-   `yarn workspace @rankup/web build`
-   `yarn validate`

---

## WP-009-03: Global msg() explicit-id guardrail + big-bang backfill

### Goal

Enforce and migrate Lit Localize IDs in all existing code.

### DoD

-   [x] ADR 0058 added and ADR index updated.
-   [x] Guardrail added in `scripts/repo-guardrails.ts` for explicit `msg()` IDs.
-   [x] Backfill codemod added (`scripts/localize-add-msg-ids.ts`).
-   [x] Existing `msg()` usages updated to include regex-compliant IDs.
-   [x] `yarn validate` PASS recorded.

### Verification

-   `node --import tsx scripts/localize-add-msg-ids.ts`
-   `yarn validate`

---

## WP-009-04: Performance/quality hardening for landing metrics

### Goal

Close Lighthouse and runtime performance targets for launch hardening.

### DoD

-   [ ] Lighthouse mobile >= 95 documented.
-   [ ] LCP < 2.0s, INP < 100ms, CLS < 0.05 evidence recorded.
-   [x] Asset/motion hotspots profiled and tuned.
-   [x] Work log includes final benchmark evidence.

### Status notes (2026-02-06)

-   Landing V2 visual/motion refactor implemented (`rk-web-landing.ts`, `particle-field.ts`, `index.html`).
-   Lighthouse evidence captured under `diagnostics/lighthouse-rankup-web-mobile.json` and `diagnostics/lighthouse-rankup-web-desktop.json`.
-   Current metrics remain below target on local WDS run (mobile perf 58; desktop perf 77); WP remains open.
-   Product decision: landing work moved to backlog (2026-02-06) until explicitly resumed.

### Verification

-   `yarn validate`
-   Manual Lighthouse run (mobile profile)
