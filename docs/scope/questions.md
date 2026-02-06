# Repo tree (monorepo snapshot)

Generado para el analisis del equipo de VS Code. Este tree representa la estructura completa del repo excluyendo artefactos locales pesados.

## Exclusions

- `node_modules/`
- `.git/`
- `.yarn/`
- `dist/`
- `.DS_Store`

## Comando usado

```bash
tree -a --charset=ascii -I '.git|node_modules|dist|.yarn|.DS_Store'
```

## Tree

```text
.
|-- .codex
|   `-- skills
|       |-- README.md
|       |-- rankup-composition-root
|       |   `-- SKILL.md
|       |-- rankup-di-primitives
|       |   `-- SKILL.md
|       |-- rankup-domain-tourney-service
|       |   `-- SKILL.md
|       |-- rankup-epic-002
|       |   `-- SKILL.md
|       |-- rankup-epic-002-composition-root
|       |   `-- SKILL.md
|       |-- rankup-epic-002-di-foundation
|       |   `-- SKILL.md
|       |-- rankup-epic-002-guardrails-eslint
|       |   `-- SKILL.md
|       |-- rankup-epic-002-ui-bridge
|       |   `-- SKILL.md
|       |-- rankup-eslint-import-guardrails
|       |   `-- SKILL.md
|       |-- rankup-home-vertical-slice
|       |   `-- SKILL.md
|       |-- rankup-mock-first
|       |   `-- SKILL.md
|       |-- rankup-mock-http-server
|       |   `-- SKILL.md
|       |-- rankup-openapi-first
|       |   `-- SKILL.md
|       |-- rankup-repo-workflow
|       |   `-- SKILL.md
|       |-- rankup-structural-change
|       |   `-- SKILL.md
|       |-- rankup-ui-appservices-bridge
|       |   `-- SKILL.md
|       |-- rankup-work-logging
|       |   `-- SKILL.md
|       `-- vscode-component-conventions
|           `-- SKILL.md
|-- .editorconfig
|-- .github
|   |-- copilot-instructions.md
|   |-- pull_request_template.md
|   `-- workflows
|       |-- ci.yml
|       `-- copilot-setup-steps.yml
|-- .gitignore
|-- .husky
|   `-- pre-commit
|-- .nvmrc
|-- .prettierignore
|-- .spectral.yaml
|-- .vscode
|   |-- extensions.json
|   `-- settings.json
|-- .yarnrc.yml
|-- AGENTS.md
|-- CONSTITUTION.md
|-- README.md
|-- apibase-architecture-brief.md
|-- apps
|   |-- rankup-spa
|   |   |-- assets
|   |   |   |-- README.md
|   |   |   |-- avatars
|   |   |   |   |-- bulbasaur.svg
|   |   |   |   |-- bulbasur.svg
|   |   |   |   |-- fighter.svg
|   |   |   |   |-- ironman.svg
|   |   |   |   |-- rocket.svg
|   |   |   |   `-- tree.svg
|   |   |   |-- icons
|   |   |   |   `-- rk-logo.svg
|   |   |   |-- images
|   |   |   |   |-- ball-bg.avif
|   |   |   |   |-- bronze-medal.svg
|   |   |   |   |-- champions-league.svg
|   |   |   |   |-- gold-medal.svg
|   |   |   |   |-- laliga.svg
|   |   |   |   |-- premier-league.svg
|   |   |   |   |-- rk-logo-splash.svg
|   |   |   |   |-- rk-logo-with-bg.svg
|   |   |   |   `-- silver-medal.svg
|   |   |   |-- patterns
|   |   |   |   |-- champions-league.svg
|   |   |   |   |-- laliga.svg
|   |   |   |   `-- premier-league.svg
|   |   |   `-- teams
|   |   |       |-- betis.png
|   |   |       `-- sevilla.png
|   |   |-- authenticated-icons.ts
|   |   |-- definitions.d.ts
|   |   |-- elements
|   |   |   |-- app-router
|   |   |   |   |-- app-router.ts
|   |   |   |   |-- appRouter.ts
|   |   |   |   |-- events.types.d.ts
|   |   |   |   |-- styles.css
|   |   |   |   `-- types.d.ts
|   |   |   |-- rk-app-header
|   |   |   |   `-- rk-app-header.ts
|   |   |   |-- rk-auth-wall
|   |   |   |   `-- rk-auth-wall.ts
|   |   |   |-- rk-drawer
|   |   |   |   `-- rk-drawer.ts
|   |   |   |-- rk-match-row
|   |   |   |   `-- rk-match-row.ts
|   |   |   |-- rk-tourney-footer
|   |   |   |   `-- rk-tourney-footer.ts
|   |   |   |-- rk-tourney-header
|   |   |   |   `-- rk-tourney-header.ts
|   |   |   |-- rk-tourney-list
|   |   |   |   `-- rk-tourney-list.ts
|   |   |   |-- rk-tourney-matchday
|   |   |   |   |-- rk-tourney-matchday-live.ts
|   |   |   |   `-- rk-tourney-matchday-not-started.ts
|   |   |   `-- score-bets
|   |   |       |-- rk-sb-bet-match
|   |   |       |   `-- rk-sb-bet-match.ts
|   |   |       |-- rk-sb-match-details
|   |   |       |   |-- rk-sb-live-match-details.ts
|   |   |       |   `-- rk-sb-unstarted-match-details.ts
|   |   |       `-- rk-sb-match-players-bets
|   |   |           `-- rk-sb-match-players-bets.ts
|   |   |-- index.html
|   |   |-- lib
|   |   |   |-- app-services.ts
|   |   |   |-- composition-root.ts
|   |   |   |-- data-service
|   |   |   |-- lit-directives
|   |   |   |   `-- lazy-load-directive.ts
|   |   |   |-- localization
|   |   |   |   |-- localization.ts
|   |   |   |   `-- rk-url-paths.ts
|   |   |   |-- mock-banner.ts
|   |   |   |-- public-navigation.ts
|   |   |   `-- utils
|   |   |       |-- calculate-odds-handicap.ts
|   |   |       |-- css-color-scheme.ts
|   |   |       |-- has-matchday-started.ts
|   |   |       |-- paths.ts
|   |   |       `-- tourney-path.ts
|   |   |-- lit-localize.json
|   |   |-- main.ts
|   |   |-- package.json
|   |   |-- pages
|   |   |   |-- 404
|   |   |   |   `-- rk-404-page.ts
|   |   |   |-- access
|   |   |   |   |-- rk-confirm-registration-page.ts
|   |   |   |   |-- rk-forgot-password-page.ts
|   |   |   |   |-- rk-reset-password-page.ts
|   |   |   |   |-- rk-signin-page.ts
|   |   |   |   `-- rk-signup-page.ts
|   |   |   |-- create-tourney
|   |   |   |   `-- rk-create-tourney-page.ts
|   |   |   |-- home
|   |   |   |   `-- rk-home-page.ts
|   |   |   |-- join-tourney
|   |   |   |   `-- rk-join-tourney-page.ts
|   |   |   |-- tourney
|   |   |   |   |-- pages
|   |   |   |   |   |-- rk-sb-rules.ts
|   |   |   |   |   |-- rk-share-tourney.ts
|   |   |   |   |   |-- rk-tourney-chat.ts
|   |   |   |   |   |-- rk-tourney-matchday.ts
|   |   |   |   |   |-- rk-tourney-ranking.ts
|   |   |   |   |   `-- rk-tourney-settings.ts
|   |   |   |   `-- rk-tourney-page.ts
|   |   |   `-- welcome
|   |   |       `-- rk-welcome-page.ts
|   |   |-- rk-app.ts
|   |   |-- rk-unauthenticated-app.ts
|   |   |-- router-animations.ts
|   |   |-- services
|   |   |   `-- api
|   |   |       |-- create-rankup-api-client.ts
|   |   |       |-- gateway-mapping.ts
|   |   |       |-- http-client.ts
|   |   |       `-- tourney
|   |   |           |-- tourney-core-gateway.ts
|   |   |           |-- tourney-invitation-codes-gateway.ts
|   |   |           |-- tourney-invites-gateway.ts
|   |   |           |-- tourney-mappers.ts
|   |   |           |-- tourney-matchdays-gateway.ts
|   |   |           |-- tourney-members-gateway.ts
|   |   |           `-- tourney-ranking-gateway.ts
|   |   |-- src
|   |   |-- test
|   |   |-- tsconfig.json
|   |   |-- types
|   |   |   `-- types.ts
|   |   |-- unauthenticated-icons.ts
|   |   `-- web-dev-server.config.mjs
|   `-- rankup-web
|       |-- index.html
|       |-- package.json
|       |-- src
|       |   `-- index.ts
|       |-- tsconfig.json
|       `-- web-dev-server.config.mjs
|-- assets
|   |-- README.md
|   |-- avatars
|   |   |-- .gitkeep
|   |   |-- bulbasaur.svg
|   |   |-- fighter.svg
|   |   |-- ironman.svg
|   |   |-- rocket.svg
|   |   `-- tree.svg
|   |-- icons
|   |   |-- .gitkeep
|   |   `-- rk-logo.svg
|   |-- images
|   |   |-- .gitkeep
|   |   |-- ball-bg.avif
|   |   |-- bronze-medal.svg
|   |   |-- champions-league.svg
|   |   |-- gold-medal.svg
|   |   |-- laliga.svg
|   |   |-- premier-league.svg
|   |   |-- rk-logo-splash.svg
|   |   |-- rk-logo-with-bg.svg
|   |   `-- silver-medal.svg
|   |-- patterns
|   |   |-- champions-league.svg
|   |   |-- laliga.svg
|   |   `-- premier-league.svg
|   `-- teams
|       |-- .gitkeep
|       |-- betis.png
|       `-- sevilla.png
|-- docs
|   |-- README.md
|   |-- adr
|   |   |-- 0000-template.md
|   |   |-- 0001-adr-process.md
|   |   |-- 0002-testing-policy.md
|   |   |-- 0003-scalability-and-longevity.md
|   |   |-- 0004-package-dependency-boundaries.md
|   |   |-- 0005-vnext-baseline.md
|   |   |-- 0006-openapi-source-of-truth.md
|   |   |-- 0007-mock-first-development.md
|   |   |-- 0008-repo-guardrails.md
|   |   |-- 0009-api-layering-and-mock-implementation.md
|   |   |-- 0010-ui-does-not-import-api-implementations.md
|   |   |-- 0011-service-catalog-and-layering.md
|   |   |-- 0012-work-tracking-guardrails.md
|   |   |-- 0013-greenfield-breaking-changes-allowed.md
|   |   |-- 0014-canonical-ids-and-package-imports.md
|   |   |-- 0015-agent-entry-guardrail.md
|   |   |-- 0016-instantiation-service-and-scopes.md
|   |   |-- 0017-repo-artifacts-policy.md
|   |   |-- 0018-mock-http-server-mode.md
|   |   |-- 0019-ui-service-injection-provider.md
|   |   |-- 0020-inline-decorator-guardrail.md
|   |   |-- 0021-import-formatting-guardrail.md
|   |   |-- 0022-event-disposable-system.md
|   |   |-- 0023-css-template-indent-guardrail.md
|   |   |-- 0024-lit-css-autofix-and-tabs.md
|   |   |-- 0025-base-package-and-event-bus-removal.md
|   |   |-- 0026-eslint-flat-config-and-import-sorting.md
|   |   |-- 0027-platform-package-extraction.md
|   |   |-- 0028-api-request-flow-standardization.md
|   |   |-- 0029-lit-html-template-formatting.md
|   |   |-- 0030-validate-builds-workspace-deps.md
|   |   |-- 0031-retire-legacy-data-service.md
|   |   |-- 0032-defer-api-facade-and-network-request-service.md
|   |   |-- 0033-ui-irankupapiclient-guardrail-and-appservices-cleanup.md
|   |   |-- 0034-ui-no-fetch-guardrail.md
|   |   |-- 0035-ui-no-api-mock-guardrail.md
|   |   |-- 0036-no-api-mock-imports-in-app-outside-platform.md
|   |   |-- 0037-platform-exports-and-env-json-copy.md
|   |   |-- 0038-base-exports-for-runtime-imports.md
|   |   |-- 0039-api-mock-exports-to-dist.md
|   |   |-- 0040-dev-server-normalize-node-modules-paths.md
|   |   |-- 0041-vscode-workspace-file.md
|   |   |-- 0042-apps-layer-and-spa-split.md
|   |   |-- 0043-domain-tourney-umbrella-and-app-composition-root.md
|   |   |-- 0044-internal-game-mode-registry-and-ruleset-versioning.md
|   |   |-- 0045-openapi-3-1-2-toolchain-compat.md
|   |   |-- 0046-platform-no-product-sdks.md
|   |   |-- 0047-apibase-build-pipeline.md
|   |   |-- 0048-domain-dtos-and-gateways.md
|   |   |-- 0049-apibase-style-domain-layout.md
|   |   |-- 0050-openapi-change-protocol-and-gateway-mapping.md
|   |   |-- 0051-tourney-capability-split.md
|   |   |-- PENDING.md
|   |   `-- README.md
|   |-- architecture
|   |   |-- api-request-flow.md
|   |   |-- di.md
|   |   |-- mock-server.md
|   |   |-- service-catalog.md
|   |   |-- services.md
|   |   `-- ui-packages.md
|   |-- diagnostics
|   |   |-- APIBASE-ALIGNMENT.md
|   |   |-- OPENAPI-MIGRATION.md
|   |   |-- README.md
|   |   `-- REPO-TREE.md
|   |-- domain
|   |   `-- glossary.md
|   |-- engineering
|   |   |-- mock-server-guide.md
|   |   |-- openapi-change-protocol.md
|   |   |-- repo-artifacts-policy.md
|   |   `-- structural-change-protocol.md
|   |-- landing-page-strategy-guide.md
|   |-- negocio
|   |   |-- README.md
|   |   |-- documento-contextos-rankup.md
|   |   |-- documento-contratos-dominio-rankup.md
|   |   `-- documento-fundacional-rankup.md
|   |-- overview.md
|   |-- product
|   |   |-- Investigación Final_ Sistema de Progresión y Modelo Competitivo de Rankup.md
|   |   |-- Rankup_ Modelo de Negocio, Visión y Escalabilidad.docx
|   |   |-- Rankup_ Sistema de Progresión Global y Modelo Competitivo.docx
|   |   `-- Torneos en Rankup_ Formato, Exploración e Incentivos.docx
|   |-- quality
|   |   `-- implementation-checklist.md
|   |-- scope
|   |   |-- README.md
|   |   |-- decisions.md
|   |   `-- questions.md
|   |-- state
|   |   |-- 01-tooling.md
|   |   |-- 02-runtime.md
|   |   |-- 03-scope-observed.md
|   |   |-- 04-risks.md
|   |   |-- 05-api-requests-observed.md
|   |   `-- 06-service-api-import-audit.md
|   `-- work
|       |-- CURRENT.md
|       |-- README.md
|       |-- ROADMAP.md
|       |-- START-HERE.md
|       |-- epics
|       |   |-- 001-work-tracking-bootstrap.md
|       |   |-- 002-service-layering-di-skeleton.md
|       |   |-- 003-game-mode-sport-extensibility.md
|       |   |-- 004-greenfield-ids-and-imports.md
|       |   |-- 005-ts-only-and-toolchain-unification.md
|       |   |-- 006-mock-http-server.md
|       |   |-- 007-workspace-archetype-alignment.md
|       |   `-- 008-domain-tourney-boundaries.md
|       |-- log
|       |   |-- 2026-01-29.md
|       |   |-- 2026-01-30.md
|       |   |-- 2026-01-31.md
|       |   |-- 2026-02-01.md
|       |   |-- 2026-02-02.md
|       |   `-- 2026-02-03.md
|       `-- wps
|           `-- _TEMPLATE.md
|-- eslint.config.js
|-- package.json
|-- packages
|   |-- api
|   |   |-- docs
|   |   |   |-- BREVIARIO.md
|   |   |   |-- README.md
|   |   |   |-- contrato
|   |   |   |   |-- achievements
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- admin
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- auth
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- chat
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- creators
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- game-modes-and-rules
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- invitacion-a-torneos
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- invitation-codes
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- list-of-spec-endpoints.md
|   |   |   |   |-- live-notifications-and-feed
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- me
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- meta-config
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- promotion-rewards
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- ranked
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- ranking-results-live-ranking.ts
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- social
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- sports
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- stats-recap-wrapped
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- submissions
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- tournaments-invites-membership
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- tournaments-listado-preview-lifecycle.yaml
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- tournaments-matchdays
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- trust-and-safety
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- uploads-and-media
|   |   |   |   |   `-- spec.yaml
|   |   |   |   |-- users
|   |   |   |   |   `-- spec.yaml
|   |   |   |   `-- verified-events-hub
|   |   |   |       `-- spec.yaml
|   |   |   |-- errors
|   |   |   |   `-- README.md
|   |   |   `-- teoría
|   |   |       |-- 00-documento-fundacional-rankup.md
|   |   |       |-- 01-contextos-propuestos.md
|   |   |       |-- 02-mapa-de-contratos-de-dominio.md
|   |   |       `-- 03-ejemplo-cinco-flujos-de-secuencias-críticas.md
|   |   |-- openapi.yaml
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- client.ts
|   |   |   |-- generated
|   |   |   |   `-- openapi.ts
|   |   |   |-- index.ts
|   |   |   `-- types.ts
|   |   `-- tsconfig.json
|   |-- api-mock
|   |   |-- package.json
|   |   |-- scripts
|   |   |   `-- smoke-scenario.ts
|   |   |-- src
|   |   |   |-- core
|   |   |   |   |-- handlers.ts
|   |   |   |   |-- index.ts
|   |   |   |   |-- registry.ts
|   |   |   |   |-- scenario.ts
|   |   |   |   `-- types.ts
|   |   |   |-- index.ts
|   |   |   |-- mock-db.ts
|   |   |   `-- server
|   |   |       |-- cli.ts
|   |   |       |-- index.ts
|   |   |       |-- openapi-contract.ts
|   |   |       `-- spike-openapi-contract.ts
|   |   `-- tsconfig.json
|   |-- app
|   |-- base
|   |   |-- browser
|   |   |   |-- disposableController.ts
|   |   |   `-- event.ts
|   |   |-- common
|   |   |   |-- event.ts
|   |   |   `-- lifecycle.ts
|   |   |-- package.json
|   |   `-- tsconfig.json
|   |-- common
|   |   |-- lit-controllers
|   |   |   |-- listeners-controller
|   |   |   |   `-- listeners-controller.ts
|   |   |   `-- visibility-controller
|   |   |       `-- visibility-controller.ts
|   |   |-- object-property-observer
|   |   |   `-- object-property-observer.ts
|   |   |-- package.json
|   |   |-- tsconfig.json
|   |   `-- types
|   |       |-- helpers.d.ts
|   |       `-- html-element-typed-events.ts
|   |-- platform
|   |   |-- definitions.d.ts
|   |   |-- env.json.example
|   |   |-- package.json
|   |   |-- src
|   |   |   |-- api
|   |   |   |   `-- common
|   |   |   |-- environment
|   |   |   |   |-- browser
|   |   |   |   |   |-- env.ts
|   |   |   |   |   `-- environmentService.ts
|   |   |   |   `-- common
|   |   |   |       `-- environment.ts
|   |   |   |-- events
|   |   |   |   |-- browser
|   |   |   |   `-- common
|   |   |   |-- instantiation
|   |   |   |   |-- browser
|   |   |   |   |   |-- elementScopedServices.ts
|   |   |   |   |   |-- provider.ts
|   |   |   |   |   `-- providerService.ts
|   |   |   |   `-- common
|   |   |   |       |-- decorators.ts
|   |   |   |       |-- descriptors.ts
|   |   |   |       |-- instantiation-smoke.ts
|   |   |   |       |-- instantiation.ts
|   |   |   |       |-- instantiationService.ts
|   |   |   |       `-- serviceCollection.ts
|   |   |   |-- registerPlatformServices.ts
|   |   |   `-- session
|   |   |       |-- browser
|   |   |       |   |-- amazon-cognito-identity-js.ts
|   |   |       |   |-- session-manager.ts
|   |   |       |   `-- sessionManagerService.ts
|   |   |       `-- common
|   |   |           |-- sessionManager.ts
|   |   |           `-- types.ts
|   |   `-- tsconfig.json
|   |-- rankup
|   |   |-- package.json
|   |   |-- src
|   |   |   `-- domains
|   |   |       `-- tourney
|   |   |           |-- LLM_PROMPT.md
|   |   |           |-- README.md
|   |   |           |-- analysis
|   |   |           |   `-- README.md
|   |   |           |-- chat
|   |   |           |   `-- README.md
|   |   |           |-- codes
|   |   |           |   |-- contracts
|   |   |           |   |   |-- tourneyInvitationCodes.ts
|   |   |           |   |   |-- tourneyInvitationCodesGateway.ts
|   |   |           |   |   `-- types.ts
|   |   |           |   |-- models
|   |   |           |   |   |-- index.ts
|   |   |           |   |   `-- invitationCodes.ts
|   |   |           |   |-- services
|   |   |           |   |   `-- tourneyInvitationCodesService.ts
|   |   |           |   `-- validation
|   |   |           |-- common
|   |   |           |-- contracts
|   |   |           |-- core
|   |   |           |   |-- contracts
|   |   |           |   |   |-- tourneyCore.ts
|   |   |           |   |   |-- tourneyCoreGateway.ts
|   |   |           |   |   `-- types.ts
|   |   |           |   |-- models
|   |   |           |   |   |-- index.ts
|   |   |           |   |   |-- preview.ts
|   |   |           |   |   `-- tournament.ts
|   |   |           |   |-- services
|   |   |           |   |   `-- tourneyCoreService.ts
|   |   |           |   `-- validation
|   |   |           |       `-- validateCreateTournamentRequest.ts
|   |   |           |-- fixtures
|   |   |           |   `-- README.md
|   |   |           |-- index.ts
|   |   |           |-- invites
|   |   |           |   |-- contracts
|   |   |           |   |   |-- tourneyInvites.ts
|   |   |           |   |   |-- tourneyInvitesGateway.ts
|   |   |           |   |   `-- types.ts
|   |   |           |   |-- models
|   |   |           |   |   |-- index.ts
|   |   |           |   |   `-- invites.ts
|   |   |           |   |-- services
|   |   |           |   |   `-- tourneyInvitesService.ts
|   |   |           |   `-- validation
|   |   |           |-- matchdays
|   |   |           |   |-- contracts
|   |   |           |   |   |-- tourneyMatchdays.ts
|   |   |           |   |   |-- tourneyMatchdaysGateway.ts
|   |   |           |   |   `-- types.ts
|   |   |           |   |-- models
|   |   |           |   |   |-- index.ts
|   |   |           |   |   `-- matchday.ts
|   |   |           |   |-- services
|   |   |           |   |   `-- tourneyMatchdaysService.ts
|   |   |           |   `-- validation
|   |   |           |-- members
|   |   |           |   |-- contracts
|   |   |           |   |   |-- tourneyMembers.ts
|   |   |           |   |   |-- tourneyMembersGateway.ts
|   |   |           |   |   `-- types.ts
|   |   |           |   |-- models
|   |   |           |   |   |-- index.ts
|   |   |           |   |   `-- members.ts
|   |   |           |   |-- services
|   |   |           |   |   `-- tourneyMembersService.ts
|   |   |           |   `-- validation
|   |   |           |-- mock
|   |   |           |-- models
|   |   |           |-- ranking
|   |   |           |   |-- contracts
|   |   |           |   |   |-- tourneyRanking.ts
|   |   |           |   |   |-- tourneyRankingGateway.ts
|   |   |           |   |   `-- types.ts
|   |   |           |   |-- models
|   |   |           |   |   |-- index.ts
|   |   |           |   |   `-- ranking.ts
|   |   |           |   |-- services
|   |   |           |   |   `-- tourneyRankingService.ts
|   |   |           |   `-- validation
|   |   |           |-- recaps
|   |   |           |   `-- README.md
|   |   |           |-- registerTourneyDomainServices.ts
|   |   |           |-- results
|   |   |           |   `-- README.md
|   |   |           |-- services
|   |   |           |-- shared
|   |   |           |   |-- index.ts
|   |   |           |   |-- models
|   |   |           |   |   |-- enums.ts
|   |   |           |   |   |-- ids.ts
|   |   |           |   |   |-- index.ts
|   |   |           |   |   `-- user.ts
|   |   |           |   `-- validation
|   |   |           |       |-- README.md
|   |   |           |       |-- validateInvitationCode.ts
|   |   |           |       `-- validateMatchdayNumber.ts
|   |   |           |-- stats
|   |   |           |   `-- README.md
|   |   |           |-- submissions
|   |   |           |   `-- README.md
|   |   |           |-- tests
|   |   |           |-- updates
|   |   |           |   `-- README.md
|   |   |           `-- validation
|   |   `-- tsconfig.json
|   `-- samba
|       |-- definitions.d.ts
|       |-- design-direction.md
|       |-- design-principles-deck.md
|       |-- icons.ts
|       |-- load-spinner
|       |   `-- load-spinner.ts
|       |-- overlay
|       |   |-- README.md
|       |   |-- animations-presets.ts
|       |   |-- common
|       |   |   |-- cancelable-promise.ts
|       |   |   |-- listeners.ts
|       |   |   `-- when-visible.ts
|       |   |-- events.types.d.ts
|       |   |-- open-overlay.ts
|       |   |-- overlay-container.ts
|       |   |-- overlay-controller.ts
|       |   |-- styles
|       |   |   |-- box-overlay.css
|       |   |   |-- content-overlay.css
|       |   |   `-- overlay-container.css
|       |   `-- types.d.ts
|       |-- package.json
|       |-- progress-bar
|       |   `-- progress-bar.ts
|       |-- styles
|       |   |-- button.css
|       |   |-- dark-theme.css
|       |   |-- form-control.css
|       |   |-- light-theme.css
|       |   |-- link.css
|       |   |-- margin.css
|       |   |-- reset.css
|       |   |-- rk-match-row.css
|       |   |-- root.css
|       |   |-- sb-bet-match-card.css
|       |   |-- scrollbar.css
|       |   |-- theme.css
|       |   |-- tourney-card.css
|       |   `-- typography.css
|       |-- toggle-input
|       |   `-- toggle-input.ts
|       |-- tsconfig.json
|       `-- types
|           `-- types.d.ts
|-- rankup-client.code-workspace
|-- rollup.config.ts
|-- scripts
|   |-- eslint-rules
|   |   |-- lit-css-template-format.js
|   |   `-- lit-html-template-format.js
|   |-- repo-agent-entry.ts
|   |-- repo-guardrails.ts
|   |-- repo-lint.ts
|   |-- repo-ratchet.ts
|   |-- repo-structural-adr.ts
|   |-- repo-utils.ts
|   |-- repo-work-log-verification.ts
|   `-- repo-work-log.ts
|-- tsconfig-base.json
|-- tsconfig-build.json
|-- tsconfig.rollup.json
|-- web-dev-server.config.mjs
`-- yarn.lock

217 directories, 472 files
```


# Open questions (arquitectura + escalabilidad)

> Enfocadas en repo, tooling y arquitectura para un frontend grande con mocks. Sin backend real.

## Contexto: objetivos de Rankup + estándares del repo

-   Objetivo de producto: juego social de torneos **sin dinero real**, multi‑game y multi‑sport, con rankings intra‑torneo.
-   Objetivo técnico: frontend completo **mock‑first** y arquitectura VSCode‑grade que escale con nuevas verticales.
-   Estándares no negociables: OpenAPI‑first, mock‑first, TS‑only, sin UI tests (solo test para algoritmos y donde se requiera urgentemente), boundaries estrictas UI ↔ platform, composition root único.
-   Guardrails obligatorios: UI sin `fetch` ni runtime API impl, imports restringidos, layering enforceable y work tracking estricto.

## 1) Canonical spec & contract lifecycle

-   ¿Cuál es la ruta canonical definitiva de la spec y cómo se impone (guardrails + CI)?
-   ¿Se mantiene un modelo **single-file** o **shards + merge**? En shards: ¿quién es owner de cada dominio y qué flujo de merge es obligatorio?
-   ¿Qué herramienta “bundler” de OpenAPI se adopta oficialmente para producir la spec final (dereferencing, ordering, deterministic output)?
-   ¿Qué estrategia de versionado de la spec (semver, snapshots, changelog) se usa para coordinar cambios con el frontend?
-   ¿Cómo se valida compatibilidad de OpenAPI 3.1 con el toolchain actual (spectral, openapi-typescript, mock server)?
-   ¿Qué reglas de linting de spec son *hard fail* vs *advisory* para no romper iteración?
-   ¿Cómo se detecta drift entre spec, mocks y generated types (hashes, CI checks, repo ratchet)?

## 2) Codegen & typing strategy

-   ¿El cliente generado (`packages/api/src/generated/openapi.ts`) debe ser *source of truth* o se requiere una facade manual?
-   ¿Cómo se controla el impacto de cambios de tipos en el app (breaking vs non‑breaking)?
-   ¿Qué estrategia de generación se usa para evitar tiempos de build largos (incremental, caching, pre‑commit hooks)?
-   ¿Se versionan los artefactos generados o se regeneran siempre en CI?
-   ¿Qué política de “type-only exports” vs runtime exports debe seguir `@rankup/api` para evitar bundling bloat?

## 3) Mock server architecture (contract‑first)

-   ¿Cuál es el “golden path” de mocks: HTTP server vs in‑memory, y cómo se selecciona por entorno?
-   ¿Cómo se escala el registry de handlers (naming, folder structure, ownership por dominio)?
-   ¿Qué límites de stateful mocks son aceptables (TTL, size, isolation entre tests)?
-   ¿Cómo se mockean flujos complejos (SSE, uploads, paging grandes) sin degradar DX?
-   ¿Se necesita persistencia ligera (sqlite/JSON) para escenarios realistas o se mantiene solo in‑memory?
-   ¿Cómo se asegura determinismo en mocks (seed, clock control, stable IDs)?

## 4) Monorepo boundaries & layering

-   ¿La separación actual (`app`, `platform`, `base`, `common`, `api`, `api-mock`, `samba`) escala para +100 endpoints y nuevas verticales?
-   ¿Hace falta introducir `packages/domain-*` para reducir el tamaño de `platform`?
-   ¿Qué reglas de boundary se refuerzan (UI ↔ platform ↔ api) y cómo se validan a escala?
-   ¿Qué convenciones de export maps se requieren para evitar deep imports y builds rotos?
-   ¿Cómo se gobierna el uso de `@rankup/base` vs utilidades locales para evitar duplicación?

## 5) Build system & performance

-   ¿`tsc -b` y el build actual soportan crecimiento (tiempos, incremental, build graphs)?
-   ¿Se requiere un orquestador (Nx/Turbo/Bazel) o se mantiene yarn scripts + tsc build?
-   ¿Cómo se divide el pipeline de CI para paralelismo sin perder invariantes?
-   ¿Qué targets son “fast local” vs “full CI” para mantener productividad?

## 6) Runtime architecture (frontend only)

-   ¿Cómo se organiza el estado global vs local (store central, services por dominio, controllers por página)?
-   ¿Qué estrategia de caching y revalidación se adopta (stale‑while‑revalidate, TTL, invalidation)?
-   ¿Cómo se maneja el streaming de eventos (SSE) sin leaks (dispose, backpressure)?
-   ¿Qué patrón de error handling debe ser consistente (Problem Details mapping a UX)?

## 7) Data scale & UI performance

-   ¿Qué estrategia de virtualización de listas se requiere para rankings / feeds largos?
-   ¿Cómo se minimiza re-rendering en Lit (batched updates, controllers, memoization)?
-   ¿Qué métricas de performance se consideran “regresión” y cómo se capturan en CI?

## 8) Security & privacy boundaries (frontend)

-   ¿Cómo se almacenan tokens/sesiones en frontend (memory vs storage), considerando seguridad?
-   ¿Qué política de CSP y sanitización se necesita para contenido generado (chat, feed)?
-   ¿Cómo se evita filtrar datos sensibles en logs del mock y del app?

## 9) Dev server & module resolution

-   ¿El dev server actual (web-dev-server) es sostenible con el tamaño proyectado?
-   ¿Cómo se evita la dependencia de TS runtime en node_modules (dist mapping, export maps)?
-   ¿Qué estrategia de source maps y debugging se requiere para DX al crecer?

## 10) Localization & assets at scale

-   ¿Cómo crece el pipeline de localización (extract, bundle, runtime switch)?
-   ¿Assets globales vs por‑package: cómo evitar duplicación y peso innecesario?
-   ¿Qué estrategia de caching de assets se requiere para performance?

## 11) Observabilidad & diagnostics

-   ¿Qué logging/telemetry mínima debe existir en frontend para detectar errores de contrato?
-   ¿Cómo se captura y reporta error context sin backend real (local dev, CI)?
-   ¿Se necesita un “debug panel” o tooling interno para inspeccionar mocks/requests?

## 12) CI quality gates

-   ¿Qué subset de checks son obligatorios en PR vs nightly?
-   ¿Cómo se verifica que cambios en spec propaguen codegen + mocks automáticamente?
-   ¿Cómo se evita que la validación se vuelva demasiado lenta (sharded checks)?

## 13) Documentation & governance

-   ¿Cuál es la “single source” de arquitectura (ADR vs docs/architecture vs diagnostics)?
-   ¿Cómo se evita drift entre ADRs, docs y el estado real del repo?
-   ¿Se requiere CODEOWNERS para dominios críticos (spec, platform, mock server)?

## 14) Future‑proofing

-   ¿Qué límites del diseño actual impiden añadir nuevas verticales (draft, creators, promotions) sin refactor?
-   ¿Qué abstracciones conviene estabilizar ahora (DI, AppServices, domain services) para evitar deuda estructural?
-   ¿Cómo se garantiza que el frontend no dependa accidentalmente de detalles del mock server?
