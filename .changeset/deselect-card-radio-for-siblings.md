---
'@justifi/webcomponents': patch
---

Uncheck the card/bank radio in `justifi-tokenize-payment-method` when a sibling payment method (Plaid, Sezzle, a wallet or a saved method) is selected. Those siblings select themselves by writing the checkout store rather than emitting `radio-click`, so two options looked selected at once.

The component also re-claims the store when it finds its own option selected locally against an empty store — a cancelled Apple Pay, Google Pay or PayPal sheet clears `selectedPaymentMethod`, and without this the card radio stayed checked while submit reported "No payment method selected."
