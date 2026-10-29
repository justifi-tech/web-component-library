---
"@justifi/webcomponents": minor
---

The hosted-field iframes of `card-form` and `bank-account-form` are now light-DOM children of their shadow host, projected into the same `::part`-themed wrapper through a named `<slot>`. Nothing changes visually and the theming API is untouched, but the iframes are now document-tree frames, so the fields reach each other directly through `window.parent.frames` instead of `BroadcastChannel`. That makes tokenization work on Safari and iOS below 15.4, and card data never transits the merchant page: the `BroadcastHostService` relay and `iframe-input.deliverBroadcast()` are removed. Also fixes the iframe URL, which joined the style parameters with a second `?` so `fontFamily` never reached the fields. Deploy the matching iframe release first: with the current iframe bundle, this SDK keeps working on every browser that has `BroadcastChannel` (the fields fall back to it) and Safari < 15.4 stays as broken as it is today, never worse.
