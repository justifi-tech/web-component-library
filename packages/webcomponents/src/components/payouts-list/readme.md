# justifi-payouts-list



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute | Description | Type       | Default     |
| ------------ | --------- | ----------- | ---------- | ----------- |
| `getPayouts` | --        |             | `Function` | `undefined` |


## Events

| Event                | Description | Type                          |
| -------------------- | ----------- | ----------------------------- |
| `errorEvent`         |             | `CustomEvent<ComponentError>` |
| `payout-row-clicked` |             | `CustomEvent<Payout>`         |


## Dependencies

### Used by

 - [justifi-payouts-list](.)

### Depends on

- [justifi-table](../table)

### Graph
```mermaid
graph TD;
  payouts-list-core --> justifi-table
  justifi-table --> pagination-menu
  justifi-payouts-list --> payouts-list-core
  style payouts-list-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
