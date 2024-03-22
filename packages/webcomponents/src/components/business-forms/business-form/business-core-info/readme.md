# justifi-business-generic-info-form



<!-- Auto Generated Below -->


## Overview

The difference between this component and business-generic-info-details
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

- [form-control-text](../../form)
- [form-control-select](../../form)
- [form-control-number-masked](../../form)

### Graph
```mermaid
graph TD;
  justifi-business-generic-info --> form-control-text
  justifi-business-generic-info --> form-control-select
  justifi-business-generic-info --> form-control-number-masked
  justifi-business-form --> justifi-business-generic-info
  style justifi-business-generic-info fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
