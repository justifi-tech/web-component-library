# web-component-library Agent Guidelines

## Spec Authority

**Specs are prescriptive, not descriptive.** The spec defines what code MUST do.

- **Spec is source of truth.** If code contradicts the spec, the code is wrong — refactor it.
- **Read the full spec on version changes.** When the spec version is newer than specd_history.md, re-read the entire spec — not just the changelog. The changelog summarizes what changed, but context lives in the full spec.
- **Don't build on broken foundations.** If existing code uses the wrong model (e.g., wrong ID scheme, wrong data flow), fix it first. Don't add new features on top of incorrect code.
- **Spec index:** `specs/README.md` lists all specifications organized by phase. Only specs with status "Ready" should be implemented.
- **Changelogs are immutable.** When creating new changelog entries, old entries never change.

## Loop System

The autonomous loop is defined in `loop.sh`. Commands live in `.claude/commands/`:

| Command          | Purpose                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| `/specd:implement`     | Pick one unblocked work item, implement it, validate, record completion        |
| `/specd:audit`         | 3-phase spec-vs-code audit. Writes findings to specd_work_list.md and specd_review.md |
| `/specd:review-intake` | Process specd_review.md items into specd_work_list.md                                 |

## specd_work_list.md (Remaining Work)

The single execution queue for all work — spec implementations, audit findings, and promoted review items. **Read it in full** at the start of each iteration — it is kept small. Pick an unblocked item, implement it, then move it to specd_history.md.

## specd_history.md (Done Log)

specd_history.md is the archive of completed work in reverse chronological order (newest first). It does NOT contain remaining items — those live in specd_work_list.md.

Each entry is a single line: `- **spec-name v0.1 (YYYY-MM-DD):** description`. New entries go at the top of the file, below the header comment.

**Never read specd_history.md in full — it can get large.** Use `Grep` to search for specific specs or dates when checking for duplicates.

## specd_review.md (Human Decisions)

Ambiguous findings from audits that need human judgment. Items sit here until the human reviews them. On next loop start, `/specd:review-intake` promotes remaining items to specd_work_list.md (human deletes items they disagree with before restarting).

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
