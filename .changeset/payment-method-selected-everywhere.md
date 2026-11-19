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

All eight options now emit it when clicked, with one payload shape everywhere:
`{ type, id? }`, matching `checkoutStore.selectedPaymentMethod`. `type` is the
`PAYMENT_METHODS` value; `id` carries the token when a saved method was picked.

Nothing changes for anyone listening on the deprecated
`paymentMethodOptionSelected`. The two components that fired it still fire it,
with the payload they always had — Sezzle's bare `'sezzle'` string, and
`justifi-saved-payment-method`'s whole option object. The six that never fired
it don't start: for those, `justifi-payment-method-selected` is the only name,
with no deprecated twin to retire later. `justifi-plaid-payment-method` had
declared the deprecated emitter without ever firing it; that declaration is
gone.

For the wallets the event fires when the shopper starts the payment (the sheet
opening or the button click), not when it completes, so it reports the choice
rather than the outcome. PayPal reports `paypal` or `venmo` from the funding
source.
