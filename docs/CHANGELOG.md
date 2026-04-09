# @justifi/webcomponents-docs

## 2.0.0

### Patch Changes

- 5a0455c: Display current web-components version on introduction and code examples.
- 7f49c06: Respect disabled ACH in checkout: bank account form, Plaid and saved payment methods, and payment method selection no longer treat bank/ACH as available when ACH is turned off.
- 25c67d4: Add googlePayStarted event to documentation
- 25c67d4: Removed dead API showSkeleton
- 6264741: Introduce `googlePayEnv` optional prop to allow test on Google Pay on Unified Fintech Checkout
- 6264741: Derive `justifi-google-pay` Google Pay environment from checkout API mode (test → TEST, live or unset → PRODUCTION); keep optional `environment` prop to override.
- Updated dependencies [1bc5900]
- Updated dependencies [7f49c06]
- Updated dependencies [25c67d4]
- Updated dependencies [6264741]
- Updated dependencies [6264741]
  - @justifi/webcomponents@6.13.0

## 1.1.6

### Patch Changes

- 15457d2: Fix props table to accept union types

## 1.1.5

### Patch Changes

- Rename Google Pay merchantName to merchantDisplayName prop and use PRODUCTION as default environment

## 1.1.4

### Patch Changes

- 4d25f63: Add CodeBlock component for syntax-highlighted code snippets; refactor all documentation pages to use CodeBlock instead of raw pre/code tags; add react-syntax-highlighter and prismjs dependencies
- Updated dependencies [b9b5e47]
  - @justifi/webcomponents@6.12.3

## 1.1.3

### Patch Changes

- 47a6204: Fix broken relative links in modular-checkout sub-components index page
- Updated dependencies [489a6dc]
  - @justifi/webcomponents@6.12.2

## 1.1.2

### Patch Changes

- d17d163: add modular checkout complete examples
- Updated dependencies [bd81b03]
  - @justifi/webcomponents@6.12.1

## 1.1.1

### Patch Changes

- 1ee8cef: Fix export and dist issues

## 2.0.0

### Patch Changes

- Updated dependencies [7a9db8b]
- Updated dependencies [fa5b6ec]
- Updated dependencies [f7db618]
  - @justifi/webcomponents@6.12.0

## 1.0.0

### Minor Changes

- a354d43: Create new @justifi/webcomponents-docs package for publishing documentation assets. This package exports MDX documentation files, component metadata (docs.json, component-tree.json), and helper utilities for consuming documentation in external projects.

### Patch Changes

- Updated dependencies [9829d87]
- Updated dependencies [e20f910]
- Updated dependencies [b2c1aa0]
  - @justifi/webcomponents@6.11.0

## 0.1.0

### Minor Changes

- 2322849: Create new @justifi/webcomponents-docs package for publishing documentation assets. This package exports MDX documentation files, component metadata (docs.json, component-tree.json), and helper utilities for consuming documentation in external projects.

### Patch Changes

- Updated dependencies [3406f47]
- Updated dependencies [b37b70b]
  - @justifi/webcomponents@6.10.1
