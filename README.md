<p align="center">
  <img width="200" src="./assets/logo.svg"></img>
</p>

## Setup

-   Use Node 24.x (see `.nvmrc`).
-   Enable Corepack: `corepack enable`.
-   Verify Yarn 4.12.0: `yarn -v`.
-   Install dependencies: `yarn install --immutable`.

## Scripts

-   `start` runs your app for development, reloading on file changes
-   `start:build` runs your app after it has been built using the build command
-   `build` builds your app and outputs it in your `dist` directory
-   `test` runs your test suite with Web Test Runner
-   `lint` runs the linter for your project

## OpenAPI

The client consumes a REST API documented in `packages/api/openapi.yaml`.

## Copilot Coding Agent Firewall Notice

Use the guidance in [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for:

-   Actions setup steps that run before the firewall is enabled.
-   The custom allowlist hosts admins should configure.

## Arquitectura y escalabilidad

Este monorepo usa Yarn workspaces con **apps** y **packages**: `apps/rankup-web` (landing/marketing),
`apps/rankup-spa` (app principal), y paquetes compartidos (`packages/platform`, `packages/samba`,
`packages/common`, `packages/base`, `packages/api`, `packages/api-mock`). La UI está basada en Lit
con web components y renderizado declarativo, manteniendo un contrato claro entre vistas,
elementos y servicios.

El enfoque recomendado para escalar es separar responsabilidades: la SPA contiene routing y
composición de páginas; `samba` contiene el design system; `platform` concentra servicios y
composition root; `common` consolida helpers y tipos. Mantén dependencias unidireccionales:
`apps/*` dependen de `packages/*`, y nunca al revés.

## Principios

-   **Modularidad por dominio**: agrupa páginas y servicios por dominio funcional para reducir
    acoplamiento.
-   **Componentes pequeños y cohesivos**: cada componente Lit debe cumplir una sola función.
-   **Flujo de datos explícito**: propiedades y eventos bien tipados entre componentes.
-   **Extensiones y composición**: crea variantes en `samba` con composición en vez de herencia.
-   **Optimización incremental**: prioriza rendimiento con lazy loading y split de rutas.

## Estructura recomendada

-   `apps/rankup-spa/pages`: vistas y rutas (una carpeta por dominio).
-   `apps/rankup-spa/elements`: componentes específicos de la app.
-   `packages/platform/src`: servicios, composition root y wiring.
-   `packages/samba`: componentes reutilizables y tokens de UI.
-   `packages/common`: tipos, utilidades y modelos compartidos.

## Patrones

-   **Lit + TypeScript**: usa `@property`, `@state` y `@customElement` con tipado estricto.
-   **Eventos de dominio**: expón eventos `CustomEvent` tipados en `samba` para desacoplar la app.
-   **Servicios con interfaces**: define contratos en `platform/**/common` y concreta implementaciones
    en `platform/**/browser`.
-   **Separación de estados**: estado de UI en componentes, estado de sesión/negocio en servicios.
-   **Carga diferida**: rutas en `app` con imports dinámicos y componentes pesados en `samba`.

## Testing

-   No UI tests (no component snapshots, no browser interaction tests).
-   Tests are allowed only for core algorithms and invariants (scoring, odds, ranking/tie-breaks, draft rules, critical pure functions).
-   Everything else is validated by `tsc --noEmit`, `eslint`, and `build`.

## CI

-   Ejecuta `yarn validate` para TypeScript + ESLint en todos los paquetes.
-   Ejecuta pruebas con los comandos existentes antes de merges.
-   Mantén el pipeline ligero: cache de Yarn y ejecución paralela por workspace si es posible.

## Seguridad

-   Centraliza manejo de tokens y sesión en `packages/platform/src/session`.
-   Evita almacenar secretos en código; usa variables de entorno en tiempo de build.
-   Valida entradas en la capa de servicios antes de construir requests.
-   Revisa dependencias periódicamente y actualiza versiones con cautela.

## Versionado

-   Usa versionado semántico por paquete si se publican librerías internas.
-   Mantén cambios compatibles en `samba` y documenta breaking changes en el changelog.
