# WP-008-29: P0 Testing Parity 1:1 (Architect Recipe)

## Status

-   Status: Completed (`PR-001` + `PR-002` + `PR-003` + `PR-004` + `PR-005` + `PR-006` + `PR-007` completed)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-08
-   Depends on: Epic 008 support lane, existing P0 baseline (`yarn test:p0`)

## Objective

Reach strict 1:1 parity with the architect manager P0 testing recipe by executing the PR sequence below without weakening any guardrail.

## Scope

-   This plan is execution-focused: PR-by-PR checklist, exact target files, and measurable closure criteria.
-   This plan is a delta over the already shipped P0 lane (Vitest/testkit/CI guardrails already present).

## PR Sequence (Required Order)

### PR-001: Baseline + tracking unblock

Goal:
-   Restore runnable baseline for structural execution by fixing work-log guardrail requirements.

Target files:
-   `docs/work/log/2026-02-08.md`
-   `docs/work/CURRENT.md`
-   `docs/work/epics/008-domain-tournament-boundaries.md`
-   `AGENTS.md`

Checklist:
-   [x] Record current `yarn validate` baseline FAIL reason in today log.
-   [x] Keep Epic 008 as active lane and set WP-008-29 as active packet.
-   [x] Ensure all tracking documents are aligned before code changes.

Acceptance:
-   [x] `yarn validate` no longer fails on `repo:work-log`.

Verification evidence (2026-02-08):
-   `yarn validate` -> FAIL (initial guardrail state; missing same-day log)
-   `yarn validate` -> PASS

### PR-002: Mapper error mapping parity (`Problem -> DomainError`)

Goal:
-   Convert mapper P0 suites from fixture-shape checks to real error mapping checks.

Target files:
-   `apps/rankup-spa/services/api/problem/mapProblemToDomainError.ts` (new)
-   `packages/rankup/src/domains/shared/errors/domainError.ts` (new)
-   `apps/rankup-spa/services/api/tournaments/tournament-mappers.ts`
-   `apps/rankup-spa/services/api/submissions/submissions-mappers.ts`
-   `apps/rankup-spa/services/api/engagement/stats-mappers.ts`
-   `apps/rankup-spa/services/api/tournaments/__tests__/p0/mappers/tournamentPreview.mapper.test.ts`
-   `apps/rankup-spa/services/api/tournaments/__tests__/p0/mappers/joinTournament.mapper.test.ts`
-   `apps/rankup-spa/services/api/tournaments/__tests__/p0/mappers/matchdayAvailability.mapper.test.ts`
-   `apps/rankup-spa/services/api/submissions/__tests__/p0/mappers/matchdaySubmission.mapper.test.ts`
-   `apps/rankup-spa/services/api/submissions/__tests__/p0/mappers/upsertMatchdaySubmissionResult.mapper.test.ts`
-   `apps/rankup-spa/services/api/tournaments/__tests__/p0/mappers/tournamentRankingPage.mapper.test.ts`
-   `apps/rankup-spa/services/api/engagement/__tests__/p0/mappers/matchdayResults.mapper.test.ts`
-   `apps/rankup-spa/services/api/tournaments/__tests__/p0/mappers/invitationCodeResolution.mapper.test.ts`
-   `apps/rankup-spa/services/api/tournaments/__tests__/p0/mappers/myTournamentInvite.mapper.test.ts`

Checklist:
-   [x] Keep the existing success DTO->domain assertions.
-   [x] Add explicit error mapping assertions to canonical domain errors (`NotFound`, `SubmissionLocked`, `ValidationFailed`, etc).
-   [x] Keep `assertNoUndefinedDeep` on all success outputs.

Acceptance:
-   [x] Each mapper suite has at least one success case and one real error-mapping case.

Verification evidence (2026-02-08):
-   `yarn vitest run -c vitest.p0.config.ts <9 mapper suites>` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-003: Contract passthrough parity (idempotency + If-Match)

Goal:
-   Verify contract-layer propagation of idempotency and optimistic concurrency semantics.

Target files:
-   `packages/rankup/src/domains/tournaments/members/models/members.ts`
-   `packages/rankup/src/domains/submissions/scorePrediction/models/submissions.ts`
-   `apps/rankup-spa/services/api/tournaments/tournament-members-gateway.ts`
-   `apps/rankup-spa/services/api/submissions/tournament-submissions-gateway.ts`
-   `apps/rankup-spa/services/api/http-client.ts`
-   `packages/api/src/client.ts`
-   `packages/rankup/test/testkit/fakes/fakeTournamentsGateway.ts`
-   `packages/rankup/test/testkit/fakes/fakeSubmissionsGateway.ts`
-   `packages/rankup/test/__tests__/p0/contracts/tournaments.contract.test.ts`
-   `packages/rankup/test/__tests__/p0/contracts/submissions.contract.test.ts`

Checklist:
-   [x] Contract tests verify join idempotency-key passthrough.
-   [x] Contract tests verify submission If-Match passthrough (and idempotency where supported).
-   [x] Error mapping assertions remain in each contract suite.

Acceptance:
-   [x] Tournaments/submissions contract suites explicitly assert header passthrough semantics.

Verification evidence (2026-02-08):
-   `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/contracts/tournaments.contract.test.ts packages/rankup/test/__tests__/p0/contracts/submissions.contract.test.ts` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-004: Smoke flow parity (`ranking -> results`)

Goal:
-   Align smoke flow #3 exactly to architect recipe (`ranking -> results`) instead of stats.

Target files:
-   `packages/rankup/test/__tests__/p0/smoke/flows.smoke.test.ts`
-   `packages/rankup/src/domains/scoring/results/**` (new/updated as required)
-   `packages/rankup/src/domains/scoring/registerScoringDomainServices.ts`
-   `apps/rankup-spa/lib/composition-root.ts`
-   `apps/rankup-spa/lib/app-services.ts`
-   `apps/rankup-spa/services/api/scoring/results-mappers.ts` (new)
-   `apps/rankup-spa/services/api/scoring/tournament-results-gateway.ts` (new)
-   `apps/rankup-spa/services/api/tournaments/tournament-ranking-gateway.ts` (owner split for results operation ownership)

Checklist:
-   [x] Flow 1 remains: discovery -> preview -> join.
-   [x] Flow 2 remains: availability -> upsert -> get submission.
-   [x] Flow 3 becomes: matchday ranking -> my results (not stats).
-   [x] Smoke still uses real composition root + programmatic api-mock.

Acceptance:
-   [x] Smoke suite executes the three required flows exactly as defined by the architect recipe.

Verification evidence (2026-02-08):
-   `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/smoke/flows.smoke.test.ts` -> PASS
-   `yarn test:p0` -> PASS

### PR-005: Dynamic gateway ratchet parity

Goal:
-   Replace static required-test list with dynamic detection of new gateways missing mapper suites.

Target files:
-   `scripts/test-guardrails-p0.ts`
-   `scripts/repo-guardrails.ts`

Checklist:
-   [x] Scan gateway patterns under `packages/**` and `apps/**/services/api/**`.
-   [x] Enforce mapper test presence by deterministic naming rule.
-   [x] Keep `.only` / `.skip` rejection for all P0 suites.

Acceptance:
-   [x] A newly added `*Gateway.ts` without matching mapper P0 test fails guardrails.

Verification evidence (2026-02-08):
-   `yarn test:guardrails:p0` -> PASS
-   `yarn test:guardrails:p0` with temporary `apps/rankup-spa/services/api/tournaments/ratchet-check-gateway.ts` (no mapper suite) -> FAIL as expected (new gateway ratchet enforced)
-   `yarn validate` -> PASS

### PR-006: Determinism and budget gates

Goal:
-   Promote deterministic and time-budget requirements into enforceable gates.

Target files:
-   `scripts/test-p0-determinism.ts` (new)
-   `scripts/test-p0-budget.ts` (new)
-   `package.json`
-   `.github/workflows/test-p0.yml`
-   `docs/engineering/testing-p0.md`

Checklist:
-   [x] Fail on direct `Date.now()`, `Math.random()`, `setTimeout`/sleep usage in P0 scope unless explicitly allowlisted.
-   [x] Enforce global P0 runtime budget (<= 7 minutes in CI).
-   [x] Document layer budgets and gate behavior in testing docs.

Acceptance:
-   [x] CI enforces deterministic and budget rules automatically.

Verification evidence (2026-02-08):
-   `yarn test:determinism:p0` -> PASS
-   `yarn test:budget:p0` -> PASS
-   `yarn test:p0:ci` -> PASS
-   `yarn test:determinism:p0` with temporary `packages/testkit/src/__tests__/p0/sanity/determinism-fail.test.ts` using `Date.now()` -> FAIL as expected (determinism guard enforced)
-   `P0_BUDGET_TOTAL_MS=1 yarn test:budget:p0` -> FAIL as expected (budget gate enforced)
-   `yarn validate` -> PASS

### PR-007: Global closure and evidence lock

Goal:
-   Close WP-008-29 only when all acceptance criteria A-E are proven.

Target files:
-   `docs/work/log/2026-02-08.md` (or current day at closure time)
-   `docs/work/CURRENT.md`
-   `docs/work/epics/008-domain-tournament-boundaries.md`
-   `AGENTS.md`

Checklist:
-   [x] Run and record `yarn test:guardrails:p0`.
-   [x] Run and record `yarn test:p0`.
-   [x] Run and record `yarn engine:test`.
-   [x] Run and record `yarn validate`.
-   [x] Mark WP closure in Epic 008 and CURRENT.

Acceptance:
-   [x] Closure evidence is present and reproducible from docs only.

Verification evidence (2026-02-08):
-   `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/contracts/scoring.contract.test.ts` -> PASS
-   `yarn test:guardrails:p0` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn engine:test` -> PASS
-   `yarn validate` -> PASS

## Final Success Criteria (Strict, Measurable)

### A) Structural coverage

-   [x] Mapper safety net:
    -   [x] 9 core mapper suites exist and run.
    -   [x] Each suite has success + real error mapping assertions.
    -   [x] Discriminator variants for `scorePrediction` are explicitly covered.
-   [x] Domain contract safety net:
    -   [x] 3 suites exist (`tournaments`, `submissions`, `scoring`).
    -   [x] Each suite has >=2 success + >=1 error mapping test.
    -   [x] Idempotency and/or If-Match passthrough assertions are explicit.
-   [x] DI smoke safety net:
    -   [x] Real composition root is exercised.
    -   [x] Flows: discovery->preview->join, availability->upsert->submission, ranking->results.
-   [x] Streaming safety net:
    -   [x] dedupe by `eventId`.
    -   [x] reconnect by `sinceCursor`.
    -   [x] ordering policy validated by `aggregateVersion`.

### B) Determinism

-   [x] Global setup sets `process.env.TZ = "UTC"`.
-   [x] P0 lane forbids arbitrary sleeps.
-   [x] P0 lane has no uncontrolled runtime randomness/time.
-   [x] Network is disabled by default and explicitly re-enabled only in smoke harness.

### C) Performance budgets

-   [x] `yarn test:p0` <= 7 minutes in CI.
-   [x] Layer budgets documented and enforced:
    -   [x] mappers <= 90s
    -   [x] contracts <= 120s
    -   [x] smoke <= 180s
    -   [x] streaming <= 60s

### D) Enforcement system

-   [x] Dynamic gateway ratchet enforced.
-   [x] `.only`/`.skip` blocked in P0 suites.
-   [x] CI blocks merges on guardrail or `test:p0` failure.

### E) Failure quality

-   [x] Mapper failures provide readable expected/actual diff.
-   [x] DI smoke failures expose actionable binding/wiring context.
-   [x] Streaming failures identify cursor/event/version contract break.

## Verification Commands (Closure)

-   `yarn test:guardrails:p0`
-   `yarn test:p0`
-   `yarn engine:test`
-   `yarn validate`
