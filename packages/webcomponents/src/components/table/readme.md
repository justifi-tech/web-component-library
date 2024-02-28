# justifi-table



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute       | Description | Type                     | Default                  |
| ------------------------- | --------------- | ----------- | ------------------------ | ------------------------ |
| `columnData` _(required)_ | --              |             | `(string \| string[])[]` | `undefined`              |
| `entityId`                | --              |             | `string[]`               | `undefined`              |
| `errorMessage`            | `error-message` |             | `string`                 | `''`                     |
| `loading`                 | `loading`       |             | `boolean`                | `true`                   |
| `paging`                  | --              |             | `ExtendedPagingInfo`     | `ExtendedPagingDefaults` |
| `params`                  | `params`        |             | `any`                    | `{}`                     |
| `rowClickHandler`         | --              |             | `(e: any) => any`        | `undefined`              |
| `rowData`                 | --              |             | `any[]`                  | `[]`                     |


## Shadow Parts

| Part                | Description |
| ------------------- | ----------- |
| `"pagination-bar"`  |             |
| `"table-body"`      |             |
| `"table-cell"`      |             |
| `"table-head"`      |             |
| `"table-head-cell"` |             |
| `"table-head-row"`  |             |


## Dependencies

### Used by

 - [justifi-business-list](../business-list)
 - [justifi-payment-balance-transactions](../payment-balance-transactions)
 - [justifi-proceeds-list](../proceeds-list)
 - [justifi-subaccounts-list](../subaccounts-list)
 - [payments-list-core](../payments-list)
 - [payouts-list-core](../payouts-list)

### Depends on

- [pagination-menu](../pagination-menu)

### Graph
```mermaid
graph TD;
  justifi-table --> pagination-menu
  justifi-business-list --> justifi-table
  justifi-payment-balance-transactions --> justifi-table
  justifi-proceeds-list --> justifi-table
  justifi-subaccounts-list --> justifi-table
  payments-list-core --> justifi-table
  payouts-list-core --> justifi-table
  style justifi-table fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
