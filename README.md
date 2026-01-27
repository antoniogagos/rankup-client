<p align="center">
  <img width="200" src="./assets/logo.svg"></img>
</p>

## Scripts

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner
- `lint` runs the linter for your project

## OpenAPI

The client consumes a REST API documented in `openapi.yaml` at the repository root.

## Copilot Coding Agent Firewall Notice

Use the guidance in [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for:

- Actions setup steps that run before the firewall is enabled.
- The custom allowlist hosts admins should configure.

## Arquitectura y escalabilidad

Este monorepo usa Yarn workspaces con tres paquetes: `packages/app` (aplicación y routing),
`packages/samba` (biblioteca de componentes reutilizables) y `packages/common` (utilidades y
tipos compartidos). La UI está basada en Lit 2.x con web components y renderizado declarativo,
manteniendo un contrato claro entre vistas, elementos y servicios.

El enfoque recomendado para escalar sin infraestructura compleja es separar responsabilidades:
el paquete `app` orquesta rutas, estado de sesión y composición de páginas; `samba` contiene
componentes de diseño y patrones de interacción; `common` consolida helpers, modelos de dominio
y tipos de API. Mantén dependencias unidireccionales: `app` depende de `samba` y `common`, y
`samba` puede depender de `common`, nunca al revés.

## Principios

- **Modularidad por dominio**: agrupa páginas y servicios por dominio funcional para reducir
  acoplamiento.
- **Componentes pequeños y cohesivos**: cada componente Lit debe cumplir una sola función.
- **Flujo de datos explícito**: propiedades y eventos bien tipados entre componentes.
- **Extensiones y composición**: crea variantes en `samba` con composición en vez de herencia.
- **Optimización incremental**: prioriza rendimiento con lazy loading y split de rutas.

## Estructura recomendada

- `packages/app/src/pages`: vistas y rutas (una carpeta por dominio).
- `packages/app/src/elements`: componentes específicos de la app.
- `packages/app/src/services`: acceso a API, almacenamiento local y lógica de sesión.
- `packages/samba/src/components`: componentes reutilizables y tokens de UI.
- `packages/common/src`: tipos, utilidades y modelos compartidos.

## Patrones

- **Lit + TypeScript**: usa `@property`, `@state` y `@customElement` con tipado estricto.
- **Eventos de dominio**: expón eventos `CustomEvent` tipados en `samba` para desacoplar la app.
- **Servicios con interfaces**: define contratos en `common` y concreta implementaciones en
  `app/services`.
- **Separación de estados**: estado de UI en componentes, estado de sesión/negocio en servicios.
- **Carga diferida**: rutas en `app` con imports dinámicos y componentes pesados en `samba`.

## Testing

- **Unitarios**: componentes Lit con Web Test Runner y fixtures por componente.
- **Integración ligera**: pruebas de flujos críticos en `packages/app/test`.
- **Cobertura focalizada**: prioriza componentes compartidos (`samba`) y servicios (`app`).
- **Mocks de API**: usa stubs basados en `openapi.yaml` para respuestas consistentes.

## CI

- Ejecuta `yarn validate` para TypeScript + ESLint en todos los paquetes.
- Ejecuta pruebas con los comandos existentes antes de merges.
- Mantén el pipeline ligero: cache de Yarn y ejecución paralela por workspace si es posible.

## Seguridad

- Centraliza manejo de tokens y sesión en `packages/app/src/services`.
- Evita almacenar secretos en código; usa variables de entorno en tiempo de build.
- Valida entradas en la capa de servicios antes de construir requests.
- Revisa dependencias periódicamente y actualiza versiones con cautela.

## Versionado

- Usa versionado semántico por paquete si se publican librerías internas.
- Mantén cambios compatibles en `samba` y documenta breaking changes en el changelog.
