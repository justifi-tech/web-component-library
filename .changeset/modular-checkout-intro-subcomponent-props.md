---
"@justifi/webcomponents-docs": patch
---

Say on the Modular Checkout introduction that `show-account-number-confirmation` is set on `<justifi-bank-account-form>`, not on the wrapper. The page's props table is generated from the wrapper's own props, so the prop was absent with no explanation and `mask-card-number` was the only field-level option in sight.
