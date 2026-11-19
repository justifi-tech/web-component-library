---
"@justifi/webcomponents": minor
---

Replace internal component events with callback props.

The events components used to talk to their own parents were contained in the
previous change, but they were still DOM events: a name to keep unique, a
payload wrapped in `CustomEvent.detail`, and a listener on the other side. For
a child a parent renders itself, a plain callback prop says the same thing
with less machinery — and the repo already worked that way elsewhere
(`inputHandler`, `clickHandler`, `removeOwner`, `handleFormLoading`).

Converted, with the prop in brackets: `form-loading` (`loadingHandler`),
`form-completed` (`completeHandler`), `owner-submitted` (`submitHandler`),
`popper-show` / `popper-hide` (`showHandler` / `hideHandler`), `radio-click`
(`radioClickHandler`), `checkbox-changed` (`changeHandler`), `file-selected`
(`fileSelectHandler`), `selected-quantity-change` (`quantityChangeHandler`).

Deleted outright: `form-control-input` and `form-control-blur`. Every form
control already called its `inputHandler` prop with the same data on the same
line, and `form-control-blur` had no listener anywhere. The three places that
did use the input event were all on `<form-control-date>`, which gains a
`dateChangeHandler` prop for them.

`iframe-loaded` stays an event. Its consumers depend on `{ once: true }` and
an `AbortController` signal to dedupe a repeat-firing emit and cancel stale
watches, which is a rewrite of the hosted-field load path rather than a swap.

Two of these sat on `justifi-` prefixed shadow components —
`justifi-radio-list-item` and `justifi-save-new-payment-method` — so their
events were technically reachable from a merchant's page even though neither
is documented and `checkbox-changed` had no listener at all. They are internal
primitives and are now props like the rest.
