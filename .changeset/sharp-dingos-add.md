---
"@justifi/webcomponents": patch
---

- Added new optional props to `justifi-payouts-list-filters` allowing prescribed filter selections. The following props are now available: `created-before` and `created-after`.
  - Values passed via these props will be automatically applied to the `justifi-payouts-list`'s API requests as query params.
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-payouts-list-filters` to allow for more customization. The following parts have been added: `payouts-list-filter-menu`, `created-after-payouts-list-filter-param`, and `created-before-payouts-list-filter-param`.
- Resolved bug in `justifi-payments-list-filters` where values passed as `created-before` prop were not correctly applied to component API requests.