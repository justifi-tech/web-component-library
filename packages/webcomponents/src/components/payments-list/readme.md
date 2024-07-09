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

- [justifi-table](../table)

### Graph
```mermaid
graph TD;
  payments-list-core --> justifi-table
  justifi-table --> pagination-menu
  justifi-payments-list --> payments-list-core
  style payments-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
