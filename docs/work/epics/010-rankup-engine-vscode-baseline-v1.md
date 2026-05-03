# Epic 010: Rankup Engine Baseline v1 (VS Code-grade, hardened P0)

## Status

-   Status: Completed (final acceptance evidence recorded)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-06
-   Depends on: Epic 008 (residual support only), ADR 0056 follow-up

## Goal

Implement the Rankup Engine baseline v1 as executable architecture under `packages/rankup/src/{domains,algorithms,registry,runtime,shared}` with deterministic scoring/ranking, strong idempotency and concurrency semantics, auditable recompute, and OpenAPI/mock parity gates.

## Invariants (must not regress)

-   OpenAPI-first (ADR 0006 + `docs/engineering/openapi-change-protocol.md`).
-   Mock-first parity (`@rankup/api-mock` remains contract-valid).
-   No UI tests (ADR 0002).
-   UI/package boundaries stay enforced (ADR 0010, ADR 0048, ADR 0046).
-   No compatibility shims (ADR 0013).
-   Structural changes update ADR index + CURRENT + epic + daily log.

---

## WP-010-00: Tracking and structural kickoff

### Goal

Create a dedicated Epic 010 execution lane and move engine baseline work to priority #1.

### DoD

-   [x] `docs/work/epics/010-rankup-engine-vscode-baseline-v1.md` created.
-   [x] `docs/work/CURRENT.md` points to Epic 010 as active priority.
-   [x] `docs/work/ROADMAP.md` includes Epic 010.
-   [x] `AGENTS.md` maintenance note updated for Epic 010 kickoff.
-   [x] Baseline `yarn validate` evidence recorded in daily log.

### Verification

-   `yarn validate`

---

## WP-010-01: ADR pack core (engine baseline decisions)

### Goal

Codify non-negotiable baseline decisions before implementation.

### DoD

-   [x] ADRs added/updated for: ScorePrediction spec, tournament state machine, idempotency semantics, storage baseline, sports canonical mapping, error taxonomy, observability minimum, replay baseline.
-   [x] ADR index updated.
-   [x] Work tracking updated.

### Verification

-   `yarn validate`

---

## WP-010-01b: ADR roles/permissions matrix (P0)

### Goal

Define normative authorization rules and audit requirements for critical operations.

### DoD

-   [x] ADR defines action -> roles -> Problem.code/status -> audit requirements.
-   [x] Matrix covers join/membership/invites/codes/lock/archive/ownership transitions.
-   [x] TrustSafety gating integration points documented.

### Verification

-   `yarn validate`

---

## WP-010-02: OpenAPI contractual cleanup

### Goal

Align shipped contract with immutable ruleset semantics and explicit runtime behavior.

### DoD

-   [x] `rulesetId` removed from `UpdateTournamentRequest`.
-   [x] `isSubmitted`, `submittedAt`, `clientSubmittedAt` semantics documented.
-   [x] `ResultState`/`RankingState` behavior clarified.
-   [x] SDK artifacts regenerated from OpenAPI.
-   [x] Domain/gateway/mock surfaces aligned.

### Verification

-   `yarn openapi:verify`
-   `yarn validate`

---

## WP-010-02b: OpenAPI idempotency + ETag semantics

### Goal

Formalize idempotency key conflict and concurrency semantics in contract text.

### DoD

-   [x] Idempotency key reuse conflict (`409`) documented for mismatched fingerprint.
-   [x] `If-Match` mismatch (`412`) semantics documented consistently.
-   [x] Problem Details codes for idempotency/etag mismatch documented.

### Verification

-   `yarn openapi:verify`
-   `yarn validate`

---

## WP-010-03: Registry executable v1

### Goal

Implement static registry for `football` + `scorePrediction` with immutable ruleset metadata.

### DoD

-   [x] Registry modules exist under `packages/rankup/src/registry/{sports,gameModes}`.
-   [x] Resolver APIs map `sportId/gameModeId/rulesetId` to executable definitions.
-   [x] `resultScope=extra_time` and tie-breaker order defined in registry defaults.

### Verification

-   `yarn validate`

---

## WP-010-04: Algorithms v1 (deterministic)

### Goal

Implement pure deterministic scoring/tie-break/lock algorithms.

### DoD

-   [x] ScorePrediction scoring implemented as pure functions.
-   [x] Tie-breakers implemented: `mostExactScores`, `mostCorrectOutcomes`, `mostExactGoalsOneTeam`, `earliestSubmission`, `random`.
-   [x] `mostExactGoalsOneTeam` counts per match (max 1 per match).
-   [x] `random` uses stable hash (no runtime RNG).
-   [x] Void/pending/provisional/final policy hooks included.

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-05: Runtime ports + in-memory adapters

### Goal

Define runtime IO contracts and implement in-memory persistence baseline (CRUD + snapshots versioned).

### DoD

-   [x] Runtime ports created for repos, event bus, idempotency, clock/id generation.
-   [x] In-memory adapters implement resource versioning and snapshot lineage.
-   [x] Idempotency store persists status/body/functional headers.

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-05b: Authorization and event dedupe ports

### Goal

Add explicit authorization/trust-safety and event dedupe contracts for runtime use-cases.

### DoD

-   [x] `AuthorizationPort`, `TrustSafetyPort`, `ProcessedEventRepo` created.
-   [x] In-memory adapters added and wired into runtime.
-   [x] Dedupe behavior for at-least-once sports events documented + tested.

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-06: UC-1 JoinTournament

### Goal

Implement join use-case with gating, strong idempotency, and membership uniqueness.

### DoD

-   [x] Join gating enforces locked/status/time/maxPlayers constraints.
-   [x] Idempotent retries return same canonical outcome.
-   [x] Duplicate membership creation prevented.
-   [x] Domain event emitted with correlation metadata.

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-07: UC-2 Upsert/Clear submissions

### Goal

Implement submissions mutation flow with concurrency, lock policy, and itemized rejections.

### DoD

-   [x] `If-Match` validation with deterministic 412 errors.
-   [x] Global lock vs partial item lock policy enforced.
-   [x] `applied[]` + `rejected[]` contract behavior stable.
-   [x] `submissionCompleteAt` first-complete-only semantics enforced.

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-08: UC-3 ApplyMatchFinished/Recompute

### Goal

Implement scoring application and auditable recompute on corrections.

### DoD

-   [x] Incremental scoring by finished/corrected match implemented.
-   [x] Recompute publishes versioned snapshots with lineage metadata.
-   [x] Event dedupe by event/fingerprint enforced.

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-08b: Tournament lifecycle evaluator

### Goal

Implement reproducible lifecycle transition evaluator (`finished` + staff-driven `cancelled`).

### DoD

-   [x] `EvaluateTournamentLifecycle(tournamentId)` use-case exists.
-   [x] `finished` transition rule deterministic and tested.
-   [x] `cancelled` staff override effects on joins/submissions documented + enforced.

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-09: api-mock runtime integration

### Goal

Use runtime outputs in contract-valid mock handlers for core/results/submissions/rankings/live slice.

### DoD

-   [x] Runtime connected in `packages/api-mock` handlers for slice operations.
-   [x] Responses stay schema-valid under OpenAPI contract validator.
-   [x] Slice behavior deterministic with in-memory adapters.

### Verification

-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn validate`

---

## WP-010-09b: Parity spec + gate formalization

### Goal

Define and enforce formal parity baseline by operationId.

### DoD

-   [x] Parity spec document added (status/content-type/schema/headers functional).
-   [x] Gate script added/extended and integrated in `validate`.
-   [x] Baseline operation set must pass parity without waivers.

### Verification

-   `yarn api-mock:coverage`
-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn validate`

---

## WP-010-10: Close ADR-0056 residual waivers

### Goal

Burn down remaining `missingOwner` + `schemaValidationFlaky` and ratchet waivers to zero.

### DoD

-   [x] Remaining ownership and schema-flaky waivers removed from baseline scope.
-   [x] `WAIVERS_MAX_TOTAL` ratcheted to `0`.
-   [x] `yarn waivers:check` passes without waivers.

### Verification

-   `yarn waivers:check`
-   `yarn validate`

---

## WP-010-11: Test suite + observability + DX

### Goal

Harden baseline with deterministic tests, minimal observability contracts, and engine docs.

### DoD

-   [x] `yarn engine:test` script exists and runs deterministic unit/integration tests.
-   [x] Replay/idempotency/concurrency/event-dedupe coverage implemented.
-   [x] Request/correlation metadata plumbed through runtime events.
-   [x] Engine README + "add sport/mode" checklist documented.
-   [x] Ownership mapping (`CODEOWNERS` or equivalent) updated for critical paths (operationOwners + baseline parity ownership gate).

### Verification

-   `yarn engine:test`
-   `yarn validate`

---

## WP-010-F1: Post-baseline parity expansion (duels + competitions)

### Goal

Expand the parity baseline operation set with low-risk, contract-valid operations outside the original 30-op core slice.

### DoD

-   [x] Added baseline operationIds: `listCompetitions`, `listMyDuels`, `createDuel`, `createDuelRematch`.
-   [x] Added/updated fixtures so all new baseline operations are request-valid and response schema-valid.
-   [x] Fixed OpenAPI `CreateDuelRequest` allOf contradiction (`additionalProperties: false` removed from the extension object) to keep request validation consistent with inherited create fields.
-   [x] `api-mock:coverage`, `gateways:ownership`, `api-mock:schema-validate`, and `api-http:schema-validate` PASS with the expanded baseline.

### Verification

-   `yarn openapi:generate`
-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn api-mock:coverage`
-   `yarn gateways:ownership`
-   `yarn validate`

---

## WP-010-F2: Post-baseline parity expansion (users.directory + auth.oauth)

### Goal

Expand the parity baseline with user-profile and OAuth operations while preserving explicit ownership and HTTP operationId fidelity.

### DoD

-   [x] Added baseline operationIds: `getUserPublicProfile`, `oauthAuthorize`, `oauthTokenExchange`.
-   [x] Added explicit `operationOwners` mapping for these operations in `users` and `auth` gateways.
-   [x] Added HTTP operationId aliases in SPA HTTP client for `getUserPublicProfile` + OAuth operations.
-   [x] Hardened OAuth authorize query serialization to omit absent optional PKCE fields (prevents invalid empty enum values and schema 400 drift).
-   [x] `api-mock:coverage`, `gateways:ownership`, `api-mock:schema-validate`, and `api-http:schema-validate` PASS with the expanded baseline.

### Verification

-   `yarn api-mock:coverage`
-   `yarn gateways:ownership`
-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn validate`

---

## WP-010-F3: Strict Acceptance Closure (CA-A..L)

### Goal

Close every remaining `FAIL`/`PARTIAL` criterion from the strict acceptance audit before re-declaring Epic 010 as completed.

### Scope rule

-   This lane is priority #1 and temporarily supersedes post-baseline parity expansion work outside acceptance closure.
-   Work is executed one item at a time (no parallel closure claims).

### Ordered checklist (execute 1 -> N)

#### P0 blockers

-   [x] `AC-010-F3-18` (test platform): define and implement the unified engine test system migration to Vitest (`engine:test` now runs Vitest with Node-only config and deterministic setup).
-   [x] `AC-010-F3-18a` (P0 lane): implement `yarn test:p0` with deterministic `@rankup/testkit` fixtures/helpers, mapper+contract+smoke+streaming suites, P0 guardrail ratchet (`scripts/test-guardrails-p0.ts`), and CI workflow gate (`.github/workflows/test-p0.yml`).
-   [x] `AC-010-F3-18b` (platform split stabilization): fix moved P0 contract/smoke wiring (`packages/rankup/test/**`) and isolate `engine:test` from `__tests__/p0/**` to keep `yarn validate` deterministic while `yarn test:p0` remains the dedicated P0 gate.
-   [x] `AC-010-F3-01` (`CA-E1.2`): persist deterministic 4xx idempotency outcomes (not only 2xx) and replay exact status/body/functional headers.
-   [x] `AC-010-F3-02` (`CA-E2.4`): wire `X-Idempotency-Key` end-to-end for `clearMyMatchdaySubmission` (HTTP -> mock handler -> runtime use-case).
-   [x] `AC-010-F3-03` (`CA-I2`): enforce functional header parity in gates (`ETag`, `X-Request-Id`, and operation-required headers) and support handler-level response headers.
-   [x] `AC-010-F3-04` (`CA-E3.2`): add explicit incremental-vs-full recompute equivalence tests.

#### P1 robustness and contract hardening

-   [x] `AC-010-F3-05` (`CA-E1.1`): complete join gating policy (`finished` included) and align error mapping.
-   [x] `AC-010-F3-06` (`CA-L1`): include join operations (`joinTournament`, `joinTournamentByInvitationCode`) in runtime-backed parity baseline with fixtures/owners/http parity.
-   [x] `AC-010-F3-07` (`CA-C2`): add explicit `penalty_shootout` + `resultScope=extra_time` scoring tests.
-   [x] `AC-010-F3-08` (`CA-D4`): add kickoff/time-based lock determinism tests (not only static lock-state checks).
-   [x] `AC-010-F3-09` (`CA-E1.3`): add concurrent join race test proving no duplicate membership under adversarial timing.
-   [x] `AC-010-F3-10` (`CA-F2`): add provider->canonical drift tests (ID stability/correction fingerprint behavior).
-   [x] `AC-010-F3-11` (`CA-G2`): publish per-operation error catalog mapping (`status` + `Problem.code`) for baseline operations.
-   [x] `AC-010-F3-12` (`CA-H1`): propagate and verify full event metadata (`requestId`, `correlationId`, `causationId`).
-   [x] `AC-010-F3-13` (`CA-H2`): add enforceable no-PII logging guard/policy check.
-   [x] `AC-010-F3-14` (`CA-K1`): add `.github/CODEOWNERS` for engine/OpenAPI/mock/gates critical paths.
-   [x] `AC-010-F3-15` (`CA-A1`): add explicit engine portability/boundary guardrail for `runtime|algorithms|registry|shared`.

#### Tests lane (execute after the Vitest baseline is in place)

-   [x] `AC-010-F3-16` (`CA-J1`): implement replay/golden determinism suite (including byte-equivalent snapshot assertions).
-   [x] `AC-010-F3-17` (`CA-J2`): implement concurrency stress suite for join/upsert/apply duplicate-event races.

### Verification

-   `yarn engine:test`
-   `yarn api-mock:coverage`
-   `yarn gateways:ownership`
-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn waivers:check`
-   `yarn validate`

---

## Final Acceptance Closure (2026-02-06)

### Closure checklist

-   [x] All `WP-010-F3` acceptance items complete (`AC-010-F3-01..18`).
-   [x] Unified P0 lane stable and green (`yarn test:p0`).
-   [x] Engine deterministic suites green (`yarn engine:test`).
-   [x] Full repository validation green (`yarn validate`).

### Final evidence

-   `yarn test:p0` -> PASS
-   `yarn engine:test` -> PASS
-   `yarn validate` -> PASS
