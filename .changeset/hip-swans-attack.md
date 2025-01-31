---
"@justifi/webcomponents": minor
---

- Added new props to `justifi-payments-list-filters` allowing prescribed filter selections. The following props are now available: `payment-id`, `terminal-id`, `payment-status`, `created-after`, and `created-before`. 
  - Values passed via these props will be automatically applied to the `justifi-payments-list`'s API requests as query params. 
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-payments-list-filters` to allow for more customization. The following parts have been added: `filter-menu`, `payment-id-payments-list-filter-param`, `terminal-id-payments-list-filter-param`, `payment-status-payments-list-filter-param`, `created-after-payments-list-filter-param`, `created-before-payments-list-filter-param`
