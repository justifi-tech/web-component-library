# legal-address-form



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type             | Default     |
| ---------------- | ----------------- | ----------- | ---------------- | ----------- |
| `defaultValues`  | --                |             | `IAddress`       | `undefined` |
| `formController` | `form-controller` |             | `FormController` | `undefined` |


## Dependencies

### Used by

 - [justifi-business-form](..)

### Depends on

- [form-control-select](../../../../ui-components/form)
- [form-control-text](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-legal-address-form --> form-control-select
  justifi-legal-address-form --> form-control-text
  form-control-select --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-text --> form-control-tooltip
  justifi-business-form --> justifi-legal-address-form
  style justifi-legal-address-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
