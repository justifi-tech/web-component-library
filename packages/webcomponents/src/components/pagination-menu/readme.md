# pagination-menu



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                 | Default                  |
| -------- | --------- | ----------- | -------------------- | ------------------------ |
| `paging` | --        |             | `ExtendedPagingInfo` | `ExtendedPagingDefaults` |
| `params` | --        |             | `{}`                 | `{}`                     |


## Dependencies

### Used by

 - [checkouts-list-core](../checkouts-list)
 - [payments-list-core](../payments-list)
 - [payouts-list-core](../payouts-list)
 - [terminal-orders-list-core](../terminal-orders-list)
 - [terminals-list-core](../terminals-list)

### Graph
```mermaid
graph TD;
  checkouts-list-core --> pagination-menu
  payments-list-core --> pagination-menu
  payouts-list-core --> pagination-menu
  terminal-orders-list-core --> pagination-menu
  terminals-list-core --> pagination-menu
  style pagination-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
