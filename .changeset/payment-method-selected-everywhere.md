---
"@justifi/webcomponents": minor
"@justifi/webcomponents-docs": minor
---

Emit `justifi-payment-method-selected` from every payment method option.

Only two components reported a selection: `justifi-sezzle-payment-method` and
the (unrendered) `justifi-saved-payment-method`. Picking a new card, a new bank
account, a saved method inside modular checkout, Apple Pay, Google Pay, PayPal
or Venmo reported nothing, and `justifi-plaid-payment-method` declared the
event but never emitted it — so a merchant tracking which method a shopper
chose simply went quiet for most of the checkout.

All eight options now emit it when clicked, under both the current and the
deprecated name like every other public event.

The payload is now the same everywhere: `{ type, id? }`, matching
`checkoutStore.selectedPaymentMethod`. `type` is the `PAYMENT_METHODS` value;
`id` carries the token when a saved method was picked. **This changes two
existing payloads** — Sezzle emitted the bare string `'sezzle'`, and
`justifi-saved-payment-method` emitted its whole option object.

For the wallets the event fires when the shopper starts the payment (the sheet
opening or the button click), not when it completes, so it reports the choice
rather than the outcome. PayPal reports `paypal` or `venmo` from the funding
source.
