# Architecture Decision Records (ADR)

## Rules

-   Any change that affects architecture, build/tooling, packaging, API integration, auth/session, or cross-package boundaries MUST have an ADR.
-   Every ADR MUST include a Verification section.

## Index

| ADR  | Title                                                             | Status   | Date       | Scope        |
| ---- | ----------------------------------------------------------------- | -------- | ---------- | ------------ |
| 0001 | ADR process and decision logging                                  | Accepted | YYYY-MM-DD | repo         |
| 0002 | Testing policy (no UI tests)                                      | Accepted | YYYY-MM-DD | repo         |
| 0003 | Scalability and longevity (no explicit LOC cap)                   | Accepted | YYYY-MM-DD | repo         |
| 0004 | Enforce package dependency boundaries via ESLint                  | Accepted | YYYY-MM-DD | repo         |
| 0005 | vNext baseline (modern toolchain, TS-only sources)                | Accepted | 2026-01-28 | repo         |
| 0006 | OpenAPI is the single source of truth (contract-first)            | Accepted | 2026-01-28 | repo         |
| 0007 | Mock-first frontend development (backend last)                    | Accepted | 2026-01-28 | repo         |
| 0008 | Repo guardrails and CI validation gates                           | Accepted | 2026-01-29 | repo         |
| 0009 | API layering and mock implementation separation                   | Accepted | 2026-01-29 | repo         |
| 0010 | UI does not import API implementations                            | Accepted | 2026-01-29 | repo         |
| 0011 | Service catalog and layering (VS Code-grade)                      | Accepted | 2026-01-29 | repo         |
| 0012 | Work tracking guardrails                                          | Accepted | 2026-01-29 | repo         |
| 0013 | Greenfield development (breaking changes allowed)                 | Accepted | 2026-01-29 | repo         |
| 0014 | Canonical IDs and workspace package import names                  | Accepted | 2026-01-29 | repo         |
| 0015 | Agent entry guardrail (AGENTS.md + CURRENT required)              | Accepted | 2026-01-29 | repo         |
| 0016 | Instantiation service and scoped DI (VS Code-grade)               | Accepted | 2026-01-29 | repo         |
| 0017 | Repository artifacts policy (tracked vs local)                    | Accepted | 2026-01-29 | repo         |
| 0018 | HTTP mock server mode (contract-first) as @rankup/api-mock/server | Accepted | 2026-01-30 | repo         |
| 0019 | UI service injection via ProviderService (@service)               | Accepted | 2026-01-30 | apps/rankup-spa |
| 0020 | Inline decorator formatting guardrail for Lit fields              | Accepted | 2026-01-30 | repo         |
| 0021 | Import formatting guardrail (single-line, no blank separators)    | Accepted | 2026-01-31 | repo         |
| 0022 | VS Code-grade event + disposable system                           | Accepted | 2026-01-31 | repo         |
| 0023 | Lit css template indent guardrail                                 | Accepted | 2026-01-31 | repo         |
| 0024 | Lit css autofix + tabs (4 spaces)                                 | Accepted | 2026-01-31 | repo         |
| 0025 | Introduce @rankup/base and remove IEventBus                       | Accepted | 2026-01-31 | repo         |
| 0026 | ESLint flat config + import sorting alignment                     | Accepted | 2026-01-31 | repo         |
| 0027 | Extract platform into @rankup/platform                            | Accepted | 2026-01-31 | repo         |
| 0028 | API request flow standardization (UI -> domain -> API client)     | Accepted | 2026-01-31 | repo         |
| 0029 | Lit html template formatting guardrail + autofix                  | Accepted | 2026-01-31 | repo         |
| 0030 | Validate builds workspace deps for project references             | Accepted | 2026-01-31 | repo         |
| 0031 | Retire legacy app DataService                                     | Accepted | 2026-01-31 | apps/rankup-spa |
| 0032 | Defer API facade and network request service                      | Accepted | 2026-01-31 | repo         |
| 0033 | Enforce no UI IRankupApiClient + remove apiClient from AppServices | Accepted | 2026-01-31 | repo         |
| 0034 | Guardrail: UI packages must not call fetch                         | Accepted | 2026-01-31 | repo         |
| 0035 | Guardrail: UI packages must not import @rankup/api-mock             | Accepted | 2026-01-31 | repo         |
| 0036 | Guardrail: forbid @rankup/api-mock outside platform wiring        | Accepted | 2026-01-31 | repo         |
| 0037 | Platform exports + env.json.example copy for dev-server stability  | Superseded (ADR 0047) | 2026-01-31 | repo         |
| 0038 | Base exports mapping for runtime deep imports                      | Superseded (ADR 0047) | 2026-01-31 | repo         |
| 0039 | Api-mock exports map to dist for runtime                            | Superseded (ADR 0047) | 2026-01-31 | repo         |
| 0040 | Dev-server normalizes duplicate node_modules paths                | Superseded (ADR 0047) | 2026-01-31 | repo         |
| 0041 | VS Code multi-root workspace file                                 | Accepted | 2026-02-01 | repo         |
| 0042 | Introduce apps/ layer and split landing vs SPA                    | Accepted | 2026-02-02 | repo         |
| 0043 | Domain tourney umbrella + app-owned composition root              | Superseded (ADR 0049) | 2026-02-02 | repo         |
| 0044 | Internal game-mode registry + ruleset versioning                  | Accepted | 2026-02-02 | repo         |
| 0045 | Pin OpenAPI to 3.1.2 for toolchain compatibility                  | Accepted | 2026-02-02 | repo         |
| 0046 | Platform is infra-only (no product SDK imports)                   | Accepted | 2026-02-02 | repo         |
| 0047 | Apibase-style build + dev pipeline (tsc -b + rollup + WDS/esbuild) | Accepted | 2026-02-02 | repo         |
| 0048 | Domain DTOs + gateways (no @rankup/api in UI/domain)               | Accepted | 2026-02-02 | repo         |
| 0049 | Apibase-style domain layout inside @rankup/rankup                 | Accepted | 2026-02-03 | repo         |
| 0050 | OpenAPI change protocol + gateway mapping helpers                | Accepted | 2026-02-03 | repo         |
| 0051 | Tourney capability split (Hadron-style)                          | Accepted | 2026-02-03 | tourney domain |
| 0052 | Rename tourney domain folder to tournaments                      | Accepted | 2026-02-03 | packages/rankup |
| 0053 | Move rankings into the scoring domain                             | Accepted | 2026-02-03 | packages/rankup |
| 0054 | Scaffold Rankup Engine layers and domain placeholders             | Accepted | 2026-02-03 | packages/rankup |
| 0055 | Heads-Up is a tournament format (not a game mode)                 | Accepted | 2026-02-04 | OpenAPI + domains |
| 0056 | Operation Coverage Gate (OpenAPI ↔ Mock ↔ Gateways)               | Accepted | 2026-02-05 | repo         |
| 0057 | Rankup-web landing runtime and animation stack                    | Accepted | 2026-02-06 | apps/rankup-web |
| 0058 | Lit Localize msg() explicit-id policy and global guardrail        | Accepted | 2026-02-06 | repo         |

Note: ADR 0005 updated on 2026-01-29 to clarify composite TypeScript declaration requirements.
Note: ADR 0011 updated on 2026-01-29 to reference the DI normative document.
Note: ADR 0005 updated on 2026-01-29 to align api-mock composite declaration settings.
Note: ADR 0005 updated on 2026-01-30 to align ESLint 9 CLI usage for yarn lint (temporary lint excludes, lit-a11y + promise + import rules disabled, TS-only lint scope).
Note: ADR 0016 added on 2026-01-29; ADR 0017 is the artifacts policy after renumbering to avoid collision.
Note: ADR 0016 updated on 2026-01-29 to include UI lint enforcement for DI/compose root imports.
Note: ADR 0010 updated on 2026-01-29 to extend UI import restrictions (env, DI, platform browser).
Note: ADR 0006 updated on 2026-02-02 to move the canonical OpenAPI path to `packages/api/openapi.yaml`.
Note: ADR 0005 updated on 2026-01-30 to capture dev-server upgrades, app moduleResolution bundler, tslib runtime dependency, CSS rewrite support, workspace-local TypeScript for app scripts, CommonJS export for the dev-server TS config, TS-to-dist rewrite for workspace modules (including @rankup node_modules symlinks), Lit class-field mitigation, api-mock module metadata, and node_modules/@rankup -> /packages JS fallback.
Note: ADR 0005 updated on 2026-01-30 to map `/src/*` export paths to `dist/*` in the dev-server rewrite (prevents TS MIME errors for TS-only exports).
Note: ADR 0018 added on 2026-01-30 (HTTP mock server mode).
Note: ADR 0018 amended on 2026-01-30 to record the openapi-backend spike failure, fallback stack decision, and fallback spike PASS; openapi-backend removed.
Note: ADR 0019 added on 2026-01-30 to allow UI service injection via ProviderService/@service.
Note: ADR 0020 added on 2026-01-30 to enforce inline decorator formatting via guardrails.
Note: UI packages definition lives in `docs/architecture/ui-packages.md`.
Note: ADR 0030 updated on 2026-02-03 to keep workspace outputs through app validate and clean at the end of `yarn validate`.
Note: ADR 0047 updated on 2026-02-03 to use WDS `.mjs` configs (TS-only exception), ensure wireit is available in app packages, and allow explicit app root via `createWebDevServerConfig`.
