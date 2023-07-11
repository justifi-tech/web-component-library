# justifi-business-address



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute       | Description | Type        | Default     |
| ------------- | --------------- | ----------- | ----------- | ----------- |
| `form`        | --              |             | `FormState` | `undefined` |
| `subFormName` | `sub-form-name` |             | `string`    | `undefined` |


## Dependencies

### Used by

 - [justifi-business-representative](../business-representative)

### Depends on

- [form-control-text](../../form)
- [form-control-select](../../form)

### Graph
```mermaid
graph TD;
  justifi-business-address-form --> form-control-text
  justifi-business-address-form --> form-control-select
  justifi-business-representative --> justifi-business-address-form
  style justifi-business-address-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
