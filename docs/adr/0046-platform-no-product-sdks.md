# 0046: Platform is infra-only (no product SDK imports)

## Status

Accepted — 2026-02-02

## Context

`@rankup/platform` must remain infrastructure-only. It previously imported product SDKs
(`@rankup/api`, `@rankup/api-mock`) via the Rankup API client and mock selector, which
coupled platform to product concerns and violated the Apibase-aligned boundary model.

We need platform to expose only DI primitives + infra services, while product-specific
API clients live in the host/app layer.

## Decision

- Move Rankup API client creation (`createRankupApiClient`, `createHttpRankupApiClient`)
  into app services (`apps/rankup-spa/services/api/**`).
- Move the `IRankupApiClient` service identifier into the domain umbrella
  (`packages/domain-tournament/contracts/rankupApiClient.ts`).
- `registerPlatformServices` no longer accepts/registers the API client.
- Composition root registers `IRankupApiClient` directly in the app.
- Add guardrails to forbid product SDK imports inside `packages/platform`.
- Allow `@rankup/api-mock` imports only in app `services/api` wiring.

## Consequences

- Platform is now infra-only (no product SDK dependencies).
- App hosts own mock-vs-http selection and API client wiring.
- Domain services depend on `IRankupApiClient` from the domain package, not platform.
- Future domains follow the same pattern: API clients live in app/services.

## Verification

- `yarn validate`

## Update (2026-02-02)

- `IRankupApiClient` removed from the domain layer in favor of domain gateways (ADR 0048).
- `@rankup/api-mock` imports are now allowlisted in the app composition root, keeping `services/api/**` HTTP-only.
