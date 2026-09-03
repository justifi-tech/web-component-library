# web-component-library Agent Guidelines

## Build & Test

- **Do not run** `build`, `dev`, `start`, `format`, `clean` — per CLAUDE.md rules
- Run `pnpm test` for the unit test suite (Stencil + Jest)
- Run `pnpm test:e2e` for Playwright E2E tests (requires dev server running)
- Run `pnpm lint` for ESLint across all packages (`--max-warnings 0`)
- Validate with both unit and E2E tests when changes affect component behavior
- When working on E2E tests, read `apps/component-examples/e2e/README.md` first

## Conventions

- **Stack:** TypeScript + Stencil v4 (web components), pnpm monorepo with Turborepo
- **Component tags:** kebab-case (`justifi-order-terminals`, `form-control-text`)
- **Component classes:** PascalCase (`JustifiOrderTerminals`, `FormControlText`)
- **Customer-facing components:** prefixed with `justifi-` and have shadow DOM enabled. Internal components don't.
- **Files:** kebab-case, co-located with tests (`component-name.tsx` + `component-name.spec.tsx`)
- **Functions/variables:** camelCase (`formatCurrency`, `makeGetBusiness`)
- **Entity models:** PascalCase classes wrapping API responses (`new Business(data)`)
- **CSS parts:** kebab-case strings defined in `src/styles/parts.ts`
- **Imports order:** Stencil core → UI components → utils → API/services → actions → styles (all relative paths, no aliases)
- **Data fetching:** Curried action factories (`makeGetBusiness`) with `onSuccess`/`onError` callbacks
- **Error handling:** `ComponentErrorCodes` enum + `error-event` emission via `@Event()` decorator
- **State:** Stencil `@State()` for local, Stencil Store for shared state
- **Testing:** `newSpecPage()` + snapshot tests for units; Playwright for E2E

### Interfaces and Dependencies

- **Use interfaces for external dependencies.** Database access, HTTP clients, external services — anything that crosses a boundary.
- **Mock at boundaries, not internals.** Mock the interface, not implementation details.
- **Dependency injection over globals.** Pass dependencies explicitly rather than importing singletons.
