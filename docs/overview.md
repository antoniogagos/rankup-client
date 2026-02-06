# Overview (Onboarding)

Este documento es una guía rápida para que una persona nueva entienda **qué es cada carpeta** y **qué debe ir dentro**. Está pensado para humanos, no para agentes automáticos.

## Idea general del repo

Rankup es un monorepo con dos apps y varios packages. La regla básica es: **OpenAPI es la fuente de verdad**, el frontend debe correr sin backend (**mock-first**), y la UI **no** habla directamente con SDKs ni HTTP.

## Mapa rápido (root)

-   `apps/`: aplicaciones ejecutables.
-   `packages/`: librerías y dominios compartidos.
-   `docs/`: documentación (arquitectura, decisiones, negocio, procesos).
-   `scripts/`: guardrails y scripts internos de repo.
-   `assets/`: recursos compartidos (imágenes, iconos, etc.).
-   `dist/`: salida de build (no se versiona).
-   `node_modules/`: dependencias (no se versiona).
-   `rankup-client.code-workspace`: workspace opcional para VS Code.
-   `package.json`, `tsconfig*.json`, `rollup.config.ts`, `web-dev-server.config.mjs`: configuración del toolchain.

## Apps

### `apps/rankup-spa/`

La SPA principal (producto). Aquí vive la UI real.

-   `apps/rankup-spa/assets/`: recursos específicos de la SPA (imágenes, iconos, avatares, etc.).
-   `apps/rankup-spa/elements/`: componentes UI (Lit) reutilizables dentro de la app.
-   `apps/rankup-spa/pages/`: páginas/route-level screens.
-   `apps/rankup-spa/lib/`: “pegamento” de la app (composición root, `app-services.ts`, localización, helpers, directivas, utilidades).
-   `apps/rankup-spa/services/`: implementaciones runtime.
-   `apps/rankup-spa/services/api/`: **único lugar** donde se importa `@rankup/api` y se construye el cliente HTTP o mock.
-   `apps/rankup-spa/types/`: tipos compartidos propios de la SPA.
-   `apps/rankup-spa/main.ts`: bootstrap de la app.
-   `apps/rankup-spa/rk-app.ts`, `apps/rankup-spa/rk-unauthenticated-app.ts`: contenedores de UI.
-   `apps/rankup-spa/web-dev-server.config.mjs`: configuración de dev server (WDS).

**Qué no debe ir aquí:** lógica de dominio reutilizable (va a `packages/rankup`), ni infraestructura/DI base (va a `packages/platform`).

### `apps/rankup-web/`

Landing/marketing site. Código simple, sin lógica de dominio.

-   `apps/rankup-web/src/`: entrypoints de la web.
-   `apps/rankup-web/index.html`: HTML principal.
-   `apps/rankup-web/web-dev-server.config.mjs`: configuración de WDS.

## Packages

### `packages/rankup/`

Umbrella de dominios a nivel app + capas del Rankup Engine.

-   `packages/rankup/src/shared/`: tipos/validaciones compartidas cross‑domain (engine‑level).
-   `packages/rankup/src/algorithms/`: lógica pura determinista (scoring, lock rules, draft).
-   `packages/rankup/src/registry/`: registro interno de game modes y sports.
-   `packages/rankup/src/runtime/`: orquestación cross‑domain (application layer).
-   `packages/rankup/src/domains/tournaments/`: lifecycle + membership + invites + matchdays.
-   `packages/rankup/src/domains/scoring/`: rankings/results/timeline (ranking vive en `ranking/`).
-   `packages/rankup/src/domains/accounts/`: auth/me/users/social (implementado mínimo).
-   `packages/rankup/src/domains/sports/`: catálogo + calendario (catalog/schedule implementado).
-   `packages/rankup/src/domains/rules/`: game modes + rulesets versionados (gameModes/rulesets implementado).
-   `packages/rankup/src/domains/submissions/`: submissions por modo (implementado mínimo).
-   `packages/rankup/src/domains/engagement/`: chat/live/stats (scaffolding).
-   `packages/rankup/src/domains/verified/`, `ranked/`, `achievements/`, `media/`, `trustSafety/`, `promotions/`, `creators/`, `admin/`: scaffolding para fases futuras.

### `packages/platform/`

Infraestructura y DI. Servicios base reutilizables (env, sesión, DI).

**No debe importar SDKs de producto** (`@rankup/api`).

### `packages/api/`

Contrato OpenAPI + tipos generados.

-   `packages/api/openapi.yaml`: fuente de verdad del contrato HTTP.
-   `packages/api/src/generated/openapi.ts`: generado desde OpenAPI (no editar a mano).

### `packages/api-mock/`

Mocks tipados y servidor mock (mock-first).

-   Refleja la misma superficie que `packages/api`.

### `packages/samba/`

Design system y componentes UI reutilizables.

### `packages/base/`

Primitivas de bajo nivel (eventos, disposables, helpers comunes).

### `packages/common/`

Utilidades y tipos compartidos entre apps/packages.

## Docs

-   `docs/adr/`: decisiones arquitectónicas (ADR). Son la fuente normativa.
-   `docs/architecture/`: arquitectura y flujos (normativo).
-   `docs/engineering/`: protocolos de trabajo (ej: cambios OpenAPI).
-   `docs/negocio/`: documentos de negocio y contexto de dominio.
-   `docs/work/`: épicas activas, logs diarios y estado actual.
-   `docs/scope/`: alcance del producto.
-   `docs/state/`: fotografía del estado actual.
-   `docs/quality/`: checklist y quality gates.
-   `docs/diagnostics/`: análisis y migraciones.

## Scripts

-   `scripts/`: guardrails y herramientas del repo (lint, ratchet, work logs, etc.).

## Reglas clave

-   **OpenAPI-first**: si cambia la API, empieza en `packages/api/openapi.yaml`.
-   **Mock-first**: el frontend debe funcionar sin backend.
-   **La UI no toca SDKs ni HTTP**: UI → servicios de dominio → gateway → SDK.
-   **Sin tests UI**: solo tests de lógica pura cuando son necesarios.
