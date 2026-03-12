# Work List

<!--
Single execution queue for all work — spec implementations, audit findings, and promoted review items.

HOW IT WORKS:

1. Pick an unblocked item (no `(blocked: ...)` annotation)
2. Implement it
3. Validate cross-file dependencies
4. Move the completed item from this file to specd_history.md
5. Check this file for items whose `(blocked: ...)` annotation references the
   work you just completed — remove the annotation to unblock them
6. Delete the spec header in this file if no more items are under it
7. LOOP_COMPLETE when this file has no unblocked items remaining

POPULATED BY: /specd:audit command, /specd:review-intake command, and humans during spec phase.
-->

---

## core-component-merge v0.1

### Phase 2 — List components
- Merge `payments-list`: combine `justifi-payments-list` and `payments-list-core` into single component with `StyledHost`, delete core files, update tests
- Merge `terminals-list`: combine `justifi-terminals-list` and `terminals-list-core` into single component with `StyledHost`, delete core files, update tests
- Merge `terminal-orders-list`: combine `justifi-terminal-orders-list` and `terminal-orders-list-core` into single component with `StyledHost`, delete core files, update tests

### Phase 3 — Checkouts list
- Merge `checkouts-list`: combine `justifi-checkouts-list` and `checkouts-list-core` into single component with `StyledHost`, handle dual action functions, delete core files, update tests (blocked: Merge `payments-list`)

### Phase 4 — Non-list components
- Merge `gross-payment-chart`: combine `justifi-gross-payment-chart` and `gross-payment-chart-core` into single component with `StyledHost`, preserve `componentDidLoad` for canvas ref, delete core files, update tests (blocked: Merge `checkouts-list`)
- Merge `dispute-management`: combine `justifi-dispute-management` and `dispute-management-core` into single component with `StyledHost`, delete core files, update tests (blocked: Merge `checkouts-list`)
- Merge `dispute-response`: combine `justifi-dispute-response` and `dispute-response-core` into single component with `StyledHost`, delete core files, update tests (blocked: Merge `dispute-management`)
- Merge `owner-form`: combine `owner-form` wrapper and `owner-form-core` into single component with `StyledHost`, delete core files, update tests (blocked: Merge `checkouts-list`)
