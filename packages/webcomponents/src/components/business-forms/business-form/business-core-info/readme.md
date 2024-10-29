# justifi-business-generic-info-form



<!-- Auto Generated Below -->


## Overview

The difference between this component and business-core-info-details
is that this component is meant to be a form and send data
and the other one  is meant to be just read only.

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
- [form-control-date](../../../form)
- [form-control-number-masked](../../../form)

### Graph
```mermaid
graph TD;
  justifi-business-core-info --> form-control-text
  justifi-business-core-info --> form-control-select
  justifi-business-core-info --> form-control-date
  justifi-business-core-info --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-text --> form-control-error-text
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  justifi-business-form --> justifi-business-core-info
  style justifi-business-core-info fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
