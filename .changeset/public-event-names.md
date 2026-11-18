---
"@justifi/webcomponents": minor
"@justifi/webcomponents-docs": minor
---

Give every merchant-facing event a `justifi-` prefixed name, and emit both.

Public event names were unprefixed and inconsistent — `error-event`,
`checkout-changed`, `loaded`, `applePayStarted`. A bare name like `loaded` on
the host page is easy to collide with, and nothing marked these as ours.

Each one now has a second name: `justifi-` prefix, kebab-case, no `-event`
suffix. `error-event` becomes `justifi-error`, `complete-form-step-event`
becomes `justifi-form-step-complete`, `applePayStarted` becomes
`justifi-apple-pay-started`, and so on.

**Nothing breaks.** Every event fires under both names, from the same code path
with the same payload, so an existing integration keeps working untouched. The
old names are deprecated and will be removed in the next major — listen for the
`justifi-` ones in new code. Docs now lead with the new names and carry a note
on each page.

`justifi-checkout` also emits `justifi-checkout-loaded` (and `loaded`) for the
first time. The event has been declared and documented since before this
change, but nothing ever emitted it, so the documented behaviour is now real:
it fires once the checkout has loaded, carrying `{ checkout_status }`.
