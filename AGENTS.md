## Start here (mandatory for every agent)

Rankup is designed to be developed by multiple agents with zero external context.
This repo has **non-negotiable** invariants enforced by docs + guardrails. If you skip this section, you will break the architecture.

### 0) Resume procedure (do this in order)

1. Read `docs/work/CURRENT.md` (active epic + status).
2. Open the active epic file referenced there under `docs/work/epics/` and read it fully.
3. Read the latest entry in `docs/work/log/` (how we got here + what failed/passed).
4. Run `yarn validate` locally **before** starting structural work.
5. Only then: pick a _single_ checklist item from the active epic and implement it in a small PR.

### 1) Non-negotiable invariants (do not violate)

-   **OpenAPI-first**: `packages/api/openapi.yaml` is the single source of truth (OpenAPI 3.1.2). Any API change starts there (ADR 0006, ADR 0045).
-   **OpenAPI change protocol**: follow `docs/engineering/openapi-change-protocol.md` for any spec change.
-   **Gateway mapping discipline**: forbid `...api*` spreads and `as Domain.*` assertions in gateways; use mapping helpers.
-   **OpenAPI change protocol**: follow `docs/engineering/openapi-change-protocol.md` for any spec change.
-   **Gateway mapping discipline**: forbid `...api*` spreads and `as Domain.*` assertions in gateways; use mapping helpers.
-   **Mock-first**: app must run locally without backend; mocks are typed and kept in sync (ADR 0007).
-   **No UI tests**: do not add UI/component tests (ADR 0002).
-   **UI cannot import implementations**:
    -   UI (pages/elements) and samba must NOT import runtime API implementations (ADR 0010).
    -   UI must NOT import `@rankup/api` (even type-only); use domain contracts (ADR 0048).
    -   UI must NOT import `platform/**/browser/*` services directly (except `platform/instantiation/browser/**` helpers; ADR 0019).
-   **API access flow**: UI must not inject SDK clients or gateways directly; use domain services or AppServices (ADR 0028, ADR 0048). Legacy usage was tracked in Epic 007; no compatibility shims allowed.
-   **Composition root is the only wiring place**:
    -   mock vs real selection happens ONLY in the composition root (ADR 0016).
    -   no service locator patterns in UI.
-   **Platform is infra-only**:
    -   platform must not import product SDKs (`@rankup/api`, `@rankup/api-mock`); API clients live in app services (ADR 0046).
-   **SDK boundary**: `@rankup/api` is allowed only in `apps/rankup-spa/services/api/**`; domain packages must not import it (ADR 0048).
-   **SDK boundary**: `@rankup/api` is allowed only in `apps/rankup-spa/services/api/**`; domain packages must not import it (ADR 0048).
-   **No legacy/compatibility shims**: remove/replace old paths (including stale folders) instead of keeping transitional code while greenfield (ADR 0013).
-   **TS-only repo sources**: no tracked `.js/.mjs/.cjs` in sources/configs unless explicitly allowed by ADR (ADR 0005 + ADR 0017).
-   **Lit css template formatting**: content inside ` css\`` must align with the  `css\``line, closing backticks must align with the `css\``line, and`static styles` arrays must close as `` `]`` (no trailing comma/newline; ADR 0023 + ADR 0024).
-   **Lit html template formatting**: content inside ` html\`` must indent one tab beyond the  `html\``line and the closing backtick must align with the`html\`` line (ADR 0029).
-   **Tabs only**: indent with tabs, tab size 4 (EditorConfig/Prettier/VS Code; ADR 0024).
-   **Lit Localize IDs**: every `msg()` call MUST include explicit `id` and the id MUST match `^[a-z0-9]+(\\.[a-z0-9]+)*$` (ADR 0058).
-   **Work tracking is inviolable**:
    -   Structural changes MUST update: `AGENTS.md`, `docs/work/CURRENT.md`, the active epic file, and today’s work log entry (ADR 0012 + ADR 0015).

### 2) What counts as a structural change

Any change affecting: architecture, layering, DI/services, build/tooling, packaging, OpenAPI integration, auth/session, cross-workspace boundaries, guardrails/CI.
If unsure: treat it as structural and follow the protocol.

### 3) Structural change protocol (required)

Follow `docs/engineering/structural-change-protocol.md`:

-   Add/update the ADR (if architecture/tooling/boundaries are impacted).
-   Update ADR index `docs/adr/README.md`.
-   Update `docs/work/CURRENT.md` + active epic + daily log.
-   Verification: run `yarn validate` and record PASS/FAIL in the daily log.

### 4) Work log verification format (mandatory)

Every daily log entry under `docs/work/log/YYYY-MM-DD.md` MUST include:

```md
## Verification

-   `yarn validate` -> PASS|FAIL
```

If FAIL, include a short “Notes:” line explaining the failure cause and environment (Node version, etc).

### 5) If you’re blocked

-   Do NOT invent new architecture.
-   Record the block explicitly:

    -   add a note to `docs/adr/PENDING.md` if it’s a decision blocker
    -   add details to today’s work log (`docs/work/log/YYYY-MM-DD.md`)

-   Prefer a tiny PR that only improves observability/guardrails/docs over a risky partial refactor.

## Start here (mandatory for every agent)

Rankup is designed to be developed by multiple agents with zero external context.
This repo has **non-negotiable** invariants enforced by docs + guardrails. If you skip this section, you will break the architecture.

### 0) Resume procedure (do this in order)

1. Read `docs/work/CURRENT.md` (active epic + status).
2. Open the active epic file referenced there under `docs/work/epics/` and read it fully.
3. Read the latest entry in `docs/work/log/` (how we got here + what failed/passed).
4. Run `yarn validate` locally **before** starting structural work.
5. Only then: pick a _single_ checklist item from the active epic and implement it in a small PR.

### 1) Non-negotiable invariants (do not violate)

-   **OpenAPI-first**: `packages/api/openapi.yaml` is the single source of truth (OpenAPI 3.1.2). Any API change starts there (ADR 0006, ADR 0045).
-   **Mock-first**: app must run locally without backend; mocks are typed and kept in sync (ADR 0007).
-   **No UI tests**: do not add UI/component tests (ADR 0002).
-   **UI cannot import implementations**:
    -   UI (pages/elements) and samba must NOT import runtime API implementations (ADR 0010).
    -   UI must NOT import `@rankup/api` (even type-only); use domain contracts (ADR 0048).
    -   UI must NOT import `platform/**/browser/*` services directly (except `platform/instantiation/browser/**` helpers; ADR 0019).
-   **API access flow**: UI must not inject SDK clients or gateways directly; use domain services or AppServices (ADR 0028, ADR 0048). Legacy usage was tracked in Epic 007; no compatibility shims allowed.
-   **Composition root is the only wiring place**:
    -   mock vs real selection happens ONLY in the composition root (ADR 0016).
    -   no service locator patterns in UI.
-   **Platform is infra-only**:
    -   platform must not import product SDKs (`@rankup/api`, `@rankup/api-mock`); API clients live in app services (ADR 0046).
-   **No legacy/compatibility shims**: remove/replace old paths (including stale folders) instead of keeping transitional code while greenfield (ADR 0013).
-   **TS-only repo sources**: no tracked `.js/.mjs/.cjs` in sources/configs unless explicitly allowed by ADR (ADR 0005 + ADR 0017).
-   **Lit css template formatting**: content inside ` css\`` must align with the  `css\``line, closing backticks must align with the `css\``line, and`static styles` arrays must close as `` `]`` (no trailing comma/newline; ADR 0023 + ADR 0024).
-   **Lit html template formatting**: content inside ` html\`` must indent one tab beyond the  `html\``line and the closing backtick must align with the`html\`` line (ADR 0029).
-   **Tabs only**: indent with tabs, tab size 4 (EditorConfig/Prettier/VS Code; ADR 0024).
-   **Lit Localize IDs**: every `msg()` call MUST include explicit `id` and the id MUST match `^[a-z0-9]+(\\.[a-z0-9]+)*$` (ADR 0058).
-   **Work tracking is inviolable**:
    -   Structural changes MUST update: `AGENTS.md`, `docs/work/CURRENT.md`, the active epic file, and today’s work log entry (ADR 0012 + ADR 0015).

### 2) What counts as a structural change

Any change affecting: architecture, layering, DI/services, build/tooling, packaging, OpenAPI integration, auth/session, cross-workspace boundaries, guardrails/CI.
If unsure: treat it as structural and follow the protocol.

### 3) Structural change protocol (required)

Follow `docs/engineering/structural-change-protocol.md`:

-   Add/update the ADR (if architecture/tooling/boundaries are impacted).
-   Update ADR index `docs/adr/README.md`.
-   Update `docs/work/CURRENT.md` + active epic + daily log.
-   Verification: run `yarn validate` and record PASS/FAIL in the daily log.

### 4) Work log verification format (mandatory)

Every daily log entry under `docs/work/log/YYYY-MM-DD.md` MUST include:

```md
## Verification

-   `yarn validate` -> PASS|FAIL
```

If FAIL, include a short “Notes:” line explaining the failure cause and environment (Node version, etc).

### 5) If you’re blocked

-   Do NOT invent new architecture.
-   Record the block explicitly:

    -   add a note to `docs/adr/PENDING.md` if it’s a decision blocker
    -   add details to today’s work log (`docs/work/log/YYYY-MM-DD.md`)

-   Prefer a tiny PR that only improves observability/guardrails/docs over a risky partial refactor.

## Mandatory entry procedure (inviolable)

Before touching code, you MUST:

1. Read `docs/work/START-HERE.md`
2. Read `docs/work/CURRENT.md`
3. Read the active epic referenced by CURRENT
4. Read the latest daily log in `docs/work/log/`
5. Run: `yarn validate`

If you cannot run `yarn validate`, STOP and record the failure in today’s log.
Do not begin new structural work with a broken baseline.

# Rankup Client - Agent Guide

## Summary

Rankup is a tournament-centric, no-money competitive game built around sports events. Users create or join tournaments (public/private) and compete against other users within that tournament only. A tournament selects a game mode (rules + UI flow) and a sport (football now; others planned).
In the current ScorePrediction mode, users predict match outcomes/scores for a matchday before lock time. After matches resolve, the tournament computes points and updates rankings and tie-breakers according to the tournament's scoring system. ScorePrediction uses the final match score after extra time (penalty shootouts excluded) by default, with advanced ruleset configuration to override the result scope where applicable.
Rankup is explicitly not a real-money betting product. It is a social, leaderboard-driven game intended to support multiple game modes (including a planned FUT-Draft-style Draft mode) and multiple sports over time, while keeping a stable tournament model and admin role.
Last reviewed: 2026-02-03 (lint limited to TS files; repo scripts run via node --import tsx; api-mock uses project refs; WDS 0.4.6 + core 0.7.5; app moduleResolution=bundler; tslib runtime dep; samba styles rewrite; WDS base config lives at repo root and apps extend it via `createWebDevServerConfig(appRoot)` using `.mjs` configs (TS-only exception); dev serves TS directly via WDS+esbuild with node-resolve/commonjs/json, __APP_ENV__ injection, outside-root depth prefixing + `.ts`/`.json` MIME overrides, nodeResolve.rootDir/jail + outside-root depth guard, and optional --compile-css; WDS start scripts use `wds --watch`, with wireit available in app devDependencies; root build uses tsc -b + rollup + clean; app validate uses `tsc --noEmit`; root validate cleans after app validate to preserve project reference outputs; useDefineForClassFields=false in app/samba; api-mock module metadata; Epic 006 docs/skill added; mock core registry extracted; api-mock server leakage guardrail added; fallback OpenAPI stack validated (swagger-parser + ajv + openapi-sampler); openapi-backend removed; server skeleton wired to core handlers with openapi-contract; core store now provides stateful CRUD; scenario engine implemented (delay/status/auth/reset); scenario smoke script added; ISessionManager registered as service for @service; import formatting guardrail (single-line imports, no blank separators); VS Code-grade event/disposable helpers moved to @rankup/base; platform extracted into @rankup/platform; base helpers adopted in rk-auth-wall and rk-drawer; validate builds workspace deps before app typecheck; UI tourney pages now consume ITourneyCoreService/ITourneyMatchdaysService/ITourneyRankingService (no SDK injection); legacy app data-service retired; API facade/network request service decision deferred; guardrail forbids UI fetch; guardrail forbids UI @rankup/api-mock imports; @rankup/api-mock allowlisted in composition root; guardrail forbids @rankup/api outside services/api and in domain; domain DTOs + tourney gateways added; mock selection moved to composition root; package exports map .js subpaths to TS sources (no dist runtime); app split into apps/rankup-spa + apps/rankup-web; app-level `packages/rankup` now hosts `domains/tournaments` with Hadron-style capability split (shared/core/matchdays/members/codes/invites) plus `domains/scoring/ranking` for rankings, plus AppServices + composition root in the SPA; Rankup Engine scaffolding now includes shared/algorithms/registry/runtime plus placeholder domains for engagement/verified/ranked/achievements/media/trustSafety/promotions/creators/admin; accounts domain now implements auth/me/users/social with gateways + AppServices; submissions domain now implements scorePrediction matchday submissions with gateways + AppServices; sports domain now implements catalog/schedule services with gateways + AppServices; rules domain now implements game modes + rulesets services with gateways + AppServices; Problem Details catalog expanded for 413/415 and spectral rules aligned to application/problem+json + text/event-stream; InstantiationService now duck-types SyncDescriptor to avoid cross-module instanceof mismatches during dev-server service resolution; SPA bootstrap now lives in apps/rankup-spa/main.ts and rk-app/rk-unauthenticated-app are view-only; rollup HTML inputs now use apps/**/*.html; rollup tsconfig excludes scripts/server/config and pins types to DOM-only; @rankup/api guardrail regex no longer trips on @rankup/api-mock; rk-app now receives appServices/sessionManager via host properties and main disposes session listeners; public app context removed in favor of ISessionManager injection + redirect helper; platform env now relies on __APP_ENV__ injection (no json.example imports), and .tsbuildinfo artifacts are ignored; tourney domain contracts now cover previews, matchday navigation, ranking windows, membership, invitation codes, and direct invites aligned to OpenAPI).
Maintenance note (2026-02-03): Removed the legacy empty `packages/app` folder; the app lives in `apps/rankup-spa`.
Maintenance note (2026-02-03): Added the Rankup Engine domain partitioning proposal under `docs/architecture/rankup-engine-domain-partitioning.md`.
Maintenance note (2026-02-03): Renamed `packages/rankup/src/domains/tourney` to `packages/rankup/src/domains/tournaments` (ADR 0052).
Maintenance note (2026-02-04): Heads-Up is modeled as a tournament format (`formatId=headsUp`), not a game mode.
Maintenance note (2026-02-04): Removed placeholder tourney capabilities now owned by engagement/submissions/scoring/algorithms (chat/stats/recaps/updates/submissions/results/analysis).
Maintenance note (2026-02-04): Removed empty root-level tourney folders not in the partitioning proposal (`common/`, `contracts/`, `models/`, `services/`, `mock/`, `tests/`, `validation/`).
Maintenance note (2026-02-04): Split engagement recaps/updates into dedicated capabilities with shared models and updated app wiring.
Maintenance note (2026-02-04): Implemented verified domain (hub/events) with contracts, gateways, services, and api-mock parity.
Maintenance note (2026-02-04): Implemented ranked domain (seasons/leaderboards) with contracts, gateways, services, and api-mock parity.
Maintenance note (2026-02-04): Implemented achievements domain (catalog/grants) with contracts, gateways, services, and api-mock parity.
Maintenance note (2026-02-04): Implemented media domain (uploads/assets) with contracts, gateways, services, and api-mock parity.
Maintenance note (2026-02-04): Implemented trustSafety domain (policies/reports/enforcement/appeals) with contracts, gateways, services, and api-mock parity.
Maintenance note (2026-02-04): Implemented promotions domain (campaigns/rewards) with contracts, gateways, services, and api-mock parity.
Maintenance note (2026-02-04): Implemented creators domain (directory/catalog) with contracts, gateways, services, and api-mock parity.
Maintenance note (2026-02-05): Prepared ADR 0056 operation coverage gate prerequisites (default Problem response policy, operations manifest generation, allowlist spec alignment).
Maintenance note (2026-02-05): Implemented ADR 0056 operation coverage gates (mock coverage, gateway ownership, schema validation, HTTP fidelity) with waivers seeding and validate wiring.
Maintenance note (2026-02-06): Implemented the full conversion-focused landing in `apps/rankup-web` (preloader + sections + interactive ranking/live simulator + particle canvas + sticky CTA + SEO metadata) and aligned CTA routing to `/es/registro` (ADR 0057).
Maintenance note (2026-02-06): Enforced global Lit Localize `msg()` explicit-id policy with repository guardrail and codemod backfill for existing usage (ADR 0058).
Maintenance note (2026-02-06): WP-008-28 reduced ADR-0056 waivers for tournaments/submissions (fixtures + explicit gateway operationOwners), lowered `WAIVERS_MAX_TOTAL` to `700`, and seeded scoped `schemaValidationFlaky` waivers for endpoints still returning non contract-valid mock payloads.
Maintenance note (2026-02-06): Completed the WP-008-28 schema-flaky follow-up by aligning OpenAPI discriminator/allOf schemas for tournaments/results/submissions mocks and removing 12 targeted `schemaValidationFlaky` waivers after `api-mock` + `api-http` schema validation passed.
Maintenance note (2026-02-06): Continued ADR-0056 burn-down by adding contract-valid core handlers for `tournaments.core` + `tournaments.lifecycle` operations (`getTournament`, `getTournamentRules`, `listDiscoverableTournaments`, `updateTournament`, `archiveTournament`, `deleteTournament`, `lockTournament`, `transferTournamentOwnership`, `unarchiveTournament`, `unlockTournament`) and removing 10 matching `missingMockHandler` waivers.
Maintenance note (2026-02-06): Continued ADR-0056 burn-down for `tournaments.submissions|rankings|results|live` by adding contract-valid core handlers + OpenAPI contract context mapping, adding HTTP operationId aliases (including SSE `streamTournamentLive`) in the SPA API client, and removing 13 `missingMockHandler` + 9 `httpFidelityMissing` waivers (waiver total now 630).
Maintenance note (2026-02-06): Continued ADR-0056 cross-slice burn-down by adding fixtures for remaining non-admin operations, clearing residual `missingMockHandler` + `missingFixture` + `httpFidelityMissing` waivers, and reducing waivers to 81 (`missingOwner=35`, `schemaValidationFlaky=46`).

## Truth hierarchy

1. ADRs in `docs/adr/` define non-negotiable decisions and constraints.
2. `packages/api/openapi.yaml` is the single source of truth for the HTTP API contract.
3. `docs/scope/` defines intended scope and planned features.
4. `docs/state/` is an observed snapshot of the current codebase (do not treat it as the plan).
   If anything conflicts, update docs/ADR to restore consistency.

## Non-negotiable constraints

-   No real-money features.
-   Frontend-first development: local dev must be possible without backend using mocks.
-   No UI tests (algorithm-only tests where strictly needed).
-   TS-only sources: no versioned `.js/.mjs/.cjs` files in repo sources or tooling configs (exceptions require an ADR).
-   Architectural boundaries must be enforceable via lint/build once toolchain is stable.

## Repository map (current)

-   `apps/rankup-spa`: application shell, routing, composition root.
-   `apps/rankup-web`: landing/marketing site.
-   `packages/base`: VS Code-grade base primitives (events, disposables, browser helpers).
-   `packages/rankup`: app-level domain umbrella (e.g., `src/domains/tournaments`).
-   `packages/platform`: platform services and DI primitives (infra-only, no domain wiring).
-   `packages/samba`: reusable UI components / design system.
-   `packages/common`: shared utilities/types.
-   `packages/api/docs`: API design docs + Problem Details error catalog (`errors/README.md`).
-   `docs/adr`: decision records.
-   `docs/scope`: intended scope, decision log, open questions.
-   `docs/state`: observed reality snapshots.
-   `docs/quality`: verifiable quality gates.
-   `rankup-client.code-workspace`: optional VS Code multi-root workspace config.

## Start here (as an agent)

1. Read `docs/work/CURRENT.md`
2. Read `docs/scope/README.md`
3. Read `docs/architecture/services.md`
4. Read `docs/architecture/service-catalog.md`
5. Read `docs/state/` (tooling/runtime/scope-observed/risks)
6. Read latest ADRs in `docs/adr/`
7. Run `yarn validate`

## Structural work guardrail

Any structural change must update both `AGENTS.md` and `docs/work/CURRENT.md` (enforced by `repo:guardrails`).

## Codex skills (repo-native)

This repo ships Codex skills under `.codex/skills/*/SKILL.md`. Read the index at `.codex/skills/README.md` and pick a skill before starting a WP.
All `SKILL.md` files MUST include YAML frontmatter with `name` and `description`, and `name` must match the directory name exactly.

Core workflow skills:

-   rankup-openapi-first: OpenAPI.yaml is source of truth; regenerate @rankup/api; keep api-mock parity.
-   rankup-mock-first: mock-first implementation and deterministic fixtures.
-   rankup-structural-change: ADR + structural-change protocol.

Epic 002 skills:

-   rankup-epic-002: WPs + invariants for service layering + DI.
-   rankup-di-primitives: createDecorator/ServiceCollection/InstantiationService.
-   rankup-composition-root: single implementation selector.
-   rankup-ui-appservices-bridge: typed AppServices (no service locator).
-   rankup-domain-tourney-service: ITourney capability services pattern (core/matchdays/members/codes/invites; rankings live in scoring).
-   rankup-home-vertical-slice: migrate Home to ITourneyCoreService.
-   rankup-eslint-import-guardrails: enforce layering late.
-   rankup-work-logging: record yarn validate evidence and status updates.

## Agent rules (must not violate)

### UI boundaries

UI code (`apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`) MUST NOT:

-   import `packages/platform/src/**/browser/**` (except `packages/platform/src/instantiation/browser/**`)
-   import `packages/platform/src/instantiation/common/**`
-   import `@rankup/platform/environment/browser/env.js`
-   import `@rankup/domain-*/browser/**` or `@rankup/domain-*/mock/**`
-   import `@rankup/api` (even type-only)
-   import `@rankup/api-mock` or any API runtime implementation
-   call `fetch()` directly
    UI MAY import service identifiers from `@rankup/domain-*/contracts/**` and `packages/platform/src/**/common/**` (including `platform/api/common`).
    UI decorator fields must keep the decorator and field on the same line (ADR 0020).
-   do not inject SDK clients or gateways in UI; use domain services/AppServices instead (ADR 0028, ADR 0048)

### Structural change protocol

Any structural change MUST:

-   have an ADR (or update one)
-   update ADR index (`docs/adr/README.md`)
-   update work tracking: CURRENT + epic + daily log
-   pass `yarn validate`

### Guardrails are monotonic

Do not weaken guardrails unless there is an ADR explaining why.

### No UI tests

No DOM/UI test suites are allowed (ADR 0002). Only pure algorithm tests are allowed.
