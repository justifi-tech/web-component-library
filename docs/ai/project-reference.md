# Project Reference

## Overview

Stencil.js web components monorepo managed by Turborepo and pnpm workspaces.

| Package | Path | Description |
|---|---|---|
| `@justifi/webcomponents` | `packages/webcomponents` | Main component library |
| `@justifi/webcomponents-docs` | `docs/` | Documentation package |
| `@repo/component-examples` | `apps/component-examples` | E2E test app (Express server) |
| `apps/docs` | `apps/docs` | Storybook (deprecated) |

## Code Conventions

### Stencil Components

- Components use `@Component` decorator with `tag`, `styleUrl`, and `shadow: true/false`
- Props use `@Prop()`, events use `@Event()`, state uses `@State()`
- Components expose public methods via `@Method()` (e.g., `validate()`, `fillBillingForm()`)
- Custom events follow pattern: `submit-event`, `error-event`

### TypeScript

- Strict TypeScript throughout
- Use `as const` for immutable data objects
- Prefer type imports: `import type { X } from '...'`

### Testing

- Unit tests: Jest (via Stencil) — colocated with components as `*.spec.ts`
- E2E tests: Playwright — in `apps/component-examples/e2e/`

## Key Paths

| What | Path |
|---|---|
| Components source | `packages/webcomponents/src/components/` |
| Unit tests | `packages/webcomponents/src/components/**/*.spec.ts` |
| E2E tests | `apps/component-examples/e2e/` |
| E2E example pages | `apps/component-examples/examples/` |
| Playwright config | `apps/component-examples/playwright.config.ts` |
| Mock data | `mockData/` |
| Stencil config | `packages/webcomponents/stencil.config.ts` |

## Workflow Guidelines

### Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Principal developer standards.
- **Minimal Impact**: Changes should only touch what's necessary.

### Planning

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately

### Subagents

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One task per subagent for focused execution

### Verification

- Never mark a task complete without proving it works
- Run tests, check logs, demonstrate correctness

### Elegance

- For non-trivial changes: pause and ask "is there a more elegant way?"
- Skip this for simple, obvious fixes — don't over-engineer
