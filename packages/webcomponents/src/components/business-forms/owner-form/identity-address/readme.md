# justifi-business-address



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type                    | Default     |
| --------------- | ---------------- | ----------- | ----------------------- | ----------- |
| `defaultValues` | `default-values` |             | `any`                   | `undefined` |
| `errors`        | `errors`         |             | `any`                   | `undefined` |
| `onFormUpdate`  | --               |             | `(values: any) => void` | `undefined` |


## Dependencies

### Used by

 - [justifi-business-representative](../business-representative)
 - [justifi-business-representative-form-step](../../business-form-stepped/business-representative)

### Depends on

- [form-control-text](../../form)
- [form-control-select](../../form)
- [form-control-number](../../form)

### Graph
```mermaid
graph TD;
  justifi-business-address-form --> form-control-text
  justifi-business-address-form --> form-control-select
  justifi-business-address-form --> form-control-number
  justifi-business-representative --> justifi-business-address-form
  justifi-business-representative-form-step --> justifi-business-address-form
  style justifi-business-address-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
