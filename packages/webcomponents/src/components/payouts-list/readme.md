# justifi-payouts-list



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute | Description | Type       | Default     |
| -------------- | --------- | ----------- | ---------- | ----------- |
| `getPayoutCSV` | --        |             | `Function` | `undefined` |
| `getPayouts`   | --        |             | `Function` | `undefined` |


## Events

| Event                | Description | Type                          |
| -------------------- | ----------- | ----------------------------- |
| `error-event`        |             | `CustomEvent<ComponentError>` |
| `payout-row-clicked` |             | `CustomEvent<Payout>`         |


## Dependencies

### Used by

 - [justifi-payouts-list](.)

### Depends on

- [form-control-date](../form)
- [justifi-table](../table)

### Graph
```mermaid
graph TD;
  payouts-list-core --> form-control-date
  payouts-list-core --> justifi-table
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  justifi-table --> pagination-menu
  justifi-payouts-list --> payouts-list-core
  style payouts-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
