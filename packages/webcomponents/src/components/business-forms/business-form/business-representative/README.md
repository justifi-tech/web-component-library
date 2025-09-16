# justifi-business-representative



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type                                 | Default     |
| ---------------- | ----------------- | ----------- | ------------------------------------ | ----------- |
| `country`        | `country`         |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |
| `formController` | `form-controller` |             | `FormController`                     | `undefined` |


## Dependencies

### Used by

 - [justifi-business-form](..)

### Depends on

- [form-control-text](../../../../ui-components/form)
- [form-control-number-masked](../../../../ui-components/form)
- [form-control-date](../../../../ui-components/form)
 
- [justifi-identity-address-form](../../owner-form/identity-address)

### Graph
```mermaid
graph TD;
  justifi-business-representative --> form-control-text
  justifi-business-representative --> form-control-number-masked
  justifi-business-representative --> form-control-date
  justifi-business-representative --> toggleable-field
  justifi-business-representative --> justifi-identity-address-form
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-number-masked --> form-control-tooltip
  form-control-date --> form-control-tooltip
  toggleable-field --> form-control-number-masked
  justifi-identity-address-form --> justifi-form-address-fields
  justifi-form-address-fields --> form-control-text
  justifi-form-address-fields --> form-control-select
  form-control-select --> form-control-tooltip
  justifi-business-form --> justifi-business-representative
  style justifi-business-representative fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
