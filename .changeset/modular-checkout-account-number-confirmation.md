---
"@justifi/webcomponents": minor
---

`show-account-number-confirmation` now works on `justifi-modular-checkout`, not
just on the slotted `justifi-bank-account-form`.

The prop existed on `justifi-checkout` and `justifi-tokenize-payment-method`,
but modular checkout had no equivalent — it was the one layout where you had to
reach past the wrapper and set the prop on the sub-component. It now takes the
same route `mask-card-number` already takes: the wrapper writes it to the shared
checkout store, and `justifi-bank-account-form` reads the store when no explicit
prop is set. Setting it on the sub-component still works and still wins.

Defaults to `false`, so existing integrations are unchanged.
