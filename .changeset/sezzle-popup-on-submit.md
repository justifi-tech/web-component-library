---
"@justifi/webcomponents": patch
---

Fix Sezzle popup not opening when submitting checkout with Sezzle selected. `submitCheckout` now opens the Sezzle checkout and completes with `payment_mode: bnpl` on approval, emitting `error-event` on cancel/failure. Retrying after a cancel re-opens the popup.
