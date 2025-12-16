# justifi-payouts-list



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute | Description | Type       | Default     |
| ----------------------------- | --------- | ----------- | ---------- | ----------- |
| `columns` _(required)_        | `columns` |             | `string`   | `undefined` |
| `getPayoutCSV` _(required)_   | --        |             | `Function` | `undefined` |
| `getPayouts` _(required)_     | --        |             | `Function` | `undefined` |
| `getSubAccounts` _(required)_ | --        |             | `Function` | `undefined` |


## Events

| Event         | Description | Type                               |
| ------------- | ----------- | ---------------------------------- |
| `click-event` |             | `CustomEvent<ComponentClickEvent>` |
| `error-event` |             | `CustomEvent<ComponentErrorEvent>` |


## Dependencies

### Used by

 - [justifi-payouts-list](.)

### Depends on

- [pagination-menu](../../ui-components/pagination-menu)

### Graph
```mermaid
graph TD;
  payouts-list-core --> pagination-menu
  justifi-payouts-list --> payouts-list-core
  style payouts-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
