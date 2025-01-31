---
"@justifi/webcomponents": minor
---

- Added new props to `justifi-payments-list-filters` allowing prescribed filter selections. The following props are now available: `payment-id`, `terminal-id`, `payment-status`, `created-after`, and `created-before`. 
  - Values passed via these props will be automatically applied to the `justifi-payments-list`'s API requests as query params. 
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
