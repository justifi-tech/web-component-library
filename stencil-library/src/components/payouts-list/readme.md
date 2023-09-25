# justifi-payouts-list



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type     | Default     |
| ----------- | ------------ | ----------- | -------- | ----------- |
| `accountId` | `account-id` |             | `string` | `undefined` |
| `authToken` | `auth-token` |             | `string` | `undefined` |


## Events

| Event                | Description | Type                  |
| -------------------- | ----------- | --------------------- |
| `payout-row-clicked` |             | `CustomEvent<Payout>` |


## Dependencies

### Depends on

- [justifi-table](../table)

### Graph
```mermaid
graph TD;
  justifi-payouts-list --> justifi-table
  style justifi-payouts-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
