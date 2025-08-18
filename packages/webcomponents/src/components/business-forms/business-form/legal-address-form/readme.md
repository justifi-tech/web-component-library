# legal-address-form



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

- [justifi-form-address-fields](../../payment-provisioning/form-address-fields)

### Graph
```mermaid
graph TD;
  justifi-legal-address-form --> justifi-form-address-fields
  justifi-form-address-fields --> form-control-text
  justifi-form-address-fields --> form-control-select
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  justifi-business-form --> justifi-legal-address-form
  style justifi-legal-address-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
