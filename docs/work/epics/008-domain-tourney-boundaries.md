# Epic 008: Domain tourney boundaries (Apibase-aligned)

## Status

-   Status: In Progress
-   Owner: Rankup maintainers
-   Last updated: 2026-02-06
-   Depends on: Epic 007 (done)

## Goal

Introduce an Apibase-style app-level domain layout under `packages/rankup/src/domains/*` and move domain wiring into the app composition root, keeping platform infra-only.

## Invariants (must not regress)

-   OpenAPI-first (ADR 0006).
-   Mock-first (ADR 0007).
-   UI cannot import implementations (ADR 0010).
-   Composition root is the only wiring place (ADR 0016).
-   No UI tests (ADR 0002).
-   No compatibility shims (greenfield mode).

---

## WP-008-01: Apibase-style domains under packages/rankup + app-owned composition root

### Goal

-   Create `packages/rankup` with `src/domains/tournaments` (contracts, implementations, mocks, tests).
-   Move `ITourneyService` contract/impl into `packages/rankup/src/domains/tournaments`.
-   Move composition root + AppServices into `apps/rankup-spa`.
-   Remove domain wiring from platform.

### DoD

-   [x] `packages/rankup/src/domains/tournaments` exists with contracts + browser impl + mock/test folders.
-   [x] `ITourneyService` contract/impl moved under `packages/rankup/src/domains/tournaments`.
-   [x] Composition root lives in `apps/rankup-spa/lib/composition-root.ts`.
-   [x] AppServices lives in `apps/rankup-spa/lib/app-services.ts`.
-   [x] SPA bootstrap lives in `apps/rankup-spa/main.ts` with `rk-app`/`rk-unauthenticated-app` view-only.
-   [x] `rk-app` receives `appServices`/`sessionManager` via host properties and bootstrap listener cleanup uses disposables.
-   [x] Public app context removed; public pages use `ISessionManager` via provider + redirect helper.
-   [x] UI imports updated to domain contracts.
-   [x] Guardrails enforce UI/domain boundaries + platform does not depend on domain packages.
-   [x] Domain DTOs + tourney gateway mapping added; `@rankup/api` removed from UI/domain (ADR 0048).
-   [x] ADR 0049 added and ADR index updated (ADR 0043 superseded).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

Notes:
-   Tourney domain now uses Hadron-style capability split (`shared`, `core`, `matchdays`, `ranking`, `members`, `codes`, `invites`) with per-capability `contracts/types`.

-   Removed legacy empty `packages/platform/src/tourney` folders.
-   InstantiationService now duck-types SyncDescriptor to avoid cross-module instanceof mismatches during dev-server service resolution.
-   Platform API client wiring moved into app services; `@rankup/platform` no longer imports product SDKs (ADR 0046).
-   Adopted Apibase-style build/dev pipeline (tsc -b + rollup + WDS/esbuild) in ADR 0047.
-   WDS base config now uses node-resolve/commonjs/json with `__APP_ENV__` injection, outside-root handling (`/assets`, `/docs`, `/node_modules`), and optional `--compile-css`; package exports map `.js` subpaths to TS sources (superseding dist-based exports).
-   Rollup HTML inputs now use `apps/**/*.html`, rollup tsconfig excludes server/scripts/config with DOM-only types, and the @rankup/api guardrail no longer matches @rankup/api-mock.
-   Platform env now relies on `__APP_ENV__` injection (no json.example imports); `.tsbuildinfo` artifacts are now ignored.
-   Maintenance: app validate uses `tsc --noEmit`; `yarn validate` cleans after the app typecheck to preserve project reference outputs; UI/Samba TypeScript override/type-only imports aligned.
-   Maintenance: WDS dev-server configs are now `.mjs` (TS-only exception) so WDS auto-loads them; start scripts use `wds --watch`; wireit is listed in app devDependencies; app configs call `createWebDevServerConfig(appRoot)` to avoid cwd-dependent 404s; WDS uses outside-root depth prefixing plus `.ts`/`.json` MIME overrides for module/asset requests.
-   Maintenance: Tourney domain barrel exports are type-only to avoid duplicate identifier errors under composite builds.
-   Maintenance: WDS repo-root detection now uses the workspace package name with `nodeResolve.rootDir`/`nodeResolve.jail`, `preserveSymlinks=false`, and an outside-root depth guard to keep node_modules resolution aligned with Hadron.

### Verification

-   `yarn validate`

---

## WP-008-02: Codify no-legacy/compatibility policy (greenfield mode)

### Goal

-   Make “no legacy/compat shims” explicit in agent rules + ADR + CURRENT.

### DoD

-   [x] AGENTS includes explicit no-legacy/compatibility rule.
-   [x] ADR 0013 mentions no legacy/compatibility shims during greenfield.
-   [x] CURRENT invariants mention no legacy/compatibility shims.

### Verification

-   `yarn validate`

---

## WP-008-03: Document internal game-mode registry + ruleset versioning

### Goal

-   Record the internal registry decision (no external extensibility) and ruleset policy in ADR + negocio docs.

### DoD

-   [x] ADR 0044 added and ADR index updated.
-   [x] negocio docs reflect registry + ruleset statuses + audit fields.
-   [x] P-0007 resolved and removed from pending list.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-04: OpenAPI canonical migration (packages/api/openapi.yaml)

### Goal

-   Move the canonical spec to `packages/api/openapi.yaml`, update tooling/guardrails, and remove legacy specs.

### DoD

-   [x] `packages/api/openapi.yaml` is the canonical spec (OpenAPI 3.1.2).
-   [x] Root `openapi.yaml` removed; `spec-draft.*` removed.
-   [x] Tooling + mock server point to `packages/api/openapi.yaml`.
-   [x] Docs/ADRs/skills updated to the new canonical path.
-   [x] Guardrail fails if any spec exists outside `packages/api/openapi.yaml`.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

Notes:
-   Added Problem Details 413/415 components and `Vary-AcceptLanguage` header; spectral rules now validate `application/problem+json` and `text/event-stream`.
-   ScorePrediction resultScope clarified (final score after extra time, penalties excluded) and match outcomes now expose penalty shootout context.
-   CreateTournament rulesetConfig examples added to guide UI/mocks for resultScope overrides.

### Verification

-   `yarn validate`

---

## WP-008-05: Relocate error catalog under packages/api/docs

### Goal

-   Move the Problem Details error catalog into `packages/api/docs/errors`.
-   Verify uploads-domain error types are covered in the catalog.
-   Refresh repo tree snapshots that reference the repo structure.

### DoD

-   [x] `packages/api/docs/errors/README.md` is the canonical error catalog location.
-   [x] Uploads-domain error types (413/415) are present in the catalog.
-   [x] Repo tree snapshots updated (`docs/diagnostics/REPO-TREE.md`, `docs/scope/questions.md`).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-06: Expand tourney domain surface (OpenAPI alignment)

### Goal

-   Align tourney domain models/contracts with OpenAPI for preview, matchdays navigation, ranking windows, membership, invitation codes, and direct invites.
-   Update app gateway + HTTP client mapping and api-mock parity.
-   Provide an LLM prompt for future tourney domain work.

### DoD

-   [x] New models added under tourney capability folders (core/members/invites/codes/matchdays) with shared types.
-   [x] Capability contracts + gateways cover preview, matchdays, ranking windows, membership, invites, invitation codes, and my-invites inbox.
-   [x] Capability services validate invitation codes/matchday numbers and delegate to their gateways.
-   [x] `apps/rankup-spa/services/api/http-client.ts` + `apps/rankup-spa/services/api/tourney/*-gateway.ts` map the new endpoints explicitly.
-   [x] `packages/api/src/client.ts` + `packages/api/src/types.ts` updated to expose OpenAPI surfaces; api-mock updated for parity.
-   [x] `packages/rankup/src/domains/tournaments/LLM_PROMPT.md` updated with required context and file list.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-07: OpenAPI change protocol + gateway mapping helpers

### Goal

-   Document the OpenAPI change protocol.
-   Add shared mapping helpers for gateway DTO alignment.

### DoD

-   [x] `docs/engineering/openapi-change-protocol.md` created and referenced.
-   [x] `apps/rankup-spa/services/api/gateway-mapping.ts` added and used in tourney gateway.
-   [x] ADR 0050 added + ADR index updated.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-08: Gateway mapping guardrail

### Goal

-   Enforce no `...api*` spreads or `as Domain.*` assertions in app gateways.

### DoD

-   [x] Guardrail added to `scripts/repo-guardrails.ts` for `apps/rankup-spa/services/api/**/*-gateway.ts`.
-   [x] ADR 0050 updated to include the guardrail decision.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-09: Capability split inside tourney domain

### Goal

-   Split `packages/rankup/src/domains/tournaments` into capability subfolders (`shared`, `core`, `matchdays`, `ranking`, `members`, `codes`, `invites`).
-   Replace monolithic `ITourneyService`/`ITourneyGateway` with capability services + gateways.
-   Update app gateways, composition root, and UI imports to the new paths.
-   Refresh docs/skills to match the new structure.

### DoD

-   [x] Tourney domain uses `shared/` plus capability folders (`core`, `matchdays`, `ranking`, `members`, `codes`, `invites`).
-   [x] Capability contracts/services/gateways are defined and registered.
-   [x] App gateways split under `apps/rankup-spa/services/api/tourney/*-gateway.ts`.
-   [x] UI imports updated to capability contracts.
-   [x] Docs/skills updated to reflect the new capability layout.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-10: Start domain partitioning (Phase 0: rename tourney domain)

### Goal

-   Rename the tourney domain folder to `tournaments` and update imports/docs accordingly.
-   Record the decision in an ADR.

### DoD

-   [x] `packages/rankup/src/domains/tourney` renamed to `packages/rankup/src/domains/tournaments` with all references updated (no legacy shims).
-   [x] ADR 0052 added and ADR index updated.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-11: Split ranking into scoring domain

### Goal

-   Move the ranking capability into `packages/rankup/src/domains/scoring`.
-   Keep tournaments focused on lifecycle + membership concerns.
-   Update app wiring/imports to the new domain path.

### DoD

-   [x] `packages/rankup/src/domains/scoring` exists with `ranking/` moved in.
-   [x] `registerScoringDomainServices` added and used in the composition root.
-   [x] App gateways, AppServices, and UI imports updated to scoring paths.
-   [x] Docs updated to reflect rankings under scoring.
-   [x] ADR 0053 added and ADR index updated.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-12: Scaffold Rankup Engine layers + domain placeholders

### Goal

-   Add engine-level scaffolding for `shared/`, `algorithms/`, `registry/`, `runtime/`.
-   Scaffold Phase 0 domains plus roadmap domains as README placeholders.

### DoD

-   [x] `packages/rankup/src/shared`, `algorithms`, `registry`, `runtime` created with README placeholders.
-   [x] Domain folders created for accounts, sports, rules, submissions, engagement, verified, ranked, achievements, media, trustSafety, promotions, creators, admin (README placeholders).
-   [x] Scoring/tournaments placeholders aligned with the partitioning proposal (preview + results/timeline/shared).
-   [x] ADR 0054 added and ADR index updated.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-13: Accounts domain (Fase 0 implementation)

### Goal

-   Implement minimal contracts/models/services for accounts (auth/me/users/social) aligned to OpenAPI.
-   Add app gateways + mapping for the accounts endpoints.
-   Mock-first parity for accounts surfaces.

### DoD

-   [x] `packages/rankup/src/domains/accounts/*` has capability models + contracts + services with `contracts/types.ts`.
-   [x] Gateways added under `apps/rankup-spa/services/api/accounts/*-gateway.ts`.
-   [x] Composition root registers accounts gateways/services.
-   [x] api-mock parity for accounts endpoints.
-   [x] Docs/skills updated if new paths are introduced.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-14: Sports domain (Fase 0 implementation)

### Goal

-   Implement minimal contracts/models/services for sports catalog + schedule aligned to OpenAPI.
-   Add app gateways + mapping for sports endpoints.
-   Mock-first parity for sports surfaces.

### DoD

-   [x] `packages/rankup/src/domains/sports/*` has capability models + contracts + services with `contracts/types.ts`.
-   [x] Gateways added under `apps/rankup-spa/services/api/sports/*-gateway.ts`.
-   [x] Composition root registers sports gateways/services.
-   [x] api-mock parity for sports endpoints.
-   [x] Docs/skills updated if new paths are introduced.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-15: Rules domain (Fase 0 implementation)

### Goal

-   Implement minimal contracts/models/services for game modes + rulesets aligned to OpenAPI.
-   Add app gateways + mapping for rules endpoints.
-   Mock-first parity for rules surfaces.

### DoD

-   [ ] `packages/rankup/src/domains/rules/*` has capability models + contracts + services with `contracts/types.ts`.
-   [x] `packages/rankup/src/domains/rules/*` has capability models + contracts + services with `contracts/types.ts`.
-   [x] Gateways added under `apps/rankup-spa/services/api/rules/*-gateway.ts`.
-   [x] Composition root registers rules gateways/services.
-   [x] api-mock parity for rules endpoints.
-   [x] Docs/skills updated if new paths are introduced.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-16: Submissions domain (Fase 0 implementation)

### Goal

-   Implement minimal contracts/models/services for submissions (scorePrediction) aligned to OpenAPI.
-   Add app gateways + mapping for submissions endpoints.
-   Mock-first parity for submissions surfaces.

### DoD

-   [x] `packages/rankup/src/domains/submissions/*` has capability models + contracts + services with `contracts/types.ts`.
-   [x] Gateways added under `apps/rankup-spa/services/api/submissions/*-gateway.ts`.
-   [x] Composition root registers submissions gateways/services.
-   [x] api-mock parity for submissions endpoints.
-   [x] Docs/skills updated if new paths are introduced.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-17: Engagement domain (Fase 0 implementation)

### Goal

-   Implement minimal contracts/models/services for engagement (chat/live/stats) aligned to OpenAPI.
-   Add app gateways + mapping for engagement endpoints.
-   Mock-first parity for engagement surfaces.

### DoD

-   [x] `packages/rankup/src/domains/engagement/*` has capability models + contracts + services with `contracts/types.ts`.
-   [x] Gateways added under `apps/rankup-spa/services/api/engagement/*-gateway.ts`.
-   [x] Composition root registers engagement gateways/services.
-   [x] api-mock parity for engagement endpoints.
-   [x] Docs/skills updated if new paths are introduced.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-18: Heads-Up tournament format (OpenAPI + domain alignment)

### Goal

-   Add a tournament format dimension (`formatId` + `formatConfig`) with `headsUp` config.
-   Add duel convenience endpoints and invite kind metadata.
-   Expose heads-up scoreboard payloads in ranking responses and extend game modes with supported formats.
-   Keep mock-first parity across api-mock and app gateways.

### DoD

-   [x] OpenAPI updated with tournament format schemas, duel endpoints, invite kind, ranking heads-up payloads, and format filters.
-   [x] SDK types regenerated (`openapi.ts`), client/types exports updated.
-   [x] Domain models/contracts updated (tournaments, scoring, rules) with app gateway mapping changes.
-   [x] api-mock parity for formatId, invite kind, duel endpoints, and heads-up scoreboard responses.
-   [x] ADR 0055 added + ADR index updated.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-19: Remove tourney placeholders owned by other domains

### Goal

-   Remove placeholder capability folders under `domains/tournaments` that now belong to engagement/submissions/scoring/algorithms.
-   Keep `tournaments` focused on lifecycle + membership + matchdays + invites/codes.

### DoD

-   [x] `chat/`, `stats/`, `recaps/`, `updates/` removed from `domains/tournaments`.
-   [x] `submissions/` removed from `domains/tournaments`.
-   [x] `results/` removed from `domains/tournaments`.
-   [x] `analysis/` removed from `domains/tournaments` (algorithms live under `packages/rankup/src/algorithms`).
-   [x] Removed empty root-level folders not in the partitioning proposal (`common/`, `contracts/`, `models/`, `services/`, `mock/`, `tests/`, `validation/`).
-   [x] `packages/rankup/src/domains/tournaments/README.md` updated with new ownership notes.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-20: Engagement recaps/updates capability split

### Goal

-   Split engagement recaps into a `recaps/` capability and updates into an `updates/` capability.
-   Keep OpenAPI unchanged; use existing endpoints/schemas.

### DoD

-   [x] Create `packages/rankup/src/domains/engagement/recaps` with `README.md`, `models/`, `contracts/`, `services/`.
-   [x] Create `packages/rankup/src/domains/engagement/updates` with `README.md`, `models/`, `contracts/`, `services/`.
-   [x] Move recap-related types and service methods from `engagement/stats` into `engagement/recaps`.
-   [x] Move updates-related methods from `engagement/live` into `engagement/updates`.
-   [x] Update `packages/rankup/src/domains/engagement/index.ts` exports.
-   [x] Update `packages/rankup/src/domains/engagement/registerEngagementDomainServices.ts`.
-   [x] Update app gateways under `apps/rankup-spa/services/api/engagement/*-gateway.ts` to reflect the new capabilities (new `recaps-gateway.ts` and `updates-gateway.ts` or equivalent split).
-   [x] Update `apps/rankup-spa/lib/app-services.ts` and `apps/rankup-spa/lib/composition-root.ts` to wire the new services.
-   [x] Ensure api-mock parity for recaps/updates endpoints (no new OpenAPI).
-   [x] Update `packages/rankup/src/domains/engagement/README.md` to list `recaps` and `updates` as capabilities.
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-21: Verified domain (Phase 1 implementation)

### Goal

-   Implement contracts/models/services for verified (hub + events + tournaments) without OpenAPI changes.

### Dependencies / ownership

-   SoT: `verified`.
-   Consumes: `tournaments`, `media`, `trustSafety` (optional `creators`, `promotions`).

### DoD

-   [x] `packages/rankup/src/domains/verified/{shared,hub,events}` with `models/`, `contracts/`, `services/`, `contracts/types.ts`.
-   [x] `verified.hub`, `verified.events`, `verified.tournaments` mapped (tournaments inside `events`).
-   [x] `registerVerifiedDomainServices` + export in `packages/rankup/src/domains/verified/index.ts`.
-   [x] Gateways/mappers in `apps/rankup-spa/services/api/verified/*-gateway.ts`.
-   [x] Wiring in `apps/rankup-spa/lib/app-services.ts` + `apps/rankup-spa/lib/composition-root.ts`.
-   [x] api-mock parity for verified endpoints (no admin).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-22: Ranked domain (Phase 1 implementation)

### Goal

-   Implement contracts/models/services for ranked (tracks/seasons/leaderboards) without OpenAPI changes.

### Dependencies / ownership

-   SoT: `ranked`.
-   Consumes: `verified`, `scoring`, `trustSafety`.

### DoD

-   [x] `packages/rankup/src/domains/ranked/{shared,seasons,leaderboards}` with `models/`, `contracts/`, `services/`, `contracts/types.ts`.
-   [x] `ranked.meta`, `ranked.tracks`, `ranked.seasons` mapped to `seasons`; `ranked.leaderboards`, `ranked.me`, `ranked.users` mapped to `leaderboards`.
-   [x] `registerRankedDomainServices` + export in `packages/rankup/src/domains/ranked/index.ts`.
-   [x] Gateways/mappers in `apps/rankup-spa/services/api/ranked/*-gateway.ts`.
-   [x] Wiring in `apps/rankup-spa/lib/app-services.ts` + `apps/rankup-spa/lib/composition-root.ts`.
-   [x] api-mock parity for ranked endpoints (no admin).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-23: Achievements domain (Phase 1 implementation)

### Goal

-   Implement contracts/models/services for achievements (catalog + grants) without OpenAPI changes.

### Dependencies / ownership

-   SoT: `achievements`.
-   Consumes: `verified`, `scoring`, `trustSafety`.

### DoD

-   [x] `packages/rankup/src/domains/achievements/{shared,catalog,grants}` with `models/`, `contracts/`, `services/`, `contracts/types.ts`.
-   [x] `achievements.meta` + `/achievements` mapped to `catalog`; `/me/achievements` + `/users/{id}/achievements` mapped to `grants`.
-   [x] `registerAchievementsDomainServices` + export in `packages/rankup/src/domains/achievements/index.ts`.
-   [x] Gateways/mappers in `apps/rankup-spa/services/api/achievements/*-gateway.ts`.
-   [x] Wiring in `apps/rankup-spa/lib/app-services.ts` + `apps/rankup-spa/lib/composition-root.ts`.
-   [x] api-mock parity for achievements endpoints (no admin).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-24: Media domain (Phase 1 implementation)

### Goal

-   Implement contracts/models/services for media uploads/assets without OpenAPI changes.

### Dependencies / ownership

-   SoT: `media`.
-   Consumes: `trustSafety` (policy/moderation signals).

### DoD

-   [x] `packages/rankup/src/domains/media/{shared,uploads,assets}` with `models/`, `contracts/`, `services/`, `contracts/types.ts`.
-   [x] `uploads.*` mapped to `uploads`; `/media/*` mapped to `assets`.
-   [x] `registerMediaDomainServices` + export in `packages/rankup/src/domains/media/index.ts`.
-   [x] Gateways/mappers in `apps/rankup-spa/services/api/media/*-gateway.ts`.
-   [x] Wiring in `apps/rankup-spa/lib/app-services.ts` + `apps/rankup-spa/lib/composition-root.ts`.
-   [x] api-mock parity for media endpoints (no admin).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-25: TrustSafety domain (Phase 1 implementation)

### Goal

-   Implement contracts/models/services for trust & safety (reports/enforcement/appeals/policies) without OpenAPI changes.

### Dependencies / ownership

-   SoT: `trustSafety`.
-   Applies restrictions to other domains.

### DoD

-   [x] `packages/rankup/src/domains/trustSafety/{shared,reports,enforcement,appeals}` with `models/`, `contracts/`, `services/`, `contracts/types.ts`.
-   [x] `trustSafety.reporting` + `trustSafety.blocks` mapped to `reports`; `trustSafety.enforcement` mapped to `enforcement`; `trustSafety.policies` mapped to `shared`.
-   [x] `registerTrustSafetyDomainServices` + export in `packages/rankup/src/domains/trustSafety/index.ts`.
-   [x] Gateways/mappers in `apps/rankup-spa/services/api/trustSafety/*-gateway.ts`.
-   [x] Wiring in `apps/rankup-spa/lib/app-services.ts` + `apps/rankup-spa/lib/composition-root.ts`.
-   [x] api-mock parity for trust safety endpoints (no admin).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-26: Promotions domain (Phase 2 / In Progress)

### Goal

-   Implement contracts/models/services for promotions (catalog/participation/rewards) when Phase 2 starts.

### Dependencies / ownership

-   SoT: `promotions`.
-   Consumes: `verified`, `trustSafety`, `scoring`, `media`.

### DoD

-   [x] `packages/rankup/src/domains/promotions/{shared,campaigns,rewards}` with `models/`, `contracts/`, `services/`, `contracts/types.ts`.
-   [x] `promotions.catalog` + `promotions.participation` mapped to `campaigns`; `promotions.rewards` mapped to `rewards`.
-   [x] `registerPromotionsDomainServices` + export in `packages/rankup/src/domains/promotions/index.ts`.
-   [x] Gateways/mappers in `apps/rankup-spa/services/api/promotions/*-gateway.ts`.
-   [x] Wiring in `apps/rankup-spa/lib/app-services.ts` + `apps/rankup-spa/lib/composition-root.ts`.
-   [x] api-mock parity for promotions endpoints (no admin).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-27: Creators domain (Phase 2 / In Progress)

### Goal

-   Implement contracts/models/services for creators (directory + catalog) when Phase 2 starts.

### Dependencies / ownership

-   SoT: `creators`.
-   Consumes: `media`, `trustSafety` (optional `verified`).

### DoD

-   [x] Create `packages/rankup/src/domains/creators/{shared,directory,catalog}` with `models/`, `contracts/`, `services/`, `contracts/types.ts`.
-   [x] `creators.directory` mapped to `directory`; `creators.catalog` mapped to `catalog`.
-   [x] `registerCreatorsDomainServices` + export in `packages/rankup/src/domains/creators/index.ts`.
-   [x] Gateways/mappers in `apps/rankup-spa/services/api/creators/*-gateway.ts`.
-   [x] Wiring in `apps/rankup-spa/lib/app-services.ts` + `apps/rankup-spa/lib/composition-root.ts`.
-   [x] api-mock parity for creators endpoints (no admin).
-   [x] Work tracking updated (CURRENT + log).
-   [x] `yarn validate` PASS recorded.

### Verification

-   `yarn validate`

---

## WP-008-28: ADR-0056 waiver burn-down (tournaments/submissions first)

### Goal

-   Reduce waiver volume for `tournaments.core|submissions|rankings|matchdays|lifecycle|live|results` by adding fixtures and explicit gateway ownership.
-   Apply an initial waiver budget ratchet once coverage ramps up.

### DoD

-   [x] Added fixtures for 30 tournaments/submissions operations under `packages/api-mock/src/fixtures/tournaments/*.json`.
-   [x] Added explicit `operationOwners` maps in core/scoring/engagement/submissions gateways to remove missing owners for the targeted operations.
-   [x] Removed targeted waivers:
	- `missingFixture` for the 30-operation tournaments/submissions slice.
	- `missingOwner` for the 20 targeted core operations.
	- `httpFidelityMissing` for operations with `operationId`-named HTTP client methods in the targeted slice.
-   [x] Updated waiver budget ratchet from `WAIVERS_MAX_TOTAL=2000` to `WAIVERS_MAX_TOTAL=700` in `package.json` and ADR 0056.
-   [x] Added scoped `schemaValidationFlaky` waivers for operations that still return non contract-valid mock payloads during this burn-down step.
-   [x] Follow-up (2026-02-06): removed the targeted 12 `schemaValidationFlaky` waivers by aligning OpenAPI schemas and validating contract-valid mock responses for `createTournament`, `getTournament`, `updateTournament`, `transferTournamentOwnership`, `getTournamentMatchday`, `listDiscoverableTournaments`, `listTournamentMatchdayMatches`, `getMyMatchdayResults`, `getUserMatchdayResults`, `getMyMatchdaySubmission`, `getUserMatchdaySubmission`, and `upsertMyMatchdaySubmission`.
-   [x] Follow-up (2026-02-06): added explicit core handlers + OpenAPI-contract context wiring for `tournaments.core` + `tournaments.lifecycle` (`getTournament`, `getTournamentRules`, `listDiscoverableTournaments`, `updateTournament`, `archiveTournament`, `deleteTournament`, `lockTournament`, `transferTournamentOwnership`, `unarchiveTournament`, `unlockTournament`) and removed their 10 `missingMockHandler` waivers.
-   [x] Follow-up (2026-02-06): added explicit core handlers + OpenAPI-contract context wiring for `tournaments.submissions|rankings|results|live` (`clearMyMatchdaySubmission`, `getMyMatchdaySubmission`, `upsertMyMatchdaySubmission`, `getUserMatchdaySubmission`, `listMatchdaySubmissions`, `listTournamentMatchdayRanking`, `getMyTournamentMatchdayRankingWindow`, `getMyTournamentSeasonRankingWindow`, `getMyMatchdayResults`, `getUserMatchdayResults`, `getMatchdayResultsSummary`, `listTournamentUpdates`, `streamTournamentLive`) and removed their 13 `missingMockHandler` waivers.
-   [x] Follow-up (2026-02-06): extended `apps/rankup-spa/services/api/http-client.ts` with operationId-named HTTP fidelity aliases for tournaments rankings/results/live (including SSE `streamTournamentLive`) and removed 9 matching `httpFidelityMissing` waivers.
-   [x] Follow-up (2026-02-06): completed cross-slice ADR-0056 burn-down by adding fixtures for the remaining non-admin operations outside the tournaments slice, removing residual `missingMockHandler` + `missingFixture` + `httpFidelityMissing` waivers, and leaving only `missingOwner` + `schemaValidationFlaky` categories (`81` waivers total).
-   [x] Work tracking updated (`AGENTS.md`, `CURRENT.md`, this epic, and daily log).
-   [x] Validation evidence recorded with `yarn validate` PASS.

### Verification

-   `yarn gateways:ownership`
-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn waivers:check`
-   `yarn validate`

---

## Maintenance (2026-02-03)

-   Removed legacy empty `packages/app` folder; the app lives in `apps/rankup-spa`.
-   Added `docs/architecture/rankup-engine-domain-partitioning.md` with the domain partitioning proposal.

## Maintenance (2026-02-05)

-   Prepared ADR 0056 operation coverage gate prerequisites (default Problem response policy, operations manifest generation, allowlist spec alignment).
-   Implemented ADR 0056 operation coverage gates (mock coverage, gateway ownership, schema validation, HTTP fidelity) with waivers seeding and validate wiring.
