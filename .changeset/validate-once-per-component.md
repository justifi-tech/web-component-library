---
"@justifi/webcomponents": patch
---

`validate()` on a modular checkout no longer validates the same component twice.

`queryFormRefs` matches `justifi-tokenize-payment-method` with both the billing selector and the payment-method selector, so a checkout that slots only that component ends up with the same element in both refs. `validate()` then called it once as the payment method and once as the billing form, putting two full passes over the same four hosted-field iframes in flight and running the billing form twice.

`validate()` now skips the billing ref when it is the same element as the payment-method ref. Checkouts that slot a separate billing component are unaffected, and `getValues`/`tokenize` on the shared element are untouched.

This duplicate pass was also what let hosted-field error messages render under the wrong field before replies were matched to their own iframe.
