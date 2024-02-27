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

### Depends on

- [form-control-text](../../form)
- [form-control-select](../../form)
- [form-control-number-masked](../../form)

### Graph
```mermaid
graph TD;
  justifi-business-core-info-form-step --> form-control-text
  justifi-business-core-info-form-step --> form-control-select
  justifi-business-core-info-form-step --> form-control-number-masked
  style justifi-business-core-info-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
