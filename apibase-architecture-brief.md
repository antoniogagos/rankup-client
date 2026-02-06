# ARCHITECTURE_BRIEF

## 0) Resumen ejecutivo (10-15 lineas)
- Monorepo front-end para Hadron (workbench/editor) y ApiBase (OpenAPI), organizado en apps y packages. Evidencia: package.json, apps/, packages/.
- Incluye apps web de producto/marketing y SPAs principales (apibase-spa, hadronapp-spa). Evidencia: apps/apibase/package.json, apps/apibase-spa/package.json, apps/hadronapp/package.json, apps/hadronapp-spa/package.json.
- UI basada en Web Components con Lit en apps y librerias core. Evidencia: apps/apibase-spa/package.json, apps/hadronapp-spa/package.json, packages/mambo-ui/package.json.
- Workbench provee framework de editores/paneles y modelo de contribuciones. Evidencia: packages/hadron/README.md.
- Dominio OpenAPI modularizado bajo packages/apibase/domains con reglas de import. Evidencia: packages/apibase/domains/README.md.
- Sistema de extensiones con activationEvents y aislamiento en worker/iframe. Evidencia: packages/extensions/README.md.
- Uso de workers y Comlink para tareas pesadas (spec, git, prettier, CSS). Evidencia: packages/base/worker/createWorker.ts, packages/apibase/domains/openApi/spec/worker/client.ts, packages/platform/repositories/wasm-git/wasmGitWorker.ts.
- Tooling: Yarn workspaces + wireit para orquestar build/test/lint. Evidencia: package.json.
- Bundle de produccion con Rollup y compilacion de plantillas Lit. Evidencia: rollup.config.mjs.
- Dev server con @web/dev-server y configuracion de COOP/COEP. Evidencia: web-dev-server.config.mjs.
- Testing con Vitest y Playwright (browser mode). Evidencia: vitest.config.cts.
- Cliente API generado desde OpenAPI (typescript-fetch) y deploy script con endpoints. Evidencia: packages/api-client/openapitools.json, .scripts/deploy.js.

## 1) Mapa del repositorio (vista superior)

| Componente | Ruta | Tipo | Responsabilidad | Como se ejecuta (comando) | Evidencia |
| --- | --- | --- | --- | --- | --- |
| Tooling monorepo | . | tool/infra | Workspaces, scripts build/test/lint, config global | `yarn test` / `yarn start-ha` | package.json, rollup.config.mjs, web-dev-server.config.mjs |
| ApiBase web (marketing/docs) | apps/apibase | app | Sitio web/landing/docs de ApiBase | `yarn workspace @ha/apibase-web start` | apps/apibase/package.json, apps/apibase/docs.html |
| ApiBase SPA | apps/apibase-spa | app | SPA principal de ApiBase | `yarn workspace @ha/apibase-spa start` | apps/apibase-spa/package.json |
| ApiBase auth | apps/apibase-auth | app | UI/auth para cognito/amplify | N/A (sin scripts en package.json) | apps/apibase-auth/package.json |
| Hadron web (marketing) | apps/hadronapp | app | Sitio web de Hadron | `yarn workspace @ha/hadronapp-web start` | apps/hadronapp/package.json |
| Hadron SPA | apps/hadronapp-spa | app | App principal de Hadron + proxy GitHub local | `yarn workspace @ha/hadronapp-spa start` | apps/hadronapp-spa/package.json, apps/hadronapp-spa/README.md |
| Workbench core | packages/hadron | lib | Framework de editores/paneles, contribuciones | `yarn workspace @ha/hadron start-contrib` | packages/hadron/README.md, packages/hadron/package.json |
| ApiBase domain/core | packages/apibase | lib | Dominio OpenAPI, servicios y workbench ApiBase | `yarn workspace @ha/apibase start-contrib` | packages/apibase/package.json, packages/apibase/domains/README.md |
| Web editor | packages/web-editor | lib | Editor web embebible | `yarn workspace @ha/web-editor start` | packages/web-editor/package.json |
| HTML editor | packages/html-editor | lib | Editor HTML embebible | N/A (sin scripts en package.json) | packages/html-editor/package.json |
| Mambo UI | packages/mambo-ui | lib | Design system y componentes UI | `yarn workspace @ha/mambo-ui start` | packages/mambo-ui/package.json |
| Base utilities | packages/base | lib | Utilidades comunes, workers y helpers | N/A (lib) | packages/base/package.json, packages/base/README.md |
| Platform services | packages/platform | lib | Inyeccion de servicios y base de capas | N/A (lib) | packages/platform/README.md, packages/platform/package.json |
| API client | packages/api-client | lib/tool | Cliente generado desde OpenAPI | `yarn workspace @ha/api-client generate-api` | packages/api-client/openapitools.json |
| Extensions | packages/extensions | lib | Sistema de extensiones y contrato | N/A (lib) | packages/extensions/README.md |
| Icon fonts | packages/mambicons | tool/lib | Pipeline de icon fonts y assets | `yarn workspace @ha/icons start` | packages/mambicons/package.json |
| Browser tooling | packages/browser-* | lib | Bundler/servidor en browser | N/A (lib) | packages/browser-web-server/package.json, packages/browser-web-bundler/package.json |
| Lint rules | packages/eslint, packages/stylelint | tool | Reglas ESLint/Stylelint compartidas | N/A (lib) | packages/eslint/package.json, packages/stylelint/package.json |
| Community modules | community | docs/lib | Modulos comunitarios desplegados aparte | N/A (lib) | community/README.md, community/package.json |

## 2) Arquitectura del sistema (C4-lite)

### 2.1 Contexto y limites
- Limite del sistema: apps web y librerias front-end del monorepo (sin servicios backend definidos como workspace). Evidencia: package.json, apps/, packages/.
- Dependencias externas: GitHub para acceso a repos y proxy local en dev. Evidencia: apps/hadronapp-spa/README.md, apps/hadronapp-spa/package.json, github-auth.example.json.
- Autenticacion externa via AWS Cognito/Amplify en ApiBase Auth. Evidencia: apps/apibase-auth/package.json.
- Backend API externo consumido via cliente generado desde OpenAPI. Evidencia: packages/api-client/openapi.yaml, packages/api-client/openapitools.json.
- Modulos community se despliegan fuera del bundle principal (S3 u otro storage). Evidencia: community/README.md.

### 2.2 Contenedores (componentes desplegables)
- ApiBase SPA (apps/apibase-spa): app web principal, consume workbench, dominio OpenAPI y UI libs. Evidencia: apps/apibase-spa/package.json, packages/apibase/package.json, packages/hadron/package.json.
- Hadron SPA (apps/hadronapp-spa): app web principal de Hadron. Evidencia: apps/hadronapp-spa/package.json.
- Sitios estaticos (apps/apibase, apps/hadronapp): landing/docs. Evidencia: apps/apibase/package.json, apps/hadronapp/package.json.
- Extension host: corre en Web Worker + iframe y comunica por postMessage. Evidencia: packages/extensions/README.md.
- OpenAPI spec worker: SharedWorker + Comlink para edicion/lectura de spec. Evidencia: packages/apibase/domains/openApi/spec/worker/client.ts, packages/apibase/domains/openApi/spec/worker/server.shared.ts.
- Git worker (wasm-git): operaciones Git via Comlink en worker. Evidencia: packages/platform/repositories/wasm-git/wasmGitWorker.ts.
- API backend (externo): consumido por @ha/api-client. Evidencia: packages/api-client/openapi.yaml.

Diagrama ASCII (flujo end-to-end, alto nivel):
[Browser]
  |-- ApiBase SPA (apps/apibase-spa)
  |     |-- Workbench (packages/hadron)
  |     |-- OpenAPI domain (packages/apibase)
  |     |-- UI libs (packages/mambo-ui, packages/base)
  |     |-- Spec Worker (SharedWorker + Comlink)
  |     `-- API backend via @ha/api-client (HTTP)
  |
  `-- Hadron SPA (apps/hadronapp-spa)
        |-- Workbench/Editors (packages/hadron, packages/web-editor)
        |-- Git worker (wasm-git + Comlink)
        `-- GitHub (token/proxy)
Evidencia: apps/apibase-spa/package.json, apps/hadronapp-spa/package.json, packages/hadron/README.md, packages/apibase/domains/openApi/spec/worker/client.ts, packages/platform/repositories/wasm-git/wasmGitWorker.ts, packages/api-client/openapi.yaml.

### 2.3 Capas internas por componente (si aplica)
- Workbench (packages/hadron) separa api/common/browser/services/contrib/viewletsContrib/ui. Evidencia: packages/hadron/README.md.
- Dominios (packages/apibase/domains) proponen estructura models/project/services/ui y reglas de imports. Evidencia: packages/apibase/domains/README.md.
- Platform usa patron common/browser/node/worker para implementaciones por runtime. Evidencia: packages/platform/README.md.
- ApiBase package agrupa core/services/workbench/domains/ui. Evidencia: packages/apibase/.
- Base package agrupa common/browser/node/worker. Evidencia: packages/base/.

## 3) Contratos e integraciones
- API principal: @ha/api-client generado con openapi-generator (typescript-fetch) desde openapi.yaml. Evidencia: packages/api-client/openapitools.json, packages/api-client/openapi.yaml.
- AuthN/AuthZ: ApiBase Auth usa AWS Cognito/Amplify. Evidencia: apps/apibase-auth/package.json.
- Integracion GitHub: token local y proxy server en dev para Hadron. Evidencia: apps/hadronapp-spa/README.md, apps/hadronapp-spa/package.json, github-auth.example.json.
- Contrato de extensiones: manifiesto package.json con activationEvents/contributes/activate. Evidencia: packages/extensions/README.md.
- Mensajeria/eventos (queues/topics): No encontrado. Buscado en: package.json, apps/, packages/, docs/, scripts/. Evidencia: package.json, apps/, packages/, docs/.
- Persistencia: operaciones Git en browser via wasm-git worker. Evidencia: packages/platform/repositories/wasm-git/wasmGitWorker.ts.
- Persistencia DB/migraciones: No encontrado. Buscado en: packages/, apps/, docs/. Evidencia: packages/, apps/, docs/.

## 4) Librerias compartidas y reutilizacion

| Paquete/libreria | Ruta | Que resuelve | Como se consume | Grado de acoplamiento | Reutilizable en repo nuevo | Evidencia |
| --- | --- | --- | --- | --- | --- | --- |
| @ha/base | packages/base | Utilidades comunes, helpers y workers | Dependencia directa/peer de otros paquetes | Medio | Si, base comun (sin UI) | packages/base/package.json, packages/base/README.md |
| @ha/platform | packages/platform | Inyeccion de servicios y capa base | Peer dependency en paquetes core | Alto | Si, si se adopta misma arquitectura | packages/platform/README.md, packages/platform/package.json |
| @ha/mambo-ui | packages/mambo-ui | Design system y componentes UI | Peer dependency en apps/libs | Medio | Si, si se adopta DS | packages/mambo-ui/package.json |
| @ha/hadron | packages/hadron | Workbench/framework de editores | Peer dependency en apps | Alto | Si, si se adopta workbench | packages/hadron/README.md |
| @ha/apibase | packages/apibase | Dominio OpenAPI + workbench ApiBase | Peer dependency en apps | Alto | Solo si el repo nuevo es OpenAPI-first | packages/apibase/package.json, packages/apibase/domains/README.md |
| @ha/api-client | packages/api-client | Cliente API generado desde OpenAPI | Import directo desde apps | Bajo | Si, si backend es el mismo | packages/api-client/openapitools.json |
| @ha/extensions | packages/extensions | API/host de extensiones | Import desde workbench/apps | Medio | Si, si se requiere extensibilidad | packages/extensions/README.md |
| @ha/web-editor + @ha/html-editor | packages/web-editor, packages/html-editor | Editores embebibles | Peer dependency en workbench | Medio | Si, si se usa editor visual | packages/web-editor/package.json, packages/html-editor/package.json |
| @ha/icons (mambicons) | packages/mambicons | Icon fonts y assets | Usado por base/assets/ui | Medio | Si, si se mantiene set de iconos | packages/mambicons/package.json |

## 5) Decisiones arquitectonicas (ADRs implicitos)
- Monorepo con Yarn workspaces y alias @ha/* -> comparte libs y build coordinado -> trade-off: acoplamiento al layout del repo. Evidencia: package.json, tsconfig-base.json.
- Wireit como orquestador de tareas -> dependencias declarativas y cacheo -> trade-off: tooling especifico. Evidencia: package.json.
- UI basada en Lit/Web Components -> componentes reutilizables entre apps -> trade-off: curva de aprendizaje y performance. Evidencia: apps/apibase-spa/package.json, packages/mambo-ui/package.json.
- Workbench con modelo de contribuciones/viewlets -> extensibilidad interna -> trade-off: reglas estrictas de dependencias. Evidencia: packages/hadron/README.md.
- Dominios con reglas de import (no cross-domain) -> aislamiento funcional -> trade-off: mas boilerplate. Evidencia: packages/apibase/domains/README.md.
- Extension host aislado en worker/iframe -> seguridad/aislamiento -> trade-off: limites de API y overhead. Evidencia: packages/extensions/README.md.
- Spec discovery con estados discriminados y resolucion en UI -> UX controlable -> trade-off: mas manejo de estados. Evidencia: docs/adr/0001-spec-discovery-status.md, docs/dev/spec-resolution.md.
- Workers + Comlink para tareas pesadas (spec/git/prettier) -> evita bloquear UI -> trade-off: complejidad de serializacion. Evidencia: packages/base/worker/createWorker.ts, packages/apibase/domains/openApi/spec/worker/client.ts, packages/platform/repositories/wasm-git/wasmGitWorker.ts.
- Dev server con COOP/COEP y middleware custom -> habilita SharedArrayBuffer/extensiones -> trade-off: config mas compleja. Evidencia: web-dev-server.config.mjs.
- Rollup build con lit compiler + terser + postcss -> bundles optimizados -> trade-off: pipeline complejo. Evidencia: rollup.config.mjs.

## 6) Operacion: build, test, CI/CD, despliegue
- Instalacion local: Node >=18 <19 y Yarn 4.x. Evidencia: package.json.
- Dev: `yarn start-ha` (Hadron + web-editor) y `yarn start-ab` (ApiBase web) o `yarn workspace @ha/apibase-spa start`. Evidencia: package.json, apps/apibase-spa/package.json.
- Build: `yarn build-ha` y `yarn build-ab` (tsc -b + rollup). Evidencia: package.json.
- Tests: `yarn test`, `yarn test:browser`, `yarn test:unit` con Vitest/Playwright. Evidencia: package.json, vitest.config.cts.
- Lint: `yarn lint` usa config compartida. Evidencia: package.json, packages/eslint/eslint.config.js.
- CI/CD: No encontrado (no .github/workflows). Buscado en: .github/. Evidencia: .github/CODEOWNERS.
- Despliegue: script .scripts/deploy.js con endpoints y CloudFront/S3. Evidencia: .scripts/deploy.js.
- Config/env: JSONs por app y runtime env injection en dev server. Evidencia: apps/hadronapp-spa/env.json, apps/apibase-spa/config.json, web-dev-server.config.mjs.

## 7) Seguridad y cumplimiento (minimo viable)
- Auth: ApiBase Auth depende de AWS Cognito/Amplify. Evidencia: apps/apibase-auth/package.json.
- GitHub token local (github-auth.json) para dev. Evidencia: apps/hadronapp-spa/README.md, github-auth.example.json.
- COOP/COEP habilitado en dev server para aislamiento cross-origin. Evidencia: web-dev-server.config.mjs.
- Gestion de secretos centralizada: No encontrado (no vault/secret manager). Buscado en: .github/, scripts/, .scripts/. Evidencia: .github/CODEOWNERS, .scripts/.
- SAST/Dependabot/scan containers: No encontrado. Buscado en: .github/. Evidencia: .github/CODEOWNERS.

## 8) Checklist para el repo "inicial" (transferencia)
- [ ] Estructura base: `apps/` + `packages/` con workspaces y alias `@ha/*`. Evidencia: package.json, tsconfig-base.json.
- [ ] Mantener Workbench y reglas de contrib si se necesita editor/plataforma extensible. Evidencia: packages/hadron/README.md.
- [ ] Estructura de dominios (models/project/services/ui) si se replica OpenAPI. Evidencia: packages/apibase/domains/README.md.
- [ ] Design system consistente (Mambo UI o equivalente) con dependencias peer. Evidencia: packages/mambo-ui/package.json.
- [ ] Tooling estandar: wireit + tsc -b + rollup + wds. Evidencia: package.json, rollup.config.mjs, web-dev-server.config.mjs.
- [ ] Testing minimo: vitest unit + browser (playwright). Evidencia: vitest.config.cts.
- [ ] Config separada por app (env/config JSON) y runtime env injection. Evidencia: apps/hadronapp-spa/env.json, apps/apibase-spa/config.json, web-dev-server.config.mjs.
- [ ] Si hay extensiones, aislar en worker/iframe y definir activationEvents. Evidencia: packages/extensions/README.md.
- [ ] No hacer: scripts que apunten a rutas inexistentes o configs faltantes. Evidencia: package.json, tsconfig-apibase.json.
- [ ] No hacer: confiar en hooks desactivados para lint/format en lugar de CI. Evidencia: .husky/pre-commit, package.json.

## 9) Gaps y deuda del repo avanzado (solo lo relevante)
- README referencia .docs/project-structure.md pero .docs/ no existe. Evidencia: README.md, .docs/.
- build-ha/clean-ha referencian tsconfig-hadron.json que no existe. Evidencia: package.json, tsconfig-hadron.json (no encontrado).
- tsconfig-apibase.json excluye rutas que no existen (packages/workbench, packages/browser-web-bundle). Evidencia: tsconfig-apibase.json, packages/.
- pre-commit hook tiene lint-staged comentado, no se ejecuta localmente. Evidencia: .husky/pre-commit, package.json.
- No hay workflows CI en .github/workflows. Evidencia: .github/CODEOWNERS.
- Extensions README indica "WORK IN PROGRESS" (API inestable). Evidencia: packages/extensions/README.md.
- Deploy script usa endpoints/IDs hardcodeados (CloudFront/S3) en lugar de config. Evidencia: .scripts/deploy.js.
