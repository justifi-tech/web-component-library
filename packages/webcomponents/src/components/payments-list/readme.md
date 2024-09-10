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


## Dependencies

### Used by

 - [justifi-payments-list](.)

### Depends on

- [form-control-date](../form)
- [justifi-table](../table)

### Graph
```mermaid
graph TD;
  payments-list-core --> form-control-date
  payments-list-core --> justifi-table
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  justifi-table --> pagination-menu
  justifi-payments-list --> payments-list-core
  style payments-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
