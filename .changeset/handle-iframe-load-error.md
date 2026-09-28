---
"@justifi/webcomponents": patch
---

`card-form` and `bank-account-form` now handle iframe load failures instead of hanging on the skeleton forever. If the payment inputs don't load within 10 seconds, the component emits an `error-event` with the new `iframe-load-error` code and renders an alert with a "Try again" button that reloads the iframes. `iframe-input` gains a `reload()` method to support the retry.
