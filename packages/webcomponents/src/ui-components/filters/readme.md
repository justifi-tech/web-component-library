# text-filter



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description | Type         | Default     |
| ------------- | --------- | ----------- | ------------ | ----------- |
| `clearParams` | --        |             | `() => void` | `undefined` |
| `params`      | `params`  |             | `any`        | `undefined` |


## Dependencies

### Used by

 - [justifi-checkouts-list-filters](../../components/checkouts-list)
 - [justifi-payments-list-filters](../../components/payments-list)
 - [justifi-payouts-list-filters](../../components/payouts-list)
 - [justifi-terminal-orders-list-filters](../../components/terminal-orders-list)
 - [justifi-terminals-list-filters](../../components/terminals-list)

### Depends on

- [custom-popper](../custom-popper)

### Graph
```mermaid
graph TD;
  table-filters-menu --> custom-popper
  justifi-checkouts-list-filters --> table-filters-menu
  justifi-payments-list-filters --> table-filters-menu
  justifi-payouts-list-filters --> table-filters-menu
  justifi-terminal-orders-list-filters --> table-filters-menu
  justifi-terminals-list-filters --> table-filters-menu
  style table-filters-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
