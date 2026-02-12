# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JustiFi Web Component Library - A Stencil-based web components library for fintech UI elements (payment forms, business onboarding, transaction lists, etc.). Published as `@justifi/webcomponents` on npm.

## General Guidelines

- In all interactions and commit messages, be extremely concise and to the point and sacrifice grammar for the sake of concision.
- Do not run build, dev, start, lint, format, clean, or any other commands. Just answer the question or task.
- You're allowed to run test related commands only locally. The allowed commands are only `test` and `test:e2e`

## Plans

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.

## Architecture

### Monorepo Structure (Turborepo + pnpm workspaces)

- `packages/webcomponents/` - Main Stencil component library
- `docs/` - Documentation site (MDX-based)
- `apps/component-examples/` - Express server for testing components
- `apps/docs/` - Deprecated Storybook (do not modify)

### Webcomponents Package Structure

```
packages/webcomponents/src/
├── components/       # Main components (checkout, payments-list, business-forms, etc.)
├── ui-components/    # Reusable form controls, tables, pagination, buttons
├── api/              # API integration layer
├── utils/            # Helper functions
├── store/            # State management (@stencil/store)
├── actions/          # Business logic actions
└── styles/           # Global SCSS styles
```

### Component Patterns

- Components use Stencil with React-style JSX syntax
- Tests use `newSpecPage` from `@stencil/core/testing` with Jest
- Test files located at `src/components/{component}/test/*.spec.tsx`
- Form controls in `src/ui-components/form/` are reusable across components

### Key Technologies

- **Stencil 4.x** - Web component compiler
- **Bootstrap 5** - CSS framework
- **Yup** - Schema validation
- **RxJS** - Reactive programming
- **Chart.js** - Data visualization
- **dinero.js** - Currency handling

## Testing Patterns

```tsx
import { h } from "@stencil/core";
import { newSpecPage } from "@stencil/core/testing";

describe("component-name", () => {
  it("renders correctly", async () => {
    const page = await newSpecPage({
      components: [MyComponent],
      template: () => <my-component prop="value" />,
    });
    expect(page.root).toMatchSnapshot();
  });
});
```

Tests run with `TZ=utc` for consistent date handling.

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `IFRAME_ORIGIN` - Origin for iframe components
- `PROXY_API_ORIGIN` - Proxy API endpoint
- `API_ORIGIN` - Direct API endpoint

## Documentation

- [JustiFi API Documentation](https://developer.justifi.ai/)

## Auto-Generated Files

The following patterns identify auto-generated files that should be excluded from PR line counting:

### Build Output

- `dist/**/*` - All Stencil build output
- `coverage/**/*` - Test coverage reports
- `.turbo/**/*` - Turborepo cache

### Generated Type Definitions

- `src/components.d.ts` - Stencil auto-generated component types
- `src/global.d.ts` - Global type declarations
- `dist/docs.d.ts` - Documentation types
- `**/*.d.ts` files in `dist/` directories

### Test Snapshots

- `**/__snapshots__/**/*.snap` - Jest snapshot files
- All `.snap` files

### Package Lock Files

- `pnpm-lock.yaml`
- `package-lock.json`
- `yarn.lock`
- `**/node_modules/**`

### Build Artifacts

- `**/*.entry.js` - Stencil entry point chunks
- `dist/docs.json` - Component metadata
- `dist/collection/collection-manifest.json`
- Build logs in `.turbo/` directories

## Pull Request Guidelines

### PR Size Limits

Keep PRs focused and reviewable:

- **Maximum 250 lines** of source code changes
- Test code has no limit (comprehensive test coverage is encouraged)
- Auto-generated files are excluded (lock files, dist/, coverage/, .turbo/, **snapshots**, \*.d.ts in dist/)
- Automated review will flag oversized PRs with split suggestions and show line count breakdown

**Why this matters:**

- Large PRs get superficial reviews
- Bugs hide in volume
- Slower review cycles
- More merge conflicts

**When implementing features:**

- Break work into logical, independent chunks
- Consider splitting:
  1. Infrastructure/refactoring changes first
  2. New functionality in focused PRs
  3. Tests and docs separately if needed
- Each PR should have single, clear purpose

**If your PR is flagged as too large:**

- Review the suggested split strategy from the automated review
- Create multiple PRs with clear dependencies
- Link related PRs in descriptions

### PR Content Standards

- **Single concern**: One feature/bug/refactoring per PR
- **Include tests**: All new functionality needs tests
- **Error handling**: Handle error cases appropriately
- **Follow patterns**: Match existing code style and architecture
- **Changeset**: Run `pnpm changeset` before creating PR
- **Avoid over-engineering**: Keep solutions simple and direct. Don't add unnecessary abstractions.

### AI-Generated Code Review

If using AI to generate code, review carefully for:

- Over-engineering (unnecessary abstractions)
- Inconsistent patterns (doesn't match codebase)
- Missing error handling
- Missing or inadequate tests
- Generic/template comments
