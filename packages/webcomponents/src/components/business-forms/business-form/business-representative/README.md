# justifi-business-representative



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
- [form-control-number-masked](../../../form)
- [form-control-date](../../../form)
- [justifi-identity-address-form](../../owner-form/identity-address)

### Graph
```mermaid
graph TD;
  justifi-business-representative --> form-control-text
  justifi-business-representative --> form-control-number-masked
  justifi-business-representative --> form-control-date
  justifi-business-representative --> justifi-identity-address-form
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  justifi-business-form --> justifi-business-representative
  style justifi-business-representative fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
