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

- [form-control-select](../form)
- [form-control-date](../form)
- [pagination-menu](../pagination-menu)

### Graph
```mermaid
graph TD;
  payments-list-core --> form-control-select
  payments-list-core --> form-control-date
  payments-list-core --> pagination-menu
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  justifi-payments-list --> payments-list-core
  style payments-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
