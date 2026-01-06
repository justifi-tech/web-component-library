# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JustiFi Web Component Library - A Stencil-based web components library for fintech UI elements (payment forms, business onboarding, transaction lists, etc.). Published as `@justifi/webcomponents` on npm.

## Common Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm build            # Build all packages (uses Turborepo)
pnpm dev              # Run webcomponents in watch mode + docs dev server
pnpm dev:checkout     # Run specific component example (checkout, dispute, business-form, etc.)

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:file -- packages/webcomponents/src/path/to/test.spec.tsx  # Run specific test

# Code Quality
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier

# Versioning
pnpm changeset        # Generate changeset before PR
```

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
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('component-name', () => {
  it('renders correctly', async () => {
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
