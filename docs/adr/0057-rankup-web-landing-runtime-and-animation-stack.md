# ADR 0057: Rankup-web landing runtime and animation stack

-   Status: Accepted
-   Date: 2026-02-06
-   Owners: Rankup maintainers
-   Scope: apps/rankup-web, packaging, UX runtime behavior

## Context

`apps/rankup-web` existed as a placeholder and did not implement the conversion-focused landing defined in `docs/landing-page.md`.

The landing now requires:

-   Full narrative sections (preloader + sections 1..11 + persistent visual background).
-   High-impact motion while preserving performance and reduced-motion behavior.
-   Hard separation from the SPA runtime (`apps/rankup-spa`) per ADR 0042.

## Decision

-   Implement the landing as a dedicated Lit app in `apps/rankup-web/src/rk-web-landing.ts`.
-   Keep runtime independent from SPA internals (no composition root/domain/service wiring).
-   Use a native Canvas particle field (`RankupParticleField`) for persistent background motion.
-   Use GSAP (`gsap`, `ScrollTrigger`) for high-value reveal/scroll animations.
-   Keep CTA conversion path explicit to the SPA signup route: `/es/registro`.
-   Add SEO baseline on the landing HTML: canonical, Open Graph, Twitter cards, and `SoftwareApplication` JSON-LD.

## Constraints

-   No UI tests (ADR 0002).
-   TS-only tracked sources (ADR 0005, ADR 0017).
-   App split remains explicit (`apps/rankup-web` vs `apps/rankup-spa`) per ADR 0042.
-   Respect `prefers-reduced-motion` for all non-essential animation paths.

## Consequences

### Positive

-   Landing/marketing changes are isolated from product SPA runtime.
-   Rich motion language can evolve independently in `@rankup/web`.
-   Conversion-focused UX is implemented in the dedicated deploy target.

### Negative / Risks

-   Animation complexity can regress performance if not monitored.
-   Additional frontend dependency surface in `@rankup/web`.

## Verification

-   `yarn workspace @rankup/web build`
-   `yarn validate`

Expected: PASS
