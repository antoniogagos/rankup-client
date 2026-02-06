---
name: vscode-component-conventions
description: Enforce VS Code-aligned conventions for events, component structure, regions, properties/state, CSS naming with ITCSS+BEM, semantic rigor, token usage, and TypeScript constraints. Use when editing or reviewing TS/Lit UI components that must follow VS Code patterns.
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

## 1. Events

### 1.1 Naming

-   camelCase, describing completed actions or intent.
-   Use `didX` / `willX` for emitted DOM events.
-   Reserve `onDidX` / `onWillX` for `Event<T>` accessors, not event names.
-   Never generic names (`change`, `update`, `refresh`).

### 1.2 Exposure

-   Events are readonly properties.
-   Never expose string-based event names.

### 1.3 Emitters

-   Use native events for web components not vscode emitters

### 1.4 Event payloads

-   One dedicated class per event.
-   PascalCase + `Event` suffix.
-   Explicit, readonly fields only; no `any` or ambiguous flags.

```ts
export class WillChangeCheckedEvent extends Event {
	constructor(public readonly checked: boolean, public readonly sourceEvent?: Event) {
		super('willChangeChecked', { bubbles: true, composed: true, cancelable: false });
	}
}
export class DidAfterShowEvent extends Event {
	constructor() {
		super('didAfterShow', { bubbles: true, cancelable: false, composed: true });
	}
}
```

## 2. `#region` Usage

-   Use only when it improves readability.
-   Always include `#region Render` and `#region Styles`.
-   Never for trivial or single-line grouping.

## 3. Component Order

1. Imports
2. Types / interfaces / enums
3. Decorators
4. Properties
5. State
6. Queries
7. Constructor / lifecycle
8. Public methods
9. Private methods
10. `render()`
11. Render helpers
12. Styles

## 4. Functions

-   No arrow functions as component methods.
-   Bind explicitly ONLY when required. Before using a bind first see if it's necessary. ONLY DO THIS IF STRICTLY NECESSARY TO BIND THIS IF NOT THEN CREATE A NORMAL FUNCTION.
-   Using bound function if it's not strictly necessary **is a violation**.

```ts
#boundOnClearToDefault = this.#onClearToDefault.bind(this);

#onClearToDefault() {
	this._pendingFocusServerIndex = null;
}
```

## 5. Comments

-   Only when they add non-obvious context.
-   Match VS Code tone; avoid restating code.

## 6. Block Grouping

-   No blank lines inside a logical block.
-   One blank line between different block types.

## 7. Styles and Tokens

-   Use only tokens from `/packages/mambo-ui/tokens`.
-   Missing token ⇒ add it in the correct layer, then use it consistently.

## 8. CSS Naming (ITCSS + BEM)

### 8.1 Rules

-   ITCSS defines _where_ the class lives.
-   BEM defines _what it represents_.
-   States only via BEM modifiers (`--`).
-   Never use state-only or generic classes.

```css
/* Correct */
.server-list {
}
.server-list__item {
}
.server-list__item--selected {
}

/* Incorrect */
.wrapper {
}
.panel-top {
}
.item-active {
}
```

### 8.2 CSS Nesting (ITCSS + BEM)

-   Use flat selectors as the default.
-   Never use nesting to express BEM (`__`, `--`) or DOM hierarchy.
-   Nesting is allowed **only** for:
    -   pseudo-classes and pseudo-elements
    -   media / container queries
    -   strictly local selector refinements
-   Never nest across ITCSS layers.

> Nesting is syntactic sugar, not a structural model.

## 9. TypeScript Constraints

-   Avoid `as any`.
-   If strictly unavoidable: isolate, justify, and document risk.

## 10. CSS Semantics: Mandatory Scrutiny

Before adding any class, all answers must be **yes**:

-   Does it represent a clear structural, visual, or semantic role?
-   Is it a Block, Element, or Modifier?
-   Is the name intent-based, not implementation-based?
-   Does it belong to the correct ITCSS layer?
-   Would it still make sense if layout or visuals change?
-   Is it stable over time (not circumstantial)?

### Prohibited naming bases

-   Layout accidents: `left`, `right`, `wrapper`, `container`
-   Visual trivia: `blue`, `big`, `rounded`
-   Implicit state outside BEM

```css
/* Correct */
.tree-node {
}
.tree-node--focused {
}
.tree-node--disabled {
}

/* Incorrect */
.focused {
}
.node-disabled {
}
```

### Additional constraints

-   No “just in case” classes.
-   No class reuse for different semantics.
-   Shared styles ≠ shared meaning.

## Expected Output

-   Code aligned with VS Code conventions.
-   Semantic, typed, maintainable.
-   Apply rules silently; do not explain them.
