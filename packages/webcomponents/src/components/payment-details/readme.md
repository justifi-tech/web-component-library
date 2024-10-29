# justifi-payment-details



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute | Description | Type       | Default     |
| ------------------- | --------- | ----------- | ---------- | ----------- |
| `getPaymentDetails` | --        |             | `Function` | `undefined` |


## Events

| Event         | Description | Type                          |
| ------------- | ----------- | ----------------------------- |
| `error-event` |             | `CustomEvent<ComponentError>` |


## Shadow Parts

| Part                  | Description |
| --------------------- | ----------- |
| `"detail-head-badge"` |             |
| `"detail-section"`    |             |


## Dependencies

### Used by

 - [justifi-payment-details](.)

### Depends on

- [justifi-details](../../ui-components/details)

### Graph
```mermaid
graph TD;
  payment-details-core --> justifi-details
  justifi-payment-details --> payment-details-core
  style payment-details-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
