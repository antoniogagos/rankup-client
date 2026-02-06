# Apibase alignment analysis for Rankup (architecture brief review)

## Purpose

Analyze Apibase architecture patterns that can accelerate or harden Rankup. The goal is VSCode-grade scalability for a front-first, mock-first client. Source: `apibase-architecture-brief.md`.

## Key Apibase patterns worth reusing

1) **Apps vs packages split (marketing vs SPA)**
- Apibase uses separate apps for marketing/landing and main SPA (e.g. `apps/apibase` vs `apps/apibase-spa`).
- Rankup now uses `apps/rankup-web` (landing) and `apps/rankup-spa` (SPA); legacy `packages/app` has been removed.
- Keep the apps/ split as the long-term structure to isolate SEO/landing concerns from the product SPA.

2) **Domain modularization with import rules**
- Apibase isolates domain logic under `packages/apibase/domains` with explicit import constraints.
- Rankup currently keeps most domain concerns in `packages/platform` and UI code.
- Potential reuse: define domain packages or submodules with explicit boundaries and ownership.

3) **Workbench/extensibility model**
- Apibase uses a workbench framework + extensions host (workers/iframe) for isolation.
- Rankup has no extension model, but long term might need modularity for game modes and sports.
- Potential reuse: adopt a lightweight extension contract for game modes, isolated by runtime boundaries.

4) **Worker + Comlink for heavy tasks**
- Apibase offloads OpenAPI parsing, git, and heavy tasks to workers via Comlink.
- Rankup can adopt workers for heavy mock generation, spec validation, or large computations (rankings).

5) **Tooling orchestration**
- Apibase uses wireit for task orchestration and caching.
- Rankup uses yarn scripts + `tsc -b`, with wireit now driving app start/build scripts.
- Potential reuse: expand wireit only if it improves build times without breaking guardrails.

6) **Dev server config for isolation (COOP/COEP)**
- Apibase uses COOP/COEP in dev server to enable SharedArrayBuffer and worker isolation.
- Rankup dev server now sets COOP/COEP in the shared WDS config.
- Potential reuse: keep as baseline if/when workers or advanced isolation are needed.

7) **Multi-app config per runtime**
- Apibase uses app-specific `config.json` / `env.json` and injection in dev server.
- Rankup uses platform-level `env.json.example` with WDS injecting `__APP_ENV__`; no per-app config yet.
- Potential reuse: standardize per-app config and environment layering for future apps.

## Gaps in Rankup vs Apibase (architectural)

- **No app-layer separation**: resolved — Rankup now has `apps/rankup-web` + `apps/rankup-spa`.
- **Domain boundaries are shallow**: mitigated — introduced `packages/rankup/src/domains/tournaments` with explicit import rules; remaining domains pending.
- **No isolation for heavy tasks**: no worker architecture for large computations or future editors/visual flows.
- **Spec / tooling drift risk**: Apibase is contract-first with explicit codegen tools; Rankup has spec drift issues that must be resolved before scale.
- **Extensibility plan**: deferred — internal game-mode registry + versioned rulesets are required; external extension host is not needed yet (pending ruleset compatibility/migration policy).

## Recommendations for Rankup (alignment plan)

### Short-term (0-2 WPs)
1) **Introduce apps/ split**
- Done: `apps/rankup-web` (landing/marketing) and `apps/rankup-spa` (main app).
- Benefit: clearer separation, easier SEO/landing isolation, VSCode-grade structure.

2) **Define domain boundaries under an app-level package**
- Done: `packages/rankup/src/domains/tournaments` under `packages/rankup` with contracts/browser/mock/test and guardrails.
- Import rule: UI → domain contracts → domain implementations → platform (infra-only).

### Medium-term (2-4 WPs)
3) **Worker strategy**
- Identify heavy tasks (mock data generation, ranking simulations, spec validation) and move to workers using Comlink.
- Ensure dev server and build pipeline support worker assets.

4) **Extensibility contract for game modes**
- Deferred: no external extension host/manifest yet.
- Required now: internal game-mode registry + versioned rulesets; stable interface for UI/services.
- Open questions: ruleset backward compatibility (replays/historical ranking) and data migration policy across ruleset versions.

### Long-term (post MVP)
5) **Task orchestration**
- Evaluate wireit/turbo only after performance bottlenecks appear, keep guardrails stable.

## Concrete repo deltas (if adopted)

- Add `apps/` directory with two apps (landing + spa).
- Add `packages/rankup/src/domains/*` with import rules.
- Add worker infrastructure in `packages/base/worker` (or reuse existing `@rankup/base`).
- Update guardrails + ADRs for new structure.

## Risks / trade-offs

- More packages = more overhead in build graphs and guardrails.
- Introducing apps/ split requires build + dev server changes and may break existing workflows.
- Domain packages without clear ownership can increase duplication.

## Suggested next decisions

1) Confirm if Rankup should adopt an **apps/ layer** (landing + SPA) like Apibase.
2) Decide between **domain packages** vs **platform submodules** for domain isolation.
3) Decide if worker architecture is required in the first scale phase.

## Deep alignment notes (Apibase -> Rankup)

### A) App topology, SEO, and deploy boundaries

- **Apibase**: explicit `apps/*` separation (marketing site vs SPA vs auth), each with its own config and deploy cadence.
- **Rankup current**: apps split (`apps/rankup-web` + `apps/rankup-spa`) with clear landing/SPA boundary.
- **Alignment action**: keep `apps/rankup-web` (marketing/SEO) and `apps/rankup-spa` (product app), with shared UI only in packages.
- **Key decision**: whether to split auth UI into its own app (Apibase has `apibase-auth`), or keep auth within SPA.

### B) Domain modularization + import rules

- **Apibase**: domain isolation under `packages/apibase/domains/*` with strict import rules.
- **Rankup current**: domain concerns primarily live in `packages/platform` and UI.
- **Alignment action**: define app-level domain modules (e.g. `packages/rankup/src/domains/tournaments`, `packages/rankup/src/domains/submissions`, `packages/rankup/src/domains/scoring`) with explicit import guardrails.
- **Outcome**: reduces cross-domain coupling and clarifies ownership of specs, mocks, and services.

### C) Extensibility model for game modes & sports

- **Apibase**: extension host + activation events; strong isolation via worker/iframe.
- **Rankup current**: no extension host; future need for game modes and sports extensibility.
- **Alignment action**: keep extensibility deferred; implement an internal registry + versioned rulesets, and revisit external activation/manifest only when needed.

### D) Worker strategy for heavy compute

- **Apibase**: Comlink + workers for spec, git, prettier; avoids UI jank.
- **Rankup current**: no worker pipeline; heavy tasks will grow (rankings, large lists, validation).
- **Alignment action**: add a base worker helper in `@rankup/base` and reserve worker slots for ranking simulations, large fixture ingest, or mock data generation.
- **Prereq**: consider COOP/COEP headers if SharedArrayBuffer or advanced isolation is required.

### E) Tooling orchestration & build graph

- **Apibase**: wireit coordinates build/test/lint with cache and dep graphs.
- **Rankup current**: yarn scripts + `tsc -b`.
- **Alignment action**: keep current toolchain until build latency becomes a bottleneck; only then consider wireit/turbo with clear guardrails.

### F) Config & environment layering

- **Apibase**: `env.json` / `config.json` per app; dev-server injects runtime config.
- **Rankup current**: platform-level `env.json.example` with WDS `__APP_ENV__` injection, no per-app config.
- **Alignment action**: standardize per-app config files and inject them per app in dev/build.
- **Note**: keep runtime config minimal; prefer build-time injection unless a CDN/edge use-case demands runtime config.

### G) Testing and quality gates

- **Apibase**: Vitest + Playwright, browser mode tests.
- **Rankup constraint**: no UI tests (ADR 0002), only algorithm/contract tests.
- **Alignment action**: enforce contract and mock parity tests (OpenAPI lint, mock schema validation), and add pure algorithmic tests for ranking/rules.

### H) Governance & documentation

- **Apibase**: explicit architecture brief + repository map.
- **Rankup current**: ADRs + architecture docs exist, but no consolidated architecture brief.
- **Alignment action**: maintain `docs/diagnostics/APIBASE-ALIGNMENT.md` as the bridge document and keep `docs/diagnostics/REPO-TREE.md` updated.

## Reusable Apibase patterns (transferable to Rankup)

- **Apps vs packages split** to isolate public landing from product app.
- **Domain boundaries** with import rules to scale teams and reduce coupling.
- **Worker-first approach** for heavy compute and non-UI tasks.
- **Per-app config** and environment injection for multi-app deployments.
- **Clear repo map + architecture brief** for onboarding and cross-team alignment.

## Patterns not recommended to copy directly

- **Missing CI / disabled pre-commit hooks** in the Apibase repo should not be replicated.
- **Hardcoded deploy endpoints** should be replaced by config or infra-managed values.
- **Full extension host** is likely overkill until game-mode/sport modularity is proven.

## Suggested Rankup actions (prioritized)

1) **Confirm app split scope**: finalize `apps/rankup-web` + `apps/rankup-spa`, and decide if auth gets its own app.
2) **Choose domain isolation strategy**: `packages/domain-*` vs `platform/domains/*`, and enforce import guardrails.
3) **Define worker candidates**: rankings, mock data generation, large dataset transforms.
4) **Standardize per-app config**: `env.json` / `config.json` per app with controlled injection.
5) **Add a consolidated architecture brief** for Rankup similar to Apibase (if needed for onboarding).

## Sources

- `apibase-architecture-brief.md`
- `docs/diagnostics/REPO-TREE.md`
- `docs/architecture/mock-server.md`
- `docs/architecture/services.md`
- `docs/work/CURRENT.md`
