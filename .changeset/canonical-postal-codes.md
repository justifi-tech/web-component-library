---
"@justifi/webcomponents": patch
---

Fixed postal code validation rejecting valid Canadian codes. Checkout required an uppercase code with a literal space, so `m5v 2t6` and `M5V2T6` both failed — a shopper typing their own postal code the way they normally write it could not complete checkout. The business forms used a different regex that disagreed with checkout: it allowed lowercase and an optional separator, but also accepted FSA letters Canada Post never issues (D, F, I, O, Q, U, W, Z).

Both now share one definition in `utils/postal-code.ts` — a US ZIP regex and a case-insensitive CA/US regex limited to the 18 valid FSA letters. Postal inputs normalize to `ANA NAN` as you type (uppercase, single space) without moving the caret mid-string, and schemas normalize before matching, so values already stored in the old shapes still validate.

Also fixes ZIP+4 being unenterable: the field truncated at 5 characters and the key handler blocked the hyphen. `maxLength` is now 10 and the postal field uses a handler that accepts digits plus a single hyphen.
