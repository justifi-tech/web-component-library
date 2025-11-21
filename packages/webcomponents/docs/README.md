# Web Components Docs Bundle

This directory packages Docusaurus-compatible MDX content that ships with `@justifi/webcomponents`. External consumer apps can import these files directly to mirror JustiFi's component docs coverage without embedding any JustiFi-hosted runtime.

## Directory layout

```
packages/webcomponents/docs/
├── overview/        # Product-level framing and release notes
├── guides/          # How-to walkthroughs (installation, tokens, theming, QA)
├── components/      # Per-component MDX plus helper React components
│   ├── helpers/     # `<PropsTable />`, `<UsageSnippet />`, `<PartsTable />`
├── reference/       # Sidebar manifest + supporting assets
├── templates/       # Authoring blueprints + fixtures for linting
├── scripts/         # Lightweight authoring checks (structure + lint helpers)
└── README.md        # This file
```

## Authoring workflow

1. Duplicate the appropriate template from `templates/` and move it into the correct folder.
2. Update frontmatter (`id`, `title`, `description`, `sidebar_position`). IDs must stay unique across the docs bundle. Cross-check the `agent-os/specs/2025-11-18-web-components-docs-structure/artifacts/storybook-parity-matrix.md` file to confirm the new doc satisfies parity requirements.
3. Use helper components from `components/helpers` for structured content:
   - `PropsTable` for props/events/methods
   - `UsageSnippet` for static code blocks with captions
   - `PartsTable` for enumerating `::part` selectors and styling hooks
4. Keep sections in this order: **Overview → Usage → Props → Theming/Parts → Accessibility → Static examples.**
5. Call out accessibility reminders (focus states, aria contracts, localization) and the available `::part` selectors in every component doc.
6. Save files with `.mdx` extension only. Avoid importing external utilities—MDX files must render standalone.

## Consumer integration (Docusaurus)

```ts
// sidebars.ts
import { docsSidebar } from '@justifi/webcomponents/docs/sidebar';
export default docsSidebar;
```

```ts
// mdx-components.tsx
import React from 'react';
import { PropsTable, UsageSnippet, PartsTable } from '@justifi/webcomponents/docs/components/helpers';

export default {
  PropsTable,
  UsageSnippet,
  PartsTable,
};
```

```tsx
// Example MDX page import
import TokenizePaymentMethod from '@justifi/webcomponents/docs/components/tokenize-payment-method.mdx';
```

## Linting & verification

Run both lint suites before publishing:

1. `pnpm --filter @justifi/webcomponents docs:lint` – ESLint + `eslint-plugin-mdx` across every doc.
2. `pnpm docs:lint -- --files "packages/webcomponents/docs/components/tokenize-payment-method.mdx"` – Structural check for required frontmatter + section headers (pass `--files` with a comma-separated list as needed).
3. `pnpm docs:verify` – Node-based verification that the package exports (`@justifi/webcomponents/docs/sidebar` and representative MDX files) resolve correctly.

## Static examples

- Examples stay **static** (code fences only). Interactive sandboxes increase bundle size and duplicate functionality available elsewhere.

## Conventions

- Use American English spelling to match the rest of the docs site.
- Keep headings sentence case except brand names.
- Link to canonical API docs on https://docs.justifi.tech for backend references.
- Reference responsive breakpoints (>=320px mobile baseline) and `::part` targets within each doc so consumers understand styling contracts.

For questions, reach out in `#web-components` or file an issue in this repo.
