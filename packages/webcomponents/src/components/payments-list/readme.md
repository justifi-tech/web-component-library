# justifi-payments-list

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description | Type       | Default     |
| ------------- | --------- | ----------- | ---------- | ----------- |
| `columns`     | `columns` |             | `string`   | `undefined` |
| `getPayments` | --        |             | `Function` | `undefined` |


## Events

| Event         | Description | Type                               |
| ------------- | ----------- | ---------------------------------- |
| `click-event` |             | `CustomEvent<ComponentClickEvent>` |
| `error-event` |             | `CustomEvent<ComponentErrorEvent>` |


## Dependencies

### Used by

 - [justifi-payments-list](.)

### Depends on

- [pagination-menu](../../ui-components/pagination-menu)

### Graph
```mermaid
graph TD;
  payments-list-core --> pagination-menu
  justifi-payments-list --> payments-list-core
  style payments-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
