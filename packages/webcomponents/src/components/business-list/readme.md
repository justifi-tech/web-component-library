# justifi-business-list



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                           | Type     | Default     |
| ----------- | ------------ | --------------------------------------------------------------------- | -------- | ----------- |
| `accountId` | `account-id` | The Account ID to fetch payments. This is required to fetch any data. | `string` | `undefined` |
| `authToken` | `auth-token` | The Auth Token to fetch payments. This is required to fetch any data. | `string` | `undefined` |


## Dependencies

### Depends on

- [justifi-table](../table)

### Graph
```mermaid
graph TD;
  justifi-business-list --> justifi-table
  justifi-table --> pagination-menu
  style justifi-business-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
