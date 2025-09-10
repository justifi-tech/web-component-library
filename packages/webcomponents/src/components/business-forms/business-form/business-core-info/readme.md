# justifi-business-generic-info-form



<!-- Auto Generated Below -->


## Overview

The difference between this component and business-core-info-details
is that this component is meant to be a form and send data
and the other one  is meant to be just read only.

## Properties

| Property         | Attribute | Description | Type                                 | Default     |
| ---------------- | --------- | ----------- | ------------------------------------ | ----------- |
| `country`        | `country` |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |
| `formController` | --        |             | `FormController`                     | `undefined` |


## Dependencies

### Used by

 - [justifi-business-form](..)

### Depends on

- [form-control-text](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)
- [form-control-date](../../../../ui-components/form)
- [toggleable-field](../../utils)
- [form-control-number-masked](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-business-core-info --> form-control-text
  justifi-business-core-info --> form-control-select
  justifi-business-core-info --> form-control-date
  justifi-business-core-info --> toggleable-field
  justifi-business-core-info --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  toggleable-field --> form-control-number-masked
  form-control-number-masked --> form-control-tooltip
  justifi-business-form --> justifi-business-core-info
  style justifi-business-core-info fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
