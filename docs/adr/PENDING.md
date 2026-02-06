# Pending decisions (blocked)

## P-0001: Build artifacts in git (dist/)

### Why pending

We need to confirm whether dist is used as a deploy artifact or only build output.

### Info required

-   Current deployment flow (where does the app get served from?)
-   Is any package published externally?

## P-0002: Package manager strategy (Yarn 3 vs upgrade/change)

### Why pending

We need `.yarnrc.yml` and install mode (PnP vs node-modules) and CI constraints.

### Info required

-   `.yarnrc.yml`
-   Whether PnP is enabled
-   Node version used today

## P-0003: Hosting and deploy target

### Why pending

We need to know the intended hosting/deploy target to decide build outputs, routing, and runtime config strategy.

### Info required

-   Hosting target (e.g. S3/CloudFront, Vercel, static server, etc.)
-   Deploy flow (CI/CD steps, artifact format)
-   Required runtime rewrites (e.g. locale routes)

## P-0005: Auth requirements

### Why pending

We need to confirm required auth providers and flows before locking session/auth architecture.

### Info required

-   Required providers (Cognito, Google OAuth, others?)
-   Any mandatory auth flows (MFA, refresh, logout, etc.)

## P-0006: API architecture specification for game-mode/sport extensibility

### Why pending

Epic 003 is blocked until the API architecture team provides the full specification for game modes and sport extensibility (contracts, endpoints, and data shapes).

### Info required

-   Final OpenAPI specification for game-mode + sport extensibility.
-   Any required registry or discovery endpoints.
-   Migration expectations for existing tourney flows.

Resolved: P-0007 moved to ADR 0044 (internal game-mode registry + ruleset versioning).
