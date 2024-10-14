# justifi-business-info



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type      | Default                  |
| ------------- | -------------- | ----------- | --------- | ------------------------ |
| `authToken`   | `auth-token`   |             | `string`  | `undefined`              |
| `businessId`  | `business-id`  |             | `string`  | `undefined`              |
| `formTitle`   | `form-title`   |             | `string`  | `'Business Information'` |
| `hideErrors`  | `hide-errors`  |             | `boolean` | `false`                  |
| `removeTitle` | `remove-title` |             | `boolean` | `false`                  |


## Events

| Event         | Description | Type                                   |
| ------------- | ----------- | -------------------------------------- |
| `click-event` |             | `CustomEvent<BusinessFormClickEvent>`  |
| `clickEvent`  |             | `CustomEvent<BusinessFormClickEvent>`  |
| `submitted`   |             | `CustomEvent<BusinessFormSubmitEvent>` |


## Dependencies

### Depends on

- [form-alert](../../form/form-helpers/form-alert)
- [justifi-business-core-info](business-core-info)
- [justifi-legal-address-form](legal-address-form)
- [justifi-additional-questions](additional-questions)
- [justifi-business-representative](business-representative)

### Graph
```mermaid
graph TD;
  justifi-business-form --> form-alert
  justifi-business-form --> justifi-business-core-info
  justifi-business-form --> justifi-legal-address-form
  justifi-business-form --> justifi-additional-questions
  justifi-business-form --> justifi-business-representative
  justifi-business-core-info --> form-control-text
  justifi-business-core-info --> form-control-select
  justifi-business-core-info --> form-control-date
  justifi-business-core-info --> form-control-number-masked
  form-control-text --> custom-tool-tip
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  justifi-legal-address-form --> form-control-text
  justifi-legal-address-form --> form-control-select
  justifi-additional-questions --> form-control-monetary
  justifi-additional-questions --> form-control-select
  justifi-additional-questions --> form-control-text
  form-control-monetary --> form-control-help-text
  form-control-monetary --> form-control-error-text
  justifi-business-representative --> form-control-text
  justifi-business-representative --> form-control-number-masked
  justifi-business-representative --> form-control-date
  justifi-business-representative --> justifi-identity-address-form
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  style justifi-business-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
