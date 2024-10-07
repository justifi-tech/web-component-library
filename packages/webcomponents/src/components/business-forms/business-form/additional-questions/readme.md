# justifi-additional-questions



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type             | Default     |
| ---------------- | ----------------- | ----------- | ---------------- | ----------- |
| `formController` | `form-controller` |             | `FormController` | `undefined` |


## Dependencies

### Used by

 - [justifi-business-form](..)

### Depends on

- [form-control-monetary](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)
- [form-control-text](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-additional-questions --> form-control-monetary
  justifi-additional-questions --> form-control-select
  justifi-additional-questions --> form-control-text
  form-control-monetary --> form-control-help-text
  form-control-monetary --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  justifi-business-form --> justifi-additional-questions
  style justifi-additional-questions fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
