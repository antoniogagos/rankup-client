# Services architecture (normative)

## Purpose

Define the service model for Rankup so UI packages never construct dependencies or select runtime implementations.
API request flow is specified in `docs/architecture/api-request-flow.md`.

## Definitions

-   Service: Stable contract plus an implementation registered in a composition root. Services are consumed by injection (directly or via controllers) and respect scopes.
-   Contract: TypeScript types and service interfaces only.
-   Implementation: Runtime code that talks to HTTP, storage, or other IO.
-   Composition root: The single place where implementations are selected and wired.

## Contract vs implementation

-   `@rankup/api` is contract-only: OpenAPI types + interfaces.
-   Domain DTOs live in `@rankup/rankup/domains/*/<capability>/contracts/types` and are the only types UI may consume.
-   Implementations live outside the contract and are never imported by UI packages.
-   UI packages consume services, not implementation factories or SDK runtimes.
-   Domain layout follows a Hadron-style capability split: `shared/` (IDs/enums), plus `<capability>/models`, `<capability>/contracts`, `<capability>/services`, and `<capability>/validation`.

## Composition root

-   The composition root chooses mock vs real implementations.
-   The composition root wires SDK clients into app-owned gateways.
-   The composition root exposes services to the UI (AppContext or registry).
-   Only the composition root may import mock or HTTP implementations.

## Service boundaries

-   Services must be cohesive by domain. Avoid a single monolithic service.
-   Examples (non-exhaustive):
    -   IAuthService
    -   ITournamentCoreService
    -   ITournamentMatchdaysService
    -   ITournamentRankingService

## Lit usage (UI consumption)

-   UI components do not construct services or clients.
-   UI components read services from context (app-scoped registry) and call interface methods.
-   No fetch calls in UI packages (see `docs/architecture/ui-packages.md`).
-   UI packages must not inject SDK clients or gateways directly.

## Scopes / lifetimes

-   app-scope (current): application-wide singletons.
-   future: tournament-scope or game-scope for per-tournament state.

## Prohibitions

-   UI packages must not import `@rankup/api-mock` or any HTTP implementation.
-   UI packages must not depend on `@rankup/api`.
-   No direct `fetch` in UI packages.

## Enforcement

-   ESLint rules enforce import restrictions.
-   `yarn validate` runs guardrails and lint.
-   Service catalog is defined in `docs/architecture/service-catalog.md`.

## Dependency injection (DI)

The DI model is defined in `docs/architecture/di.md` and is normative.
Services must be registered in the composition root and consumed via injection.
