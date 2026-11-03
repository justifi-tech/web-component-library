---
"@justifi/webcomponents": minor
---

New `show-account-number-confirmation` prop on `justifi-checkout`, `justifi-tokenize-payment-method` and `justifi-bank-account-form`. Off by default. When on, the bank account form renders a required "Confirm Account Number" hosted field below the account number and fails validation with `The entered value does not match the account number` when the two differ — aimed at ACH returns caused by mistyped account numbers. The comparison happens inside the hosted field iframes, so the account number never reaches the parent page. Requires the matching iframe release.

Also fixes `bank-account-form.validate()`, which compared the two iframes' response objects instead of their `isValid` flags and so returned the routing number's result regardless of the account number — an invalid account number did not fail validation. It now returns `{ isValid }` aggregated across every rendered field.

Also fixes the same bug in `card-form.validate()`, which ANDed the four hosted fields' response objects — all truthy — and so returned the CVV's result regardless of the card number, expiration month or year. An invalid card number with a valid CVV passed validation and went on to tokenize. Both forms now resolve `{ isValid }` aggregated across every rendered field.

`bank-account-form.tokenize()` now runs the confirmation check itself, so an integrator calling the public `tokenize()` method with their own submit button gets the same protection as the built-in submit path, and `justifi-modular-checkout.submitCheckout()` stops before tokenizing when validation fails instead of creating a payment method for a mistyped account number first.
