# Epic 002: Service layering + DI skeleton (VS Code-inspired)

## Estado

-   Estado: Done (WP-002-12 complete; epic closed)
-   Owner: Rankup maintainers
-   Última actualización: 2026-01-31
-   Nota (2026-01-30): mantenimiento de toolchain/dev-server aplicado para restablecer dev buildless (incluye TypeScript local en app, start via yarn tsc, export CJS en config, rewrite TS->dist incl. node_modules/@rankup y JS fallback node_modules/@rankup->packages, useDefineForClassFields=false y metadata de api-mock; ver work log).
-   Nota (2026-01-30): rewrite del dev-server ahora mapea rutas `/src/*` a `dist/*` cuando los paquetes usan `rootDir: src` (evita MIME errors por TS en exports como `@rankup/api-mock`).
-   Nota (2026-01-30): se creó Epic 006 (HTTP mock server) con docs/ADR/skill iniciales y WP-006-01/02/07 completados.
-   Nota (2026-01-31): se agregó guardrail de formato de imports (ADR 0021) y se normalizaron imports a una sola línea sin separadores en blanco.
-   Nota (2026-01-31): se añadió el sistema base de eventos/disposables estilo VS Code en el root (ADR 0022).
-   Nota (2026-01-31): se agregó un guardrail para alinear el contenido de ` css\`` con la línea  `css\`` (ADR 0023).
-   Nota (2026-01-31): se agregó autofix ESLint para `css\`` y tabs size 4 (ADR 0024).

## Definition of Ready (DoR)

-   [x] Epic 004 verificado y registrado en el work log (ver evidencia arriba).
-   [x] El entorno puede ejecutar `yarn validate` (sin fallos de toolchain).
-   [x] El equipo acepta que este epic es incremental (no refactor masivo).
-   [x] WP-002-00 (preflight) está listo para ejecutarse y registrar inventario.

## Objetivo

Introducir un modelo mínimo de servicios (inspirado en VS Code) que habilite:

-   Identificadores de servicio + inyección por constructor (para clases no-UI).
-   Un único **composition root** que registra implementaciones (mock vs real).
-   Alcance inicial **app-scope**, con camino claro a **scopes** posteriores (p.ej. tournament-scope).
-   Migrar **un vertical slice** de UI a consumir un **servicio de dominio/workbench** sin tocar directamente env/fetch/impl API.

## No-objetivos

-   Refactor masivo de toda la UI.
-   Reemplazar completamente auth/session.
-   Añadir UI tests (prohibido por política de testing).
-   Decidir hosting/deploy.

## Guardrails (invariantes)

-   UI packages (see `docs/architecture/ui-packages.md`) NO deben:
    -   construir dependencias,
    -   seleccionar implementaciones (mock/real),
    -   importar implementaciones `browser/**` de servicios (except `platform/instantiation/browser/**`),
    -   importar implementaciones runtime de API (ADR “UI does not import API implementations”).
-   El composition root es el **único selector** (mock vs real).
-   Evitar service locator en UI packages: UI packages no deben tener `getService(id)` ni acceso a `ServiceCollection`/`InstantiationService`.
-   Servicios (no-UI) pueden ser creados por DI; UI packages reciben un **objeto tipado explícito** con campos concretos.

---

# Matriz de paralelización (Work Packets)

| WP        | Título                                             | Áreas principales                                              | Depende de              | Riesgo | Hotspots de merge     |
| --------- | -------------------------------------------------- | -------------------------------------------------------------- | ----------------------- | ------ | --------------------- |
| WP-002-00 | Preflight: baseline + import audit                 | `docs/work/log/*` + rg scripts                                 | Epic 004 verificado     | Bajo   | Bajo                  |
| WP-002-01 | DI primitives                                      | `packages/app/src/platform/instantiation/common/**`            | WP-002-00               | Bajo   | Bajo                  |
| WP-002-02 | Composition root + platform registrations          | `packages/app/src/platform/compositionRoot.ts` + `platform/**` | WP-002-01               | Medio  | compositionRoot       |
| WP-002-03 | UI bridge: AppServices explícito (sin locator)     | `packages/app/lib/app-context.ts` (o nuevo módulo de bridge)   | WP-002-02               | Medio  | app-context/bootstrap |
| WP-002-04 | Servicio dominio/workbench: ITournamentService        | `packages/app/src/**/tournament/**`                               | WP-002-02               | Medio  | registro servicios    |
| WP-002-05 | Vertical slice: Home consume ITournamentService       | `packages/app/pages/home/**`                                   | WP-002-03 + WP-002-04   | Medio  | home page             |
| WP-002-06 | Enforcement: ESLint import boundaries + allowlists | config ESLint                                                  | WP-002-05               | Alto   | eslint config         |
| WP-002-07 | Docs + service catalog                             | `docs/architecture/**`                                         | WP-002-02 (API estable) | Bajo   | docs                  |
| WP-002-08 | UI provider: @service + ProviderService + scopes   | `platform/instantiation/browser/**` + `rk-app`                 | WP-002-02               | Medio  | rk-app/bootstrap      |
| WP-002-09 | Cierre del epic                                    | `docs/work/**`                                                 | Todos                   | Bajo   | CURRENT/log           |
| WP-002-10 | Guardrail: Lit css template indent                 | `scripts/repo-guardrails.ts` + estilos Lit                     | WP-002-08               | Bajo   | guardrails            |
| WP-002-11 | Autofix + tabs: Lit css template formatting        | `scripts/eslint-rules/**` + editor config                      | WP-002-10               | Bajo   | guardrails/editor     |
| WP-002-12 | ESLint flat config + import sorting alignment      | `eslint.config.js` + tooling                                   | WP-002-11               | Bajo   | lint/tooling          |

---

## WP-002-00: Preflight (baseline + audit)

### DoR

-   [x] Epic 004 verificado y registrado en el log.
-   [x] `yarn validate` ejecutable en el entorno actual.

### Objetivo

Reducir riesgo antes de tocar arquitectura:

-   Capturar evidencia de baseline (`yarn validate`).
-   Auditar imports actuales para diseñar allowlists/targets.

### Alcance

-   No cambia comportamiento de app.
-   No añade restricciones todavía.

### Tareas

-   Ejecutar y registrar en `docs/work/log/YYYY-MM-DD.md`:
    -   `yarn validate`
    -   (opcional) `yarn lint`
-   Inventario con ripgrep (registrar resultados resumidos en el log):
    -   `rg -n "@rankup/api-mock" packages/platform`
    -   `rg -n "@rankup/api-mock" packages/app/pages packages/app/elements packages/samba`
    -   UI packages = `packages/app/pages/**`, `packages/app/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
    -   `rg -n "openapi-fetch" packages/app/packages/samba`
    -   `rg -n "lib/env" packages/app/pages packages/app/elements`
    -   `rg -n "src/platform" packages/app/pages packages/app/elements packages/samba`
-   Conclusión del audit:
    -   qué paths deben allowlistearse temporalmente,
    -   qué paths deben migrarse en WP-002-05.

### DoD

-   [x] Evidencia en work log.
-   [x] Lista explícita de “imports a erradicar” vs “allowlist temporal”.

### Audit summary (2026-01-30)

-   Allowlist temporal: `packages/platform/src/api/create-rankup-api-client.ts` (wiring mock/real).
-   Imports a erradicar en UI packages (see `docs/architecture/ui-packages.md`): ninguno encontrado.

---

## WP-002-01: DI primitives (foundation)

### DoR

-   [x] WP-002-00 completado (inventario registrado).

### Objetivo

Implementar primitivas DI (TS-only) estilo VS Code:

-   `createDecorator`
-   `ServiceCollection`
-   `SyncDescriptor`
-   `InstantiationService` (`createInstance`, `invokeFunction`, `createChild`)

### Ubicación recomendada

`packages/app/src/platform/instantiation/common/`

### Restricciones

-   Sin imports desde UI packages (see `docs/architecture/ui-packages.md`).
-   Sin singleton global tipo `getService()`.

### Verificación

-   `yarn validate` PASS

### DoD

-   [x] Compila, y se puede instanciar una clase con dependencias inyectadas (smoke mínimo, sin framework de test).

### Nota (2026-01-30)

Las primitivas DI ya existían en `packages/app/src/platform/instantiation/common/` (incluye `instantiation-smoke.ts`).

---

## WP-002-02: Composition root + registro de platform services

### DoR

-   [x] WP-002-01 completado.

### Objetivo

Crear el composition root (único selector) y registrar servicios base:

-   `IEnvironmentService` (contract en common + impl en browser)
-   `IRankupApiClient` (service id alrededor del wiring actual)
-   `InstantiationService` root + `ServiceCollection`
-   Módulos de registro para evitar hotspots:
    -   `registerPlatformServices(services)`
    -   `registerWorkbenchServices(services)` (o `registerDomainServices`)

### Puntos críticos

-   `@rankup/api-mock` puede existir en un “factory”, pero la decisión mock/real se hace en composition root.
-   UI packages no deben importar factories ni implementar selección.

### Verificación

-   `yarn validate` PASS
-   Sanity rg (ajustar allowlist según WP-002-00):
    -   `rg -n "@rankup/api-mock" packages/platform` -> solo wiring allowlisteado
    -   `rg -n "create-rankup-api-client" packages/app/pages packages/app/elements` -> sin matches
    -   UI packages = `packages/app/pages/**`, `packages/app/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)

### DoD

-   [x] Composition root existe y concentra la selección mock/real.
-   [x] Servicios base registrados.

### Nota (2026-01-30)

Se centralizó la selección mock/real en `compositionRoot.ts` y se eliminó el fallback de env en `create-rankup-api-client.ts`.

---

## WP-002-03: UI bridge — AppServices explícito (sin service locator)

### DoR

-   [x] WP-002-02 completado.

### Objetivo

Exponer a UI un objeto tipado y explícito:

-   UI consume `appServices.tournamentService` (o controller equivalente)
-   UI NO recibe `InstantiationService`, accessor, ni `ServiceCollection`.

### Implementación (recomendación)

-   Extender el mecanismo existente de `packages/app/lib/app-context.ts` si ya es el punto central de wiring.
-   Si no, crear `packages/app/lib/app-services.ts` y consumirlo desde el bootstrap (rk-app / app router).

### Verificación

-   `yarn validate` PASS
-   `rg -n "platform/instantiation" packages/app/pages packages/app/elements` -> sin matches
    -   UI packages = `packages/app/pages/**`, `packages/app/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)

### DoD

-   [x] UI tiene acceso a `AppServices` sin imports DI.
-   [x] No existe API genérica para pedir servicios por id desde UI.

### Nota (2026-01-30)

UI consume `getAppServices()` en lugar de `getAppContext().apiClient` (no expone locator ni DI).

---

## WP-002-04: Servicio dominio/workbench — ITournamentService

### DoR

-   [x] WP-002-02 completado.

### Objetivo

Introducir `ITournamentService`:

-   contract en `common/` (service id + interface)
-   impl en `browser/` dependiente solo de `IRankupApiClient` (y quizá `IEnvironmentService` si estrictamente necesario)

### Nota de layering

Este servicio es “dominio/workbench” (no UI). Si se decide ubicarlo bajo `src/platform/` por transición, documentarlo explícitamente.

### Verificación

-   `yarn validate` PASS

### DoD

-   [x] `ITournamentService` registrado y accesible desde el bridge de WP-002-03.

### Nota (2026-01-30)

`ITournamentService` ya existe (contract en `common/`, impl en `browser/`, registro en `registerDomainServices.ts`).

---

## WP-002-05: Vertical slice — Home consume ITournamentService

### DoR

-   [x] WP-002-03 y WP-002-04 completados.

### Objetivo

Migrar 1 consumidor real:

-   Home page deja de usar env/fetch/api impl directamente
-   Home obtiene datos vía `appServices.tournamentService.*`

### Restricciones

-   UI packages no importan API runtime ni `@rankup/api-mock`.
-   Mantener cambios mínimos (no refactor masivo).

### Verificación

-   `yarn validate` PASS
-   `rg -n "@rankup/api-mock|openapi-fetch|src/platform/api" packages/app/pages packages/app/elements packages/samba` -> sin matches
    -   UI packages = `packages/app/pages/**`, `packages/app/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)

### DoD

-   [x] Home page consume el servicio vía `AppServices`.

### Nota (2026-01-30)

La Home slice ya usa `ITournamentService` vía `getAppServices()` en `rk-tournament-list`.

---

## WP-002-06: Enforcement — ESLint import boundaries + allowlists

### DoR

-   [x] WP-002-05 completado.

### Objetivo

Convertir los guardrails en enforcement:

-   UI packages (see `docs/architecture/ui-packages.md`) no importan:
    -   `packages/platform/src/instantiation/**`
    -   `packages/platform/src/**/browser/**`
    -   API mock (`@rankup/api-mock`) fuera de wiring allowlisteado en platform
-   Permitir allowlists mínimas basadas en WP-002-00 (si hay legacy inevitable).

### Verificación

-   `yarn lint` PASS
-   `yarn validate` PASS
-   Negative test local (no commit): introducir import prohibido en UI packages y verificar que lint falla.

### DoD

-   [x] Restricciones efectivas con falsos positivos mínimos y allowlists documentadas.

### Nota (2026-01-30)

Enforcement ya activo en `scripts/repo-guardrails.ts`: UI packages bloquean platform/browser/instantiation/env y api-mock; allowlist para `packages/platform/src/api/create-rankup-api-client.ts`.

---

## WP-002-07: Docs + service catalog

### DoR

-   [x] WP-002-02 completado (API estable).

### Objetivo

Actualizar documentación para que agentes puedan extender el sistema:

-   `docs/architecture/service-catalog.md` (estado real)
-   `docs/architecture/di.md` (cómo añadir servicio)
-   Un snippet “How to add a service” (si no existe ya)

### Verificación

-   `yarn validate` PASS

### DoD

-   [x] Docs coherentes con código.

### Nota (2026-01-30)

Actualizados `docs/architecture/service-catalog.md` y `docs/architecture/di.md` con el estado real de servicios y el bridge `AppServices`.

---

## WP-002-08: UI provider (@service + ProviderService + scopes)

### DoR

-   [x] WP-002-02 completado.

### Objetivo

Habilitar inyección de servicios en UI mediante un provider DOM:

-   `@service` decorator (instantiation/browser).
-   `ProviderService` + `context-request` bridge.
-   `scopedServicesController` para scopes locales.
-   Guardrails + docs actualizados para permitir los helpers de instantiation/browser.

### Verificación

-   `yarn lint` PASS
-   `yarn validate` PASS

### DoD

-   [x] ProviderService + decorator disponibles en `platform/instantiation/browser`.
-   [x] `rk-app` y `rk-unauthenticated-app` registran el provider raíz.
-   [x] Guardrails actualizados con excepción explícita para `platform/instantiation/browser`.
-   [x] ADR + docs actualizados.

### Nota (2026-01-30)

Se migraron componentes/páginas de tournament a `@service` para `IRankupApiClient` y `ITournamentService`.
Se normalizó el formato inline de decoradores (`@property/@state/@service`) y se agregó guardrail (ADR 0020).
Se añadieron servicios `IEventBus`/`ISessionManager` y se migraron usos de eventBus/sessionManager en UI a `@service`.

---

## WP-002-09: Cierre

### DoR

-   [x] Todos los WPs anteriores completados y verificados.

### Objetivo

Cierre reproducible:

-   actualizar estados del epic
-   actualizar `docs/work/CURRENT.md` y roadmap
-   registrar evidencia final en work log

### Verificación

-   `yarn validate` PASS

### DoD

-   Epic 002 marcado Done con evidencia.

---

## WP-002-10: Guardrail — Lit css template indent

### DoR

-   [x] WP-002-08 completado.

### Objetivo

Aplicar el guardrail de formato para `css\``:

-   El contenido de ` css\`` debe alinear su primera línea con la indentación de  `css\``.

### Tareas

-   Añadir ADR y actualizar el índice.
-   Guardrail en `repo:guardrails`.
-   Normalizar `css\`` existentes al formato requerido.
-   Actualizar `AGENTS.md`, `docs/work/CURRENT.md` y el work log del día.

### Verificación

-   `yarn validate` PASS

### DoD

-   [x] Guardrail activo y estilos `css\`` alineados.

---

## WP-002-11: Autofix + tabs — Lit css template formatting

### DoR

-   [x] WP-002-10 completado.

### Objetivo

Añadir autofix y estándar de indentación:

-   Autofix ESLint para ` css\`` (indent + cierre  `\`]`).
-   Tabs size 4 en EditorConfig/VS Code/Prettier.

### Tareas

-   Añadir ADR y actualizar el índice.
-   Agregar regla ESLint local con fixer y configuración en editor.
-   Actualizar guardrails y ratchet para el allowlist CJS.
-   Normalizar estilos `css\`` al layout requerido.

### Verificación

-   `yarn validate` PASS

### DoD

-   [x] Autofix activo y configuración de tabs aplicada.

---

## WP-002-12: ESLint flat config + import sorting alignment

### DoR

-   [x] WP-002-11 completado.

### Objetivo

Eliminar warnings de ESLint v9 y mantener import sorting sin separadores:

-   Migrar a `eslint.config.js` (flat config).
-   Ajustar `simple-import-sort` a un único grupo.
-   Allowlist de `eslint.config.js` en artifacts policy.

### Verificación

-   `yarn lint --fix` PASS
-   `yarn validate` PASS

### DoD

-   [x] ESLint usa flat config sin warnings.

---

## Definition of Done (DoD) del epic

-   DI primitives implementadas y usadas por composition root.
-   `IRankupApiClient` e `IEnvironmentService` registrados como servicios (no globals).
-   Un vertical slice migrado a servicio de dominio.
-   Lint/guardrails previenen imports indebidos en UI.
-   UI puede inyectar servicios con `@service` vía ProviderService (sin locator).
-   `yarn validate` PASS con evidencia en work log.
