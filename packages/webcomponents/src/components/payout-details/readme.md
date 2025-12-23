# justifi-payout-details



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute             | Description | Type       | Default     |
| --------------------------- | --------------------- | ----------- | ---------- | ----------- |
| `enableRecordClick`         | `enable-record-click` |             | `boolean`  | `false`     |
| `getPayout` _(required)_    | --                    |             | `Function` | `undefined` |
| `getPayoutCSV` _(required)_ | --                    |             | `Function` | `undefined` |


## Events

| Event                | Description | Type                               |
| -------------------- | ----------- | ---------------------------------- |
| `error-event`        |             | `CustomEvent<ComponentErrorEvent>` |
| `record-click-event` |             | `CustomEvent<RecordClickEvent>`    |


## Dependencies

### Used by

 - [justifi-payout-details](.)

### Depends on

- [justifi-details](../../ui-components/details)

### Graph
```mermaid
graph TD;
  payout-details-core --> justifi-details
  justifi-payout-details --> payout-details-core
  style payout-details-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
