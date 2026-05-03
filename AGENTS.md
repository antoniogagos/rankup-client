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

## Commands you will use often

-   `yarn repo:agent-entry` (preflight checklist aligned to the mandatory entry procedure)
-   `yarn validate` (full guardrails + OpenAPI checks + typecheck; cleans after success)
-   `yarn repo:work-log` (summarize work tracking state)
-   `yarn repo:work-log-verification` (enforce work-log verification format)
-   `yarn openapi:verify` (OpenAPI lint + generated artifacts checks)
-   `yarn repo:openapi-sot-drift` (blocking anti-drift guardrail for OpenAPI-derived match status/type usage)
-   `yarn api-mock:coverage` (mock handler coverage gate)
-   `yarn api-mock:schema-validate` (mock payload contract validation)
-   `yarn api-http:schema-validate` (API HTTP responses schema validation)
-   `yarn gateways:ownership` (gateway operation ownership gate)
-   `yarn waivers:check` (operation waiver budget gate)
-   `yarn repo:ratchet` (guardrail for generated/forbidden artifacts)
-   `yarn clean` (remove generated artifacts when `repo:ratchet` fails)
-   `yarn start:spa` (run the Rankup SPA dev server)
-   `yarn start:web` (run the Rankup marketing site dev server)
-   `yarn workspace @rankup/web clean` (clean web build outputs)

# Rankup Client - Agent Guide

## Summary

Rankup is a tournament-centric, no-money competitive game built around sports events. Users create or join tournaments (public/private) and compete against other users within that tournament only. A tournament selects a game mode (rules + UI flow) and a sport (football now; others planned).
In the current ScorePrediction mode, users predict match outcomes/scores for a matchday before lock time. After matches resolve, the tournament computes points and updates rankings and tie-breakers according to the tournament's scoring system. ScorePrediction uses the final match score after extra time (penalty shootouts excluded) by default, with advanced ruleset configuration to override the result scope where applicable.
Rankup is explicitly not a real-money betting product. It is a social, leaderboard-driven game intended to support multiple game modes (including a planned FUT-Draft-style Draft mode) and multiple sports over time, while keeping a stable tournament model and admin role.
Last reviewed: 2026-02-03 (lint limited to TS files; repo scripts run via node --import tsx; api-mock uses project refs; WDS 0.4.6 + core 0.7.5; app moduleResolution=bundler; tslib runtime dep; samba styles rewrite; WDS base config lives at repo root and apps extend it via `createWebDevServerConfig(appRoot)` using `.mjs` configs (TS-only exception); dev serves TS directly via WDS+esbuild with node-resolve/commonjs/json, __APP_ENV__ injection, outside-root depth prefixing + `.ts`/`.json` MIME overrides, nodeResolve.rootDir/jail + outside-root depth guard, and optional --compile-css; WDS start scripts use `wds --watch`, with wireit available in app devDependencies; root build uses tsc -b + rollup + clean; app validate uses `tsc --noEmit`; root validate cleans after app validate to preserve project reference outputs; useDefineForClassFields=false in app/samba; api-mock module metadata; Epic 006 docs/skill added; mock core registry extracted; api-mock server leakage guardrail added; fallback OpenAPI stack validated (swagger-parser + ajv + openapi-sampler); openapi-backend removed; server skeleton wired to core handlers with openapi-contract; core store now provides stateful CRUD; scenario engine implemented (delay/status/auth/reset); scenario smoke script added; ISessionManager registered as service for @service; import formatting guardrail (single-line imports, no blank separators); VS Code-grade event/disposable helpers moved to @rankup/base; platform extracted into @rankup/platform; base helpers adopted in rk-auth-wall and rk-drawer; validate builds workspace deps before app typecheck; UI tournament pages now consume ITournamentCoreService/ITournamentMatchdaysService/ITournamentRankingService (no SDK injection); legacy app data-service retired; API facade/network request service decision deferred; guardrail forbids UI fetch; guardrail forbids UI @rankup/api-mock imports; @rankup/api-mock allowlisted in composition root; guardrail forbids @rankup/api outside services/api and in domain; domain DTOs + tournament gateways added; mock selection moved to composition root; package exports map .js subpaths to TS sources (no dist runtime); app split into apps/rankup-spa + apps/rankup-web; app-level `packages/rankup` now hosts `domains/tournaments` with Hadron-style capability split (shared/core/matchdays/members/codes/invites) plus `domains/scoring/ranking` for rankings, plus AppServices + composition root in the SPA; Rankup Engine scaffolding now includes shared/algorithms/registry/runtime plus placeholder domains for engagement/verified/ranked/achievements/media/trustSafety/promotions/creators/admin; accounts domain now implements auth/me/users/social with gateways + AppServices; submissions domain now implements scorePrediction matchday submissions with gateways + AppServices; sports domain now implements catalog/schedule services with gateways + AppServices; rules domain now implements game modes + rulesets services with gateways + AppServices; Problem Details catalog expanded for 413/415 and spectral rules aligned to application/problem+json + text/event-stream; InstantiationService now duck-types SyncDescriptor to avoid cross-module instanceof mismatches during dev-server service resolution; SPA bootstrap now lives in apps/rankup-spa/main.ts and rk-app/rk-unauthenticated-app are view-only; rollup HTML inputs now use apps/**/*.html; rollup tsconfig excludes scripts/server/config and pins types to DOM-only; @rankup/api guardrail regex no longer trips on @rankup/api-mock; rk-app now receives appServices/sessionManager via host properties and main disposes session listeners; public app context removed in favor of ISessionManager injection + redirect helper; platform env now relies on __APP_ENV__ injection (no json.example imports), and .tsbuildinfo artifacts are ignored; tournament domain contracts now cover previews, matchday navigation, ranking windows, membership, invitation codes, and direct invites aligned to OpenAPI).
Maintenance note (2026-02-03): Removed the legacy empty `packages/app` folder; the app lives in `apps/rankup-spa`.
Maintenance note (2026-02-03): Added the Rankup Engine domain partitioning proposal under `docs/architecture/rankup-engine-domain-partitioning.md`.
Maintenance note (2026-02-03): Renamed `packages/rankup/src/domains/tournament` to `packages/rankup/src/domains/tournaments` (ADR 0052).
Maintenance note (2026-02-04): Heads-Up is modeled as a tournament format (`formatId=headsUp`), not a game mode.
Maintenance note (2026-02-04): Removed placeholder tournament capabilities now owned by engagement/submissions/scoring/algorithms (chat/stats/recaps/updates/submissions/results/analysis).
Maintenance note (2026-02-04): Removed empty root-level tournament folders not in the partitioning proposal (`common/`, `contracts/`, `models/`, `services/`, `mock/`, `tests/`, `validation/`).
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
Maintenance note (2026-02-06): Epic 010 is now the active priority lane for Rankup Engine Baseline v1 (runtime ports/use-cases, deterministic algorithms, hardened idempotency+ETag semantics, lifecycle evaluator, and formal parity gates).
Maintenance note (2026-02-06): Epic 010 baseline core now includes executable `registry/algorithms/runtime` modules, deterministic `engine:test`, parity baseline gating via `diagnostics/parity-baseline-operations.json`, and ADR-0056 ratchet set to `WAIVERS_MAX_TOTAL=0` with an empty waivers file.
Maintenance note (2026-02-06): Completed Epic 010 residual WP-010-08b/09 by enforcing staff `cancelled` lifecycle override in runtime (blocking joins/submissions), integrating api-mock tournaments core/results/submissions/rankings/live handlers with runtime-backed state, and keeping `yarn validate` green without waivers.
Maintenance note (2026-02-06): Post-baseline WP-010-F1 expanded parity baseline operations (`listCompetitions`, `listMyDuels`, `createDuel`, `createDuelRematch`) and corrected OpenAPI `CreateDuelRequest` allOf validation behavior to keep parity gates contract-valid without waivers.
Maintenance note (2026-02-06): Post-baseline WP-010-F2 expanded parity baseline operations (`getUserPublicProfile`, `oauthAuthorize`, `oauthTokenExchange`), added explicit gateway ownership mappings, and hardened HTTP operationId OAuth alias/query serialization so `api-http` parity stays contract-valid.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-01` by persisting deterministic 4xx idempotency outcomes (not only 2xx) and replaying canonical Problem responses on same-key retries for runtime join/upsert use-cases.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-02` by wiring `X-Idempotency-Key` end-to-end for `clearMyMatchdaySubmission` (HTTP client header forwarding, mock handler context propagation, runtime clear-use-case idempotency persistence/replay, and deterministic engine coverage).
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-03` by adding formal response-header parity enforcement in schema/http gates and by supporting handler-level response headers in the OpenAPI mock server runtime path (including propagated `ETag`/`Location` where applicable).
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-18` by standardizing engine tests on Vitest (`engine:test`), adding engine test discipline guardrails (`no node:test/node:assert` and `no .only/.skip`), and introducing the `rankup-engine-testing-vitest` Codex skill.
Maintenance note (2026-02-06): Added unified P0 test lane on top of AC-010-F3-18 (`yarn test:p0`) with workspace `@rankup/testkit`, deterministic mapper/contract/smoke/streaming suites, dedicated P0 guardrail script (`scripts/test-guardrails-p0.ts`), and CI gate workflow (`.github/workflows/test-p0.yml`).
Maintenance note (2026-02-06): Stabilized the Vitest split after P0 migration by fixing moved `packages/rankup/test/**` contract/smoke import wiring, hardening smoke service resolution through composition-root service-id lookup, and scoping `engine:test` to `packages/rankup/test/engine*.test.ts` (P0 lane remains `yarn test:p0`).
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-05` by hardening `JoinTournamentUseCase` gating (including `finished`) and aligning join conflict codes to explicit taxonomy (`tournamentArchived`, `tournamentCancelled`, `joinClosed`, `tournamentFull`, `tournamentLocked`) with deterministic engine-test coverage.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-06` by expanding parity baseline operations with `joinTournament` + `joinTournamentByInvitationCode`, wiring runtime-backed join handlers/context mapping in `@rankup/api-mock`, and adding join fixtures + HTTP idempotency-header parity support.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-07` by adding explicit `penalty_shootout` scoring coverage under `scorePrediction` defaults (`resultScope=extra_time`, penalty shootout goals excluded from scoring) in both direct algorithm checks and runtime ranking tests.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-08` by adding deterministic kickoff/time lock tests (before/at kickoff runtime behavior plus `kickoffWithGrace` boundary checks) to enforce reproducible lock outcomes beyond static `lockState`.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-09` by adding an adversarial concurrent join race scenario that forces overlapping `membershipRepo.add` calls and verifies single-membership + single-event outcomes for the same user/tournament key.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-10` by adding provider/canonical drift tests in engine runtime coverage (unknown canonical match rejection with no snapshot mutation, plus independent processing of identical score payloads across distinct canonical match IDs).
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-11` by publishing the baseline per-operation Problem Details catalog (`operationId -> status + Problem.code`) in `diagnostics/parity-baseline-problem-codes.json` with linked quality/API docs.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-12` by propagating runtime event metadata (`requestId`, `correlationId`, `causationId`) across emitted domain events with deterministic fallback policy and explicit engine-test coverage.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-13` by adding an enforceable no-PII logging guardrail for engine/runtime source paths (`scripts/repo-engine-no-pii-logging.ts`) and wiring it into `repo:guardrails`.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-14` by adding `.github/CODEOWNERS` ownership coverage for engine core paths, OpenAPI/api-mock surfaces, parity manifests, and critical guardrail/gate scripts.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-15` by adding engine portability boundary enforcement (`scripts/repo-engine-portability-boundary.ts`) in `repo:guardrails` for `packages/rankup/src/{runtime,algorithms,registry,shared}`.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-16` by adding replay/golden determinism coverage in `packages/rankup/test/engine-replay.test.ts` with byte-equivalent snapshot payload assertions against `packages/rankup/test/golden/replay-scoreprediction-v1.json`.
Maintenance note (2026-02-06): Completed `WP-010-F3` item `AC-010-F3-17` by adding concurrency stress coverage for join/upsert/apply duplicate-event races and hardening runtime dedupe/concurrency with atomic processed-event claims plus `If-Match` compare-and-set submission persistence.
Maintenance note (2026-02-06): Closed Epic 010 final acceptance with full evidence (`yarn test:p0`, `yarn engine:test`, `yarn validate` all PASS) and returned active execution focus to Epic 008 support lane.
Maintenance note (2026-02-08): Added `WP-008-29` execution plan (`docs/work/epics/008-p0-testing-parity-1-1.md`) to drive 1:1 parity closure against the architect P0 testing recipe.
Maintenance note (2026-02-08): Completed `WP-008-29` `PR-001` (baseline + tracking unblock) and moved active execution to `PR-002` (mapper error mapping parity).
Maintenance note (2026-02-08): Completed `WP-008-29` `PR-002` by adding canonical `Problem -> DomainError` mapping and converting all 9 mapper P0 suites to assert real domain error kinds; active execution now moves to `PR-003` (contract passthrough parity).
Maintenance note (2026-02-08): Completed `WP-008-29` `PR-003` by wiring join/upsert idempotency + If-Match passthrough end-to-end in domain params/gateways/http-client and adding explicit P0 contract assertions; active execution now moves to `PR-004` (smoke flow parity).
Maintenance note (2026-02-08): Completed `WP-008-29` `PR-004` by introducing `scoring/results` domain wiring and switching P0 smoke flow #3 to `ranking -> results` (`getMyMatchdayResults`) through the real composition root + api-mock; active execution now moves to `PR-005` (dynamic gateway ratchet parity).
Maintenance note (2026-02-08): Completed `WP-008-29` `PR-005` by replacing static mapper-suite checks with dynamic gateway-pattern ratcheting in `scripts/test-guardrails-p0.ts` (baseline waivers + deterministic naming), preserving `.only/.skip` rejection, and validating that a newly added gateway without a mapper suite fails guardrails; active execution now moves to `PR-006` (determinism and budget gates).
Maintenance note (2026-02-08): Completed `WP-008-29` `PR-006` by adding deterministic call guardrails (`scripts/test-p0-determinism.ts`), runtime budget gate execution (`scripts/test-p0-budget.ts`), CI enforcement updates in `.github/workflows/test-p0.yml`, and policy documentation updates in `docs/engineering/testing-p0.md`; active execution now moves to `PR-007` (global closure and evidence lock).
Maintenance note (2026-02-08): Completed `WP-008-29` `PR-007` by locking final closure evidence (`yarn test:guardrails:p0`, `yarn test:p0`, `yarn engine:test`, `yarn validate` all PASS), closing global acceptance criteria A-E in the execution plan, and marking the parity lane complete.
Maintenance note (2026-02-08): Completed `WP-008-30` by migrating SPA API gateway paths from the legacy singular path to `services/api/tournaments`, adding a repo guardrail that forbids legacy singular imports/folder usage, and aligning service-catalog naming semantics with canonical `tournaments`.
Maintenance note (2026-02-08): Completed `WP-008-31` by standardizing canonical `tournament`/`tournaments` naming across paths, symbols, runtime slices, fixtures, skills/docs, and work-tracking artifacts.
Maintenance note (2026-02-08): Added `WP-008-32` execution plan (`docs/work/epics/008-operation-coverage-4way-global.md`) with explicit current-state metrics and PR sequence to migrate ADR-0056 from baseline-scoped gates to global 4-way coverage + hard new-operation ratchet.
Maintenance note (2026-02-08): Completed `WP-008-32` `PR-001` by adding the reproducible global inventory script/report (`repo:operation-coverage:report` -> `diagnostics/operation-coverage-global-report.json`) and formalizing ADR/quality docs that baseline parity is transitional while active execution moves to `PR-002`.
Maintenance note (2026-02-08): Completed `WP-008-32` `PR-002` by introducing the single global `repo:operation-coverage` gate in `yarn validate`, removing baseline scope from coverage gating, and globalizing ownership diagnostics while keeping `missingOwner` as explicit non-blocking debt until `PR-004`.
Maintenance note (2026-02-08): Completed `WP-008-32` `PR-003` by hardening waiver governance to v2 (`expiresAt` + `plan` mandatory, legacy `expiresOn` rejected, max TTL policy enforced, duplicate `operationId+waiverType` blocked) and aligning allowlist spec/ADR references.
Maintenance note (2026-02-08): Completed `WP-008-32` `PR-004` by centralizing `gatewayOperationMapping` for all non-admin operations (`226/226`), backfilling account gateway ownership metadata, and enforcing strict owner/mapping parity as blocking conditions in both `repo:operation-coverage` and `gateways:ownership`.
Maintenance note (2026-02-09): Completed `WP-008-32` `PR-005` by replacing implicit dynamic fallback handlers with explicit per-operation wiring (`implemented` + static `notImplemented` catalog), adding `api-mock` `not-implemented-handler` generation for the remaining `190` non-admin operations, and hardening `repo:operation-coverage` to fail on forbidden fallback-injection patterns.
Maintenance note (2026-02-09): Completed `WP-008-32` `PR-006` by enforcing canonical fixture paths (`packages/api-mock/src/fixtures/generated/<operationId>.json`) as a blocking global coverage rule, moving remaining non-canonical fixtures, and validating `withCanonicalFixture=226/226` with `fourWayGlobalPass=226/226`.
Maintenance note (2026-02-09): Hardened engine type-safety guardrails by adding `scripts/repo-engine-type-safety-boundary.ts` and wiring it into `repo:guardrails` to forbid `any`, restrict `unknown` to an explicit allowlist (runtime port contracts + approved files only), and block assertion patching via `as unknown`/`as never` across `packages/rankup/src/{runtime,algorithms,registry,shared}`.
Maintenance note (2026-02-08): Added `WP-008-33` execution plan (`docs/work/epics/008-problemdetails-domainerror-global.md`) to close global ProblemDetails/error taxonomy consistency with strict acceptance criteria.
Maintenance note (2026-02-08): Completed `WP-008-33` `PR-001` by removing generic `Error("HTTP ...")` throws from `apps/rankup-spa/services/api/http-client.ts`, routing non-2xx responses through canonical `mapProblemToDomainError`, expanding engine-aligned `DomainErrorKind`, and adding dedicated P0 mapper + smoke negative coverage.
Maintenance note (2026-02-09): Completed `WP-008-33` `PR-002` by adding `map<Domain>ProblemToDomainError` wrappers across all SPA API domains with gateways, extending deterministic error fixtures (`@rankup/testkit`) for canonical + engine-specific cases, and adding per-domain P0 mapper coverage so error status coverage now includes `401/403/404/409/422/429/5xx`.
Maintenance note (2026-02-09): Completed `WP-008-33` `PR-003` by expanding smoke negative assertions to `accounts/tournaments/submissions/scoring`, adding explicit P0 `accounts` contract coverage, and enforcing canonical `DomainError` passthrough assertions in critical contract suites.
Maintenance note (2026-02-09): Completed `WP-008-33` `PR-004` by adding guardrails that block generic `Error("HTTP ...")` throws in the SPA API client and enforce canonical `mapProblemToDomainError` delegation for `*ProblemToDomainError` mapper exports.
Maintenance note (2026-02-09): Added `WP-008-34` production-readiness hardening plan (`docs/work/epics/008-engine-production-readiness-hardening.md`) with explicit P0/P1 execution order and VSCode-grade acceptance criteria following deep repository scrutiny.
Maintenance note (2026-02-09): Completed `WP-008-34` `PR-001` by closing canonical 4-way fixture enforcement evidence (`repo:operation-coverage` + report + schema gates + validate in green) and moved active execution to `PR-002` (runtime canonical error surface without generic throws).
Maintenance note (2026-02-09): Completed `WP-008-34` `PR-002` by eliminating runtime `throw new Error(...)` paths in favor of canonical `RuntimeProblem`, adding `idempotencyOutcomeInvalid` taxonomy mapping end-to-end, and enforcing a dedicated runtime guardrail (`scripts/repo-engine-runtime-error-surface.ts`) in `repo:guardrails`.
Maintenance note (2026-02-09): Completed `WP-008-34` `PR-003` by introducing file-backed persistent engine adapters in `packages/rankup/src/adapters/persistent/**` for `TournamentRepo`/`SubmissionRepo` (CAS)/`IdempotencyPort`/`ProcessedEventRepo`/`ScoringRepo`, with deterministic parity/persistence/CAS evidence in `packages/rankup/test/engine-persistent-adapters.test.ts`.
Maintenance note (2026-02-09): Completed `WP-008-34` `PR-004` by replacing runtime authorization/trust-safety stubs with ADR-0067 policy-matrix adapters + traceable decisions, enforcing policy-driven `403` outcomes across `join|upsert|clear|cancel`, and adding engine tests for trust-safety blocks plus actor/audit event payload metadata.
Maintenance note (2026-02-09): Completed `WP-008-34` `PR-005` by adding a versioned release-critical operations catalog (`diagnostics/release-critical-operations.json`), enforcing blocking `releaseCriticalNotImplemented=0` in global coverage gates/report, and adding non-critical fallback canonicalization coverage (`getMyPreferences` fixture `expect.status=501` + `notImplementedFallback.contract.test.ts`).
Maintenance note (2026-02-09): Completed `WP-008-34` `PR-006` by moving provider match-status canonicalization to OpenAPI SOT (`components.schemas.MatchStatus.x-rankup-canonical-statuses`) with generated catalog artifacts, removing manual `OperationId` literal unions from `api-mock` core types, and adding blocking guardrail `scripts/repo-openapi-sot-drift.ts` to prevent status/type drift.
Maintenance note (2026-02-09): Opened `WP-008-35` (`docs/work/epics/008-sse-streaming-operational.md`) for product-grade SSE hardening and completed `PR-001` with shared `OperationalSseClient` in `@rankup/base`, testkit migration to the standard client, and deterministic engine/P0 coverage for dedupe/reconnect/ordering/disposal + leak checks.

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
-   `packages/testkit`: shared deterministic test fixtures/harness for P0 lanes.
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
-   rankup-engine-testing-vitest: engine-only Vitest workflow for deterministic runtime/algorithm test coverage.

Epic 002 skills:

-   rankup-epic-002: WPs + invariants for service layering + DI.
-   rankup-di-primitives: createDecorator/ServiceCollection/InstantiationService.
-   rankup-composition-root: single implementation selector.
-   rankup-ui-appservices-bridge: typed AppServices (no service locator).
-   rankup-domain-tournament-service: ITournament capability services pattern (core/matchdays/members/codes/invites; rankings live in scoring).
-   rankup-home-vertical-slice: migrate Home to ITournamentCoreService.
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
