# justifi-business-generic-info-form



<!-- Auto Generated Below -->


## Overview

The difference between this component and business-core-info-details
is that this component is meant to be a form and send data
and the other one  is meant to be just read only.

## Properties

| Property                      | Attribute | Description | Type                                 | Default     |
| ----------------------------- | --------- | ----------- | ------------------------------------ | ----------- |
| `country` _(required)_        | `country` |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |
| `formController` _(required)_ | --        |             | `FormController`                     | `undefined` |


## Dependencies

### Used by

 - [justifi-business-form](..)

### Depends on

- [form-control-text](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)
- [form-control-date](../../../../ui-components/form)
- [form-control-number-masked](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  business-core-info --> form-control-text
  business-core-info --> form-control-select
  business-core-info --> form-control-date
  business-core-info --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  justifi-business-form --> business-core-info
  style business-core-info fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
