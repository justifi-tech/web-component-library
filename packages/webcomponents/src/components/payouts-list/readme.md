# justifi-payouts-list



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type       | Default     |
| -------------- | --------- | ----------- | ---------- | ----------- |
| `getPayoutCSV` | --        |             | `Function` | `undefined` |
| `getPayouts`   | --        |             | `Function` | `undefined` |


## Events

| Event         | Description | Type                          |
| ------------- | ----------- | ----------------------------- |
| `error-event` |             | `CustomEvent<ComponentError>` |
| `row-clicked` |             | `CustomEvent<Payout>`         |


## Shadow Parts

| Part                | Description |
| ------------------- | ----------- |
| `"icon"`            |             |
| `"pagination-bar"`  |             |
| `"table"`           |             |
| `"table-body"`      |             |
| `"table-cell"`      |             |
| `"table-head"`      |             |
| `"table-head-cell"` |             |
| `"table-head-row"`  |             |
| `"table-wrapper"`   |             |


## Dependencies

### Used by

 - [justifi-payouts-list](.)

### Depends on

- [form-control-date](../../ui-components/form)
- [pagination-menu](../pagination-menu)

### Graph
```mermaid
graph TD;
  payouts-list-core --> form-control-date
  payouts-list-core --> pagination-menu
  form-control-date --> form-control-tooltip
  form-control-tooltip --> custom-popper
  justifi-payouts-list --> payouts-list-core
  style payouts-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
