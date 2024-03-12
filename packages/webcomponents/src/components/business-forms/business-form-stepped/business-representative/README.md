# justifi-business-representative



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute | Description | Type             | Default     |
| ---------------- | --------- | ----------- | ---------------- | ----------- |
| `formController` | --        |             | `FormController` | `undefined` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"label"` |             |


## Dependencies

### Used by

 - [justifi-business-form-stepped](..)

### Depends on

- [form-control-text](../../form)
- [form-control-select](../../form)
- [form-control-number-masked](../../form)
- [form-control-datepart](../../form)
- [form-control-number](../../form)
- [justifi-business-address-form](../../business-form/business-address)

### Graph
```mermaid
graph TD;
  justifi-business-representative-form-step --> form-control-text
  justifi-business-representative-form-step --> form-control-select
  justifi-business-representative-form-step --> form-control-number-masked
  justifi-business-representative-form-step --> form-control-datepart
  justifi-business-representative-form-step --> form-control-number
  justifi-business-representative-form-step --> justifi-business-address-form
  justifi-business-address-form --> form-control-text
  justifi-business-address-form --> form-control-select
  justifi-business-address-form --> form-control-number
  justifi-business-form-stepped --> justifi-business-representative-form-step
  style justifi-business-representative-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
