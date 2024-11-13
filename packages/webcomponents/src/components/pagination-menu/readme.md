# pagination-menu



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                 | Default                  |
| -------- | --------- | ----------- | -------------------- | ------------------------ |
| `paging` | --        |             | `ExtendedPagingInfo` | `ExtendedPagingDefaults` |
| `params` | --        |             | `{}`                 | `{}`                     |


## Shadow Parts

| Part                 | Description |
| -------------------- | ----------- |
| `"page-arrow"`       |             |
| `"page-button-text"` |             |


## Dependencies

### Used by

 - [payments-list-core](../payments-list)
 - [payouts-list-core](../payouts-list)
 - [terminals-list-core](../terminals-list)

### Graph
```mermaid
graph TD;
  payments-list-core --> pagination-menu
  payouts-list-core --> pagination-menu
  terminals-list-core --> pagination-menu
  style pagination-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
