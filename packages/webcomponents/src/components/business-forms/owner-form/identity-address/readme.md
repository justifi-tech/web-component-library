# justifi-business-address



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute        | Description | Type                    | Default     |
| ------------------ | ---------------- | ----------- | ----------------------- | ----------- |
| `defaultValues`    | `default-values` |             | `any`                   | `undefined` |
| `errors`           | `errors`         |             | `any`                   | `undefined` |
| `handleFormUpdate` | --               |             | `(values: any) => void` | `undefined` |


## Dependencies

### Used by

 - [justifi-business-representative](../../business-form/business-representative)
 - [justifi-business-representative-form-inputs](../../payment-provisioning/business-representative)
 - [justifi-owner-form](..)

### Depends on

- [form-control-text](../../../form)
- [form-control-select](../../../form)

### Graph
```mermaid
graph TD;
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  justifi-business-representative --> justifi-identity-address-form
  justifi-business-representative-form-inputs --> justifi-identity-address-form
  justifi-owner-form --> justifi-identity-address-form
  style justifi-identity-address-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
