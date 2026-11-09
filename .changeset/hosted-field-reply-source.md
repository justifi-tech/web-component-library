---
"@justifi/webcomponents": patch
---

Fixed hosted field validation errors showing under the wrong field. Every hosted field iframe replies to the same window, and a field accepted the first `validate` (or `tokenize`) reply from any iframe. When two validations overlapped — a double-clicked Submit, or two `validate()` calls at once — a field could take a sibling's reply: with `show-account-number-confirmation` on, the "does not match the account number" error appeared under Routing Number while Confirm Account Number showed nothing. Each field now only accepts replies from its own iframe.
