# Epic 003: Game mode and sport extensibility

## Status

-   Status: Blocked (awaiting API specification from architecture)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-01
-   Note (2026-02-01): Added optional VS Code multi-root workspace file (`rankup-client.code-workspace`) for repo navigation and editor settings (ADR 0041).
-   Note (2026-01-31): While blocked, UI guardrails were tightened to forbid `IRankupApiClient` in UI and `apiClient` was removed from AppServices (ADR 0033).
-   Note (2026-02-02): Apibase-style dev now serves TS directly; package exports map `.js` subpaths to source files and `env.json.example` is injected via `__APP_ENV__` (ADR 0047 supersedes ADR 0037/0038/0039/0040).
-   Note (2026-01-31): Dev-server rewrites normalize duplicate node_modules segments for workspace runtime imports (ADR 0040).

## Goal

Enable multi-game, multi-sport extensibility via registries and scoped runtimes.

## Checklist

-   [ ] Define registries for game modes and sports
-   [ ] Add tournament-scope runtime to resolve game mode implementation
-   [ ] Document extension points and update service catalog

## Verification

-   `yarn lint`
-   `yarn validate`
