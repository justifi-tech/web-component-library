# justifi-business-info



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type     | Default     |
| ------------ | ------------- | ----------- | -------- | ----------- |
| `authToken`  | `auth-token`  |             | `string` | `undefined` |
| `businessId` | `business-id` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [form-component](../form)
- [form-control-text](../form)
- [form-control-select](../form)
- [justifi-business-representative](business-representative)

### Graph
```mermaid
graph TD;
  justifi-business-form --> form-component
  justifi-business-form --> form-control-text
  justifi-business-form --> form-control-select
  justifi-business-form --> justifi-business-representative
  justifi-business-representative --> form-control-text
  justifi-business-representative --> form-control-select
  justifi-business-representative --> justifi-business-address-form
  justifi-business-address-form --> form-control-text
  justifi-business-address-form --> form-control-select
  style justifi-business-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
