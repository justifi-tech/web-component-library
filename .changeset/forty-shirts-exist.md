---
"@justifi/webcomponents": patch
---

- Reverted change introduced in 5.3.3 to `justifi-terminals-list` - aa808c7 
  - The table column that displays the `provider_id` value has had its column header restored to it's original value: `Provider ID`.
- Added new table column to display `provider_serial_number` property from terminal response.
- `provider_serial_number` column is now loaded by default in the table, replacing `provider_id` column.
  - `provider_id` column is no longer shown by default on the component, but is still available to use when using the `columns` prop to configure the columns shown in the table.
