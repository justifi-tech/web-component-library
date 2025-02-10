---
"@justifi/webcomponents": patch
---

- Added new optional props to `justifi-terminals-list-filters` allowing prescribed filter selections. The following props are now available: `terminal-status` and `terminal-id`.
  - Values passed via these props will be automatically applied to the `justifi-terminals-list`'s API requests as query params.
  - If a value is passed to these props, the corresponding input in the filter menu UI will be disabled.
  - Add new CSS parts to `justifi-terminals-list-filters` to allow for more customization. The following parts have been added: `terminals-list-filter-menu`, `terminals-status-terminals-list-filter-param`, and `terminal-id-terminals-list-filter-param`.