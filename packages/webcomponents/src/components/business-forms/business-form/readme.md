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

| Event          | Description | Type                                |
| -------------- | ----------- | ----------------------------------- |
| `click-event`  |             | `CustomEvent<ComponentClickEvent>`  |
| `error-event`  |             | `CustomEvent<ComponentErrorEvent>`  |
| `submit-event` |             | `CustomEvent<ComponentSubmitEvent>` |


## Dependencies

### Depends on

- [form-alert](../../../ui-components/form/form-helpers/form-alert)
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
  justifi-business-core-info --> toggleable-field
  justifi-business-core-info --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  toggleable-field --> form-control-number-masked
  form-control-number-masked --> form-control-tooltip
  justifi-legal-address-form --> justifi-form-address-fields
  justifi-form-address-fields --> form-control-text
  justifi-form-address-fields --> form-control-select
  justifi-additional-questions --> form-control-monetary-provisioning
  justifi-additional-questions --> form-control-select
  justifi-additional-questions --> form-control-text
  justifi-business-representative --> form-control-text
  justifi-business-representative --> form-control-number-masked
  justifi-business-representative --> form-control-date
  justifi-business-representative --> toggleable-field
  justifi-business-representative --> justifi-identity-address-form
  justifi-identity-address-form --> justifi-form-address-fields
  style justifi-business-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
