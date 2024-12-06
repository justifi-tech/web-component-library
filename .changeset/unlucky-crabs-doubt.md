---
"@justifi/webcomponents": minor
---

- Refactored `justifi-payouts-list` component.
  - Adjusted column names and layout - removed certain columns such as `Type`, and `Paid Out To`.
  - Removed column header for `Actions` column, and updated CSV download icon to link displaying `CSV`
  - Added new optional prop: `columns` - can be used to sort order of columns, and manually hide/show columns. 
  - Added new filter menu, moved start and end date filters inside menu. 