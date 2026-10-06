# Core Component Merge

| | |
|--------|----------------------------------------------|
| Version | 0.1 |
| Status | Ready |
| Last Updated | 2026-03-11 |

## Changelog

### v0.1 (2026-03-11)
- Initial spec (draft)

## Overview

Eliminate the wrapper/core component split pattern. Components currently have a `justifi-*` wrapper that bootstraps auth/services/analytics and a `*-core` component that fetches data and renders UI. This refactor merges both into a single `justifi-*` component, like `justifi-order-terminals` already does.

**Scope:**
- Merge all 12 wrapper/core pairs into single components
- Delete `-core` files and their dedicated test files after merging
- Update snapshots

**Out of scope:**
- Normalizing other inconsistencies across components (error handling patterns, render state enums)
- Changing public API (props, events, tag names)
- Modifying components that already don't use the pattern (`justifi-checkout`, `justifi-order-terminals`)

**Design principles:**
- No behavioral changes — the merged component must behave identically to the wrapper+core pair
- No public API changes — same props, same events, same tag names
- Each component merge is independently shippable

## Specification

### Merge Strategy

For each wrapper/core pair:

1. Move the core's rendering logic, `fetchData()`, loading/error state, and event emissions into the `justifi-*` component
2. The `justifi-*` component keeps its existing auth, prop validation, service instantiation, action factory setup, and analytics init
3. The `justifi-*` component gains the core's `@State` properties, `componentWillLoad`/`componentDidLoad` fetch call, `@Watch` on the fetch function, and `render()` output
4. The merged component must use `StyledHost` as its outermost render wrapper
5. Delete the `-core.tsx` file
6. Delete the `-core.spec.tsx` test file and its snapshots
7. Update or rewrite the `justifi-*.spec.tsx` tests to cover the merged behavior (both the bootstrap logic and the rendering)
8. Update any imports referencing the deleted core component

### Phased Rollout

**Phase 1 — Simple detail components** (single data fetch, straightforward render):
- `payout-details` (wrapper + core)
- `payment-details` (wrapper + core)
- `business-details` (wrapper + core)

**Phase 2 — List components with filters** (pagination, table rendering, filter params):
- `payments-list` (wrapper + core)
- `payouts-list` (wrapper + core)
- `terminals-list` (wrapper + core)
- `terminal-orders-list` (wrapper + core)

**Phase 3 — List with extra complexity** (multiple service calls):
- `checkouts-list` (wrapper + core — has two action functions)

**Phase 4 — Non-list components with unique patterns:**
- `gross-payment-chart` (uses `componentDidLoad` for canvas ref)
- `dispute-management` (core already receives auth props)
- `dispute-response` (nested under dispute-management)
- `owner-form` (form component, different from list/detail pattern)

### What NOT to Change

- Component tag names stay the same
- All `@Prop()` declarations on the `justifi-*` component stay the same
- All `@Event()` emissions stay the same
- All `@Method()` declarations stay the same
- E2E tests should not need changes (they test the public API)

## Notes

- `justifi-order-terminals` is the reference for what the final merged component looks like — it already does auth + fetch + render in one component
- `dispute-management` is a special case where the core already receives `authToken` and `disputeId` directly — the merge simplifies this since there's no longer a boundary to cross
- `checkouts-list` initializes two action functions — both move into the single component
