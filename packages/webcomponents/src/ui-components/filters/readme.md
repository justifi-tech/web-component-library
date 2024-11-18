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

 - [payments-list-filters](../../components/payments-list)
 - [terminals-list-filters](../../components/terminals-list)

### Depends on

- [custom-popper](../custom-popper)

### Graph
```mermaid
graph TD;
  table-filters-menu --> custom-popper
  payments-list-filters --> table-filters-menu
  terminals-list-filters --> table-filters-menu
  style table-filters-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
