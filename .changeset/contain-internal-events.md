---
"@justifi/webcomponents": minor
---

Stop internal component events from reaching the merchant's page.

Components use custom events to talk to each other — form controls reporting
input, form steps reporting loading, a popper telling its tooltip to open. Every
one of those was declared with Stencil's defaults (`bubbles: true, composed:
true`), so it escaped the shadow root and landed on the host page as de-facto
API nobody documented or intended.

Those events are now declared `bubbles: false, composed: false` and renamed to
kebab-case: `formControlInput` → `form-control-input`, `formLoading` →
`form-loading`, `showEvent`/`hideEvent` → `popper-show`/`popper-hide`, and so on.
Each one is delivered straight to the element that needs it instead of bubbling.
A new `api/event-names.ts` is the single list of every event name the library
emits, and `Analytics` reads from it rather than its own hardcoded copy.

**No documented event changed.** `error-event`, `click-event`, `submit-event`,
`complete-form-step-event`, `record-click-event`, `checkout-changed`, the Plaid
and wallet events and the rest of the public surface keep their names and keep
bubbling, including through `<justifi-modular-checkout>` exactly as documented.
Nothing was removed.

This is `minor` rather than `patch` because an integration listening for one of
the internal events — none of which were ever documented — will stop receiving
it.

Also fixes a real bug along the way: `form-control-tooltip` and
`table-filters-menu` both listened for a bare `showEvent` on their host, so any
popper anywhere beneath them could open an unrelated tooltip.
