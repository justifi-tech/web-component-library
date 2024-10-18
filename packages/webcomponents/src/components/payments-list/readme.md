# justifi-payments-list



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description | Type       | Default     |
| ------------- | --------- | ----------- | ---------- | ----------- |
| `getPayments` | --        |             | `Function` | `undefined` |


## Events

| Event                 | Description | Type                          |
| --------------------- | ----------- | ----------------------------- |
| `error-event`         |             | `CustomEvent<ComponentError>` |
| `payment-row-clicked` |             | `CustomEvent<Payment>`        |


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

 - [justifi-payments-list](.)

### Depends on

- [text-filter](../../ui-components/filters)
- [select-filter](../../ui-components/filters)
- [date-filter](../../ui-components/filters)
- [table-filters-menu](../../ui-components/filters)
- [pagination-menu](../pagination-menu)

### Graph
```mermaid
graph TD;
  payments-list-core --> text-filter
  payments-list-core --> select-filter
  payments-list-core --> date-filter
  payments-list-core --> table-filters-menu
  payments-list-core --> pagination-menu
  table-filters-menu --> custom-popper
  justifi-payments-list --> payments-list-core
  style payments-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
