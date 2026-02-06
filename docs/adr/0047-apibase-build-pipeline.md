# 0047: Apibase-style build + dev pipeline (tsc -b + rollup + WDS/esbuild)

## Status

Accepted — 2026-02-02

## Context

Rankup needs a robust, VS Code/Apibase-grade build pipeline. The previous dev flow relied on
`tsc --watch` emitting to `dist/` and the dev server rewrote imports to `dist/**`, which
created drift, slow feedback, and mismatched runtime/TS sources. Apibase uses:

- a root `tsc -b` build for project references,
- Rollup as the final bundle step (HTML entrypoints), and
- WDS + esbuild to serve TS directly in dev (no `dist/` dependency).

We want that same model with no transitional shims or legacy compatibility.

## Decision

Adopt the Apibase-style pipeline:

- Root build: `tsc -b tsconfig-build.json` → Rollup bundle → `tsc -b --clean`.
- Rollup config is `rollup.config.ts` (TS-only repo policy) with Lit compilation,
  HTML entrypoints, minification, and asset handling.
- Dev server is centralized in `web-dev-server.config.mjs` and uses esbuild to
  compile TS on-the-fly. App configs (`apps/*/web-dev-server.config.mjs`) extend it.
- Remove `dist/`-based dev rewrites and `tsc --watch` from app start scripts.

## Consequences

- Dev server serves TS directly; no `dist/` artifacts are required for dev.
- Build output lives in `dist/` only as Rollup output.
- `tsc -b` output is ephemeral and cleaned after build.
- Apps use WDS config inheritance and no longer manage asset copies during start.

## Verification

- `yarn build`
- `yarn validate`

## Implementation update (2026-02-03)

- `__APP_ENV__` is the sole runtime env source; platform no longer imports `env.json.example`.
- Rollup HTML inputs use `apps/**/*.html` to mirror Apibase’s HTML entry globbing.
- `.tsbuildinfo` artifacts are ignored (build outputs remain local-only).
- WDS config is now `.mjs` (explicit exception to TS-only policy) so WDS loads it without
  `node --import tsx` shims; SPA fallback stays reliable.
- Wireit is listed as a devDependency in app packages so workspace start scripts resolve it.
- WDS base config exposes `createWebDevServerConfig(appRoot)` so app configs set an
  explicit root directory regardless of the shell cwd.
- WDS now maps `**/*.ts` to JS and uses an outside-root depth prefix,
  ensuring module scripts and workspace assets resolve with correct MIME types.
- WDS repo-root detection now walks to the workspace package name (rk-app),
  with `nodeResolve.rootDir` + `nodeResolve.jail` + `preserveSymlinks=false`
  to keep node_modules resolution aligned with Hadron and block outside-root
  depth escapes.
