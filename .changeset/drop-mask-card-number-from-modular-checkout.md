---
"@justifi/webcomponents": minor
---

Removed `mask-card-number` from `justifi-modular-checkout`. Set it on `<justifi-card-form>` instead, which is where the field lives and which you already write yourself inside the wrapper — the wrapper never rendered a card form, it only looked for yours, so the attribute was a second way to say the same thing. `checkoutStore.maskCardNumber` goes with it.

Unchanged: `mask-card-number` on `justifi-card-form`, `justifi-tokenize-payment-method` and `justifi-checkout`, which render the card form internally and so still need it.
