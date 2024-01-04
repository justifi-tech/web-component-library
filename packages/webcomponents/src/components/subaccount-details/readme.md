# justifi-subaccount-details



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `accountId`    | `account-id`    |             | `string` | `undefined` |
| `authToken`    | `auth-token`    |             | `string` | `undefined` |
| `subaccountId` | `subaccount-id` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [justifi-details](../details)
- [subaccount-account-details](subaccount-account-details)
- [subaccount-merchant-details](subaccount-merchant-details)
- [subaccount-representative-details](subaccount-representative-details)
- [subaccount-owners-details](subaccount-owners-details)

### Graph
```mermaid
graph TD;
  justifi-subaccount-details --> justifi-details
  justifi-subaccount-details --> subaccount-account-details
  justifi-subaccount-details --> subaccount-merchant-details
  justifi-subaccount-details --> subaccount-representative-details
  justifi-subaccount-details --> subaccount-owners-details
  style justifi-subaccount-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
