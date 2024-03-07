# legal-address-form



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute | Description | Type             | Default     |
| ---------------- | --------- | ----------- | ---------------- | ----------- |
| `formController` | --        |             | `FormController` | `undefined` |


## Dependencies

### Used by

 - [justifi-business-form-stepped](..)

### Depends on

- [form-control-text](../../form)
- [form-control-number](../../form)
- [form-control-select](../../form)

### Graph
```mermaid
graph TD;
  justifi-legal-address-form-step --> form-control-text
  justifi-legal-address-form-step --> form-control-number
  justifi-legal-address-form-step --> form-control-select
  justifi-business-form-stepped --> justifi-legal-address-form-step
  style justifi-legal-address-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
