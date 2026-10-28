---
"@justifi/webcomponents": patch
---

`card-form` and `bank-account-form` now work on Safari and iOS below 15.4, which have no `BroadcastChannel`. There the hosted field iframes could not exchange values with each other, so tokenization hung with no error event. Both forms now broker broadcasts between their own iframes, and `iframe-input` gains a `deliverBroadcast()` method to receive them. Browsers with native `BroadcastChannel` are unaffected — they never take this path. Requires the matching iframe release.
