---
"@justifi/webcomponents": patch
---

- Fixes issue in `justifi-checkouts-list-filters` where the Payment Mode filter sends incorrect value and returns an API error. Payment Mode filter now correctly sends `ecom` or `bnpl` when input selection is made.
