# justifi-business-info



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type     | Default     |
| ------------ | ------------- | ----------- | -------- | ----------- |
| `authToken`  | `auth-token`  |             | `string` | `undefined` |
| `businessId` | `business-id` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [justifi-business-generic-info](business-generic-info)
- [justifi-legal-address-form](../legal-address-form)
- [justifi-business-representative](business-representative)
- [justifi-business-owners](business-owners)

### Graph
```mermaid
graph TD;
  justifi-business-form --> justifi-business-generic-info
  justifi-business-form --> justifi-legal-address-form
  justifi-business-form --> justifi-business-representative
  justifi-business-form --> justifi-business-owners
  justifi-business-generic-info --> form-control-text
  justifi-business-generic-info --> form-control-select
  justifi-legal-address-form --> form-control-text
  justifi-legal-address-form --> form-control-select
  justifi-business-representative --> form-control-text
  justifi-business-representative --> form-control-select
  justifi-business-representative --> justifi-business-address-form
  justifi-business-address-form --> form-control-text
  justifi-business-address-form --> form-control-select
  justifi-business-owners --> form-control-text
  style justifi-business-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
