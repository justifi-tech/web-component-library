---
"@justifi/webcomponents-docs": patch
---

Point the Modular Checkout docs at the sub-component for field-level props. `mask-card-number` belongs on `<justifi-card-form>` and `show-account-number-confirmation` on `<justifi-bank-account-form>` — the wrapper is for checkout-level configuration. The introduction page now says so and no longer lists `mask-card-number` in its props table, and the Card Form page's example sets the attribute on the card form instead of the wrapper. Docs only; the wrapper prop still exists and still works.
