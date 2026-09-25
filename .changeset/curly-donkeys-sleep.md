---
'@justifi/webcomponents': minor
---

fix(modular-checkout): coalesce `checkout-changed` emissions and fix store subscription leak

Adds `checkoutLoaded` to `CheckoutChangedEventDetail`. The component emits
`checkout-changed` once before the checkout is fetched, with an empty
`savedPaymentMethods` and a guessed `availablePaymentMethodTypes`; consumers picking a
default payment method from the payload should ignore snapshots where `checkoutLoaded`
is `false`.
