# justifi-business-representative



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type             | Default     |
| ---------------- | ----------------- | ----------- | ---------------- | ----------- |
| `formController` | `form-controller` |             | `FormController` | `undefined` |


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
  justifi-business-representative --> justifi-identity-address-form
  form-control-text --> form-control-tooltip
  form-control-text --> form-control-error-text
  form-control-tooltip --> custom-popper
  form-control-number-masked --> form-control-tooltip
  form-control-number-masked --> form-control-error-text
  form-control-date --> form-control-tooltip
  form-control-date --> form-control-error-text
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  form-control-select --> form-control-tooltip
  form-control-select --> form-control-error-text
  justifi-business-form --> justifi-business-representative
  style justifi-business-representative fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
