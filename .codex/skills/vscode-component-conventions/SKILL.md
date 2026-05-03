---
name: "vscode-component-conventions"
description: "Enforce VS Code-aligned conventions for events, component structure, regions, properties/state, CSS naming with ITCSS+BEM, semantic rigor, token usage, and TypeScript constraints. Use when editing or reviewing TS/Lit UI components that must follow VS Code patterns."
---

# VS Code Component and Event Conventions

Apply VS Code conventions for events, component structure, regions, CSS, tokens, and TypeScript. Output must follow these rules without explanation.
JSDoc must declare the public surface that applies; do not add non-applicable sections or placeholders.

Refinamiento **estricto**, alineado con la práctica real de **VS Code** (sin ruido, sin secciones vacías):

---

## 0. Component JSDoc Header (Mandatory)

-   Every component **must declare a JSDoc block immediately above the `@customElement` decorator**.
-   This JSDoc defines the **public surface only** (API contract).
-   **Only include sections that actually apply** to the component.

    -   **Do not declare empty sections**.
    -   **Never use `none`**.

-   This header is authoritative; **do not duplicate** the same information elsewhere.

### Allowed sections (conditional)

-   `@element` (mandatory)
-   `@event` (repeatable; only if the component fires events)
-   `@csspart` (only if parts are exposed)
-   `@cssproperty` (only if css property are declared)
-   `@slot` (only if slots exist)

Never use `@events` (non-standard JSDoc).

### Conventions (VS Code–aligned)

-   Omit any section with zero entries.
-   Do not add placeholder bullets.
-   Keep entries declarative and minimal.
-   Events documented here must correspond to typed event classes and emitted DOM event names.
-   Properties listed here **must** be public API, not internal state.
-   Missing or incomplete JSDoc **is a violation**, even if the implementation is correct.

### Example with full surface

```ts
/**
 * @element mb-example
 *
 * @event didChangeValue {DidChangeValueEvent}
 *
 * @csspart
 * - container: Root container
 * - label: Visible label
 *
 * @slot default - Main content
 */
```

**Rule of thumb (VS Code style):**

> If it does not exist, it is not mentioned. If it is mentioned, it is part of the contract.
