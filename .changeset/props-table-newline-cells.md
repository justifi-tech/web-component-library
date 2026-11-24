---
"@justifi/webcomponents-docs": patch
"@justifi/webcomponents": patch
---

Fix the props table breaking apart partway down the page.

A multi-line JSDoc comment on a `@Prop()` reaches the docs helpers verbatim
through `docs.json`, newlines and all. A newline ends a GFM table row, so the
table stopped at the first prop with a multi-line description and every prop
below it spilled onto the page as raw pipe-delimited text. On Tokenize Payment
Method and Unified Fintech Checkout™ that prop is `mask-card-number`, which put
`show-account-number-confirmation` and the props after it outside the table.

`escapeGfmTableCell` now collapses newlines to a single space, so both the props
and the parts tables survive any comment shape.

Also adds the missing description for `show-account-number-confirmation` on
`justifi-bank-account-form`, which rendered with an empty Description cell.
