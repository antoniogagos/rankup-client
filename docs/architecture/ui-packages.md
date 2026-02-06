# UI packages (definition)

UI packages are the user-facing layer that must not construct dependencies, select runtime implementations, or perform network I/O directly.

Paths:

-   `apps/rankup-spa/pages/**`
-   `apps/rankup-spa/elements/**`
-   `packages/samba/**`

UI packages must not import SDK contracts from `@rankup/api`. Use domain contracts instead.

References:

-   ADR 0010 (UI does not import API implementations)
-   `docs/architecture/services.md`
-   `docs/architecture/di.md`
