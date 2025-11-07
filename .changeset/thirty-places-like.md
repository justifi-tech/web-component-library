---
'@justifi/webcomponents': minor
---

Add `paymentToken` to `CheckoutState` returned by `getCheckoutState()` and supplied to `preCompleteHook`.

- For saved methods, `paymentToken` is the saved method `id`.
- For new methods, it’s set after successful tokenization (including Plaid exchange).
- Optional field; no breaking changes for existing consumers.
