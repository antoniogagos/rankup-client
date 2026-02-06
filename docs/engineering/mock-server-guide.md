# Mock server guide (contract-first, local dev)

This guide explains how to run and verify the local HTTP mock server.

## Quick start

```bash
yarn workspace @rankup/api-mock dev:server
```

Default base URL: `http://localhost:4010`

## Smoke tests

```bash
yarn workspace @rankup/api-mock smoke:scenario
```

This script starts a temporary server, exercises scenario headers, and exits non-zero on failure.

## Scenario controls (headers or query)

-   `x-rankup-mock-delay-ms: <number>`
-   `x-rankup-mock-force-status: 401|403|404|429|500`
-   `x-rankup-mock-reset: 1`
-   `x-rankup-mock-auth: required|disabled`

Examples:

```bash
curl -H "x-rankup-mock-force-status: 500" http://localhost:4010/competitions
curl "http://localhost:4010/tourneys?x-rankup-mock-delay-ms=300"
curl -H "x-rankup-mock-auth: required" http://localhost:4010/competitions
curl -H "x-rankup-mock-reset: 1" http://localhost:4010/tourneys
```

## What to expect

-   Requests route by `operationId` from `packages/api/openapi.yaml`.
-   Valid requests return either a core handler response or a spec-valid mock.
-   Invalid requests return `400` with a validation payload.
-   `x-rankup-mock-reset` clears the in-memory store.

## Troubleshooting

-   If you see `ECONNREFUSED`, ensure the server is running and the port is correct.
-   If a response is `404`, confirm the path exists in `packages/api/openapi.yaml`.
-   If a request returns `400`, check the validation errors in the response body.
