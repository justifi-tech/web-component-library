---
"@justifi/webcomponents": patch
---

Fixed `justifi-modular-checkout` emitting `error-event` with an undefined `message`. The checkout actions call `onError({ error, code, severity })`, but the component read `error.message` — so a failed complete (e.g. insufficient funds) or failed checkout load reached integrators with no message, and the load path also dropped `errorCode` and `severity`.
