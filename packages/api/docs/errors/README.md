# Rankup API Error Types (Problem Details)

This catalog defines stable `type` URIs for RFC 9457 Problem Details responses.

## Guidelines

- `type` is stable and maps to a single error class.
- `title` is invariant per `type`.
- `detail` is occurrence-specific and must avoid sensitive data.
- `instance` identifies the occurrence (use a URN or request/trace id).
- Extensions are allowed (e.g., `code`, `errors`, `invalidParams`).

## Catalog (initial)

### Auth

- `https://errors.rankup.dev/auth/unauthorized`
  - Title: `Unauthorized`
  - Status: 401
- `https://errors.rankup.dev/auth/forbidden`
  - Title: `Forbidden`
  - Status: 403

### Validation

- `https://errors.rankup.dev/validation/invalid-request`
  - Title: `Invalid request`
  - Status: 400
- `https://errors.rankup.dev/validation/failed`
  - Title: `Unprocessable entity`
  - Status: 422

### Rate limiting

- `https://errors.rankup.dev/rate-limit/too-many-requests`
  - Title: `Too Many Requests`
  - Status: 429

### Concurrency

- `https://errors.rankup.dev/precondition/failed`
  - Title: `Precondition Failed`
  - Status: 412

### Conflict

- `https://errors.rankup.dev/conflict/state`
  - Title: `Conflict`
  - Status: 409

### Tournaments

- `https://errors.rankup.dev/tournaments/not-found`
  - Title: `Tournament not found`
  - Status: 404

### Submissions

- `https://errors.rankup.dev/submissions/locked`
  - Title: `Submissions locked`
  - Status: 409

### Matchdays

- `https://errors.rankup.dev/matchdays/closed`
  - Title: `Matchday closed`
  - Status: 409

### Uploads & media

- `https://errors.rankup.dev/uploads/payload-too-large`
  - Title: `Payload Too Large`
  - Status: 413
- `https://errors.rankup.dev/uploads/unsupported-media-type`
  - Title: `Unsupported Media Type`
  - Status: 415

### Generic

- `about:blank`
  - Title varies by status
  - Status: any
  - Use for generic 4xx/5xx when a specific `type` is not warranted.
