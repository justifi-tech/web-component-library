# text-filter



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description | Type         | Default     |
| ------------- | --------- | ----------- | ------------ | ----------- |
| `clearParams` | --        |             | `() => void` | `undefined` |
| `params`      | `params`  |             | `any`        | `undefined` |


## Shadow Parts

| Part              | Description |
| ----------------- | ----------- |
| `"dropdown-menu"` |             |


## Dependencies

### Used by

 - [justifi-checkouts-list-filters](../../components/checkouts-list)
 - [justifi-payments-list-filters](../../components/payments-list)
 - [justifi-terminals-list-filters](../../components/terminals-list)
 - [payouts-list-filters](../../components/payouts-list)

### Depends on

- [custom-popper](../custom-popper)

### Graph
```mermaid
graph TD;
  table-filters-menu --> custom-popper
  justifi-checkouts-list-filters --> table-filters-menu
  justifi-payments-list-filters --> table-filters-menu
  justifi-terminals-list-filters --> table-filters-menu
  payouts-list-filters --> table-filters-menu
  style table-filters-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
