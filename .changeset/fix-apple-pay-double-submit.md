---
"@justifi/webcomponents": patch
---

fix: prevent double submission in checkout via checkoutStore

- Centralize submission state in checkoutStore for JustifiCheckout and JustifiModularCheckout
- Reset submission state correctly on submit/error events
- Block multiple submissions and ensure proper state resets on validation failures
