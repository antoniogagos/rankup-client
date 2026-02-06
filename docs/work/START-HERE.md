# START HERE (Agent golden path) — Inviolable

This is the single, canonical onboarding for agents and contributors.

If you do NOT follow this file, you will:

-   duplicate work,
-   break architectural invariants,
-   or create changes that cannot be verified.

---

## 0) What Rankup is (30 seconds)

Rankup is a frontend-first, mock-first tournament social gaming client.

**Non-negotiable repo constraints**

-   OpenAPI is the source of truth (ADR 0006).
-   Mock-first development is mandatory (ADR 0007).
-   No UI tests (ADR 0002).
-   TS-only tracked sources & configs (ADR 0005) — currently being enforced progressively (see CURRENT + Epic 005).
-   UI packages must not import API implementations (ADR 0010).
-   VS Code-grade services + scoped DI model (ADR 0016 + docs/architecture/di.md).

---

## 1) Mandatory entry procedure (do in this order)

1. Read `docs/work/CURRENT.md`
2. Open the active epic file referenced by CURRENT (e.g. `docs/work/epics/00X-*.md`)
3. Read the latest daily log in `docs/work/log/`
4. Pick the relevant Codex skill from `.codex/skills/README.md`
5. Run the verification command:
    - `yarn validate`

**STOP if you cannot do step (4).**
Do not start new structural work if `yarn validate` cannot be executed in your environment.
Record the failure in today’s log and fix the toolchain first (usually Epic 005 territory).

---

## 2) “One way to work” (daily loop)

### Step A — Pick a work packet (WP)

-   Each epic must be broken into WPs.
-   Pick ONE WP and finish it fully before touching the next.
-   If the epic does not have WPs, your first task is to create them (docs-only change).

### Step B — Implement narrowly

-   Touch only the files described by your WP.
-   Do not “drive-by refactor”.
-   Do not introduce new architecture without an ADR.

### Step C — Verify

Run:

-   `yarn validate`

If relevant, also run the ripgrep checks listed in the epic Acceptance Criteria.

### Step D — Update tracking (mandatory)

For any structural change:

-   Update `docs/work/CURRENT.md` (status/notes if relevant)
-   Update the active epic file (mark WP progress)
-   Add or update today’s log under `docs/work/log/YYYY-MM-DD.md`
-   Update `AGENTS.md` if the entry procedure or agent rules changed (ADR 0015)

---

## 3) What counts as a “structural change” (requires protocol)

Structural change = any change that affects:

-   architecture boundaries / DI / services model
-   build/tooling/scripts/CI
-   packaging/workspaces/import rules
-   API integration patterns or mock/real selection
-   auth/session architecture
-   guardrails and validation gates

Structural changes MUST follow `docs/engineering/structural-change-protocol.md`
and usually require a new/updated ADR + ADR index update.

---

## 4) Architecture invariants (do not violate)

### UI invariants

UI packages definition: `docs/architecture/ui-packages.md`

UI packages MUST NOT:

-   import platform implementations (`packages/platform/src/**/browser/**`)
-   import DI primitives (`packages/platform/src/instantiation/**`)
-   import env directly (`packages/platform/src/environment/browser/env.ts`)
-   import API runtimes (`@rankup/api-mock`, http client factories, openapi-fetch runtime)
-   call `fetch()` directly

UI packages SHOULD:

-   depend on controllers/services (created via instantiation service)
-   remain thin: rendering + events + calling a controller

### Platform/service model invariants

-   Contracts live in `packages/platform/src/**/common/**`
-   Implementations live in `packages/platform/src/**/browser/**`
-   Composition root is the only selector of implementations (mock vs real)
-   Scopes are explicit (app-scope now, tourney-scope later)

---

## 5) If you’re unsure or blocked

-   Check `docs/adr/PENDING.md` and either add a new pending item or add “info required”.
-   Record the block in today’s log with:
    -   what you tried,
    -   the exact error output,
    -   what info is missing.

Do not invent architecture to “unblock yourself”.

---

## 6) Commands you will use often

-   Install: `corepack enable && yarn install`
-   Verify: `yarn validate`
-   Lint only (if available): `yarn lint`
-   OpenAPI: `yarn openapi:lint && yarn openapi:check`

---

## 7) Definition of done for any WP

A WP is done only when:

-   `yarn validate` passes
-   All epic-specific rg checks pass (if defined)
-   Work log is updated with verification evidence
-   Any necessary docs (ADR/catalog/CURRENT) are updated
