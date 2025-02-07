---
"@justifi/webcomponents": patch
---

- Added new optional props to `justifi-checkouts-list-filters` allowing prescribed filter selections. The following props are now available: `checkout-status` and `payment-mode`.
  - Values passed via these props will be automatically applied to the `justifi-checkouts-list`'s API requests as query params.
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-checkouts-list-filters` to allow for more customization. The following parts have been added: `checkouts-list-filter-menu`, `checkout-status-checkouts-list-filter-param`, and `payment-mode-checkouts-list-filter-param`.