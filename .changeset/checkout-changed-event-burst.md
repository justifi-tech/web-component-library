---
"@justifi/webcomponents": patch
---

`justifi-modular-checkout` no longer emits a burst of `checkout-changed` events. A single batch of store writes previously fired one event per changed key; `onAnyChange` now coalesces synchronous writes into one notification on the next microtask, carrying the final state. The subscription is also unsubscribed in `disconnectedCallback` (and before re-subscribing), so a remounted checkout no longer stacks duplicate emitters.
