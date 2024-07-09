# legal-address-form



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute | Description | Type             | Default     |
| ---------------- | --------- | ----------- | ---------------- | ----------- |
| `formController` | --        |             | `FormController` | `undefined` |


## Dependencies

### Used by

 - [justifi-business-form](..)

### Depends on

- [form-control-text](../../../form)
- [form-control-select](../../../form)

### Graph
```mermaid
graph TD;
  justifi-legal-address-form --> form-control-text
  justifi-legal-address-form --> form-control-select
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  justifi-business-form --> justifi-legal-address-form
  style justifi-legal-address-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
