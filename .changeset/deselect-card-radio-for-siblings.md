---
'@justifi/webcomponents': patch
---

Uncheck the card/bank radio in `justifi-tokenize-payment-method` when a sibling payment method (Plaid, Sezzle, a wallet or a saved method) is selected. Those siblings select themselves by writing the checkout store rather than emitting `radio-click`, so two options looked selected at once.
