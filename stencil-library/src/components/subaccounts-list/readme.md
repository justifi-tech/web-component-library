# justifi-subaccounts-list



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type     | Default     |
| ----------- | ------------ | ----------- | -------- | ----------- |
| `accountId` | `account-id` |             | `string` | `undefined` |
| `authToken` | `auth-token` |             | `string` | `undefined` |


## Events

| Event                    | Description | Type                      |
| ------------------------ | ----------- | ------------------------- |
| `subaccount-row-clicked` |             | `CustomEvent<SubAccount>` |


## Dependencies

### Depends on

- [justifi-table](../table)

### Graph
```mermaid
graph TD;
  justifi-subaccounts-list --> justifi-table
  justifi-table --> pagination-menu
  style justifi-subaccounts-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
