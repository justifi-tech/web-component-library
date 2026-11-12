---
"@justifi/webcomponents": minor
---

`justifi-plaid-payment-method` is now themeable like every other payment option.

The Plaid option passes a whole component as its radio label, and that component wraps its content in `StyledHost` — so Bootstrap's `:host > *` rule pinned `color: var(--bs-body-color)` on it, overriding the color the host page sets through `::part(label)`. Every other option's label is plain text that inherits normally, so on a dark theme the Plaid row rendered near-black on a dark background while the rest were legible. The component exposed no `part` attributes at all, so there was no hook to correct it.

It now exposes `label` on the clickable row, `text` on the status and retry messages, `text-danger` on error messages, and `image` on the logo. Two details were needed to make those parts actually reachable:

- The component sits behind a second shadow boundary, inside `justifi-radio-list-item`'s shadow root, and `::part()` only pierces one. The host carries `exportparts`, so the same `::part(label)` rule that already themes the other options reaches this one.
- Bootstrap's `.text-muted` / `.text-danger` / `.text-info` / `.text-success` utilities declare `color` as `!important`, and an `!important` declaration in the inner tree beats a page rule applied through `::part()` — including a page rule that is itself `!important`. Each part therefore sits on a child element, with the color utility left on its parent, so the page's declaration lands on an element that has no competing rule.

The Plaid mark is inlined as an SVG with `fill="currentColor"` instead of an `<img>` pointing at an asset whose fill was hardcoded to `#111`. An `<img>` cannot inherit text color; the logo now follows whatever color the label resolves to.

Verified in Chrome against the real two-level shadow topology: label, status message, error message, retry hint and logo all take their color from the page's `::part()` rules. With the parts on the utility-class elements instead, they computed to Bootstrap's own color no matter what the page declared.
