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
 - [owner-form-inputs](..)

### Depends on

- [form-control-text](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  justifi-business-representative --> justifi-identity-address-form
  justifi-business-representative-form-inputs --> justifi-identity-address-form
  owner-form-inputs --> justifi-identity-address-form
  style justifi-identity-address-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
