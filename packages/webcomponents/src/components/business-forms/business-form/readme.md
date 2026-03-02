# justifi-business-info



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute      | Description | Type      | Default                  |
| ------------------------- | -------------- | ----------- | --------- | ------------------------ |
| `authToken` _(required)_  | `auth-token`   |             | `string`  | `undefined`              |
| `businessId` _(required)_ | `business-id`  |             | `string`  | `undefined`              |
| `formTitle`               | `form-title`   |             | `string`  | `'Business Information'` |
| `hideErrors`              | `hide-errors`  |             | `boolean` | `false`                  |
| `removeTitle`             | `remove-title` |             | `boolean` | `false`                  |


## Events

| Event          | Description | Type                                |
| -------------- | ----------- | ----------------------------------- |
| `click-event`  |             | `CustomEvent<ComponentClickEvent>`  |
| `error-event`  |             | `CustomEvent<ComponentErrorEvent>`  |
| `submit-event` |             | `CustomEvent<ComponentSubmitEvent>` |


## Dependencies

### Depends on

- [form-alert](../../../ui-components/form/form-helpers/form-alert)
- [business-core-info](business-core-info)
- [legal-address-form](legal-address-form)
- [additional-questions](additional-questions)
- [business-representative](business-representative)

### Graph
```mermaid
graph TD;
  justifi-business-form --> form-alert
  justifi-business-form --> business-core-info
  justifi-business-form --> legal-address-form
  justifi-business-form --> additional-questions
  justifi-business-form --> business-representative
  business-core-info --> form-control-text
  business-core-info --> form-control-select
  business-core-info --> form-control-date
  business-core-info --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  legal-address-form --> justifi-form-address-fields
  justifi-form-address-fields --> form-control-text
  justifi-form-address-fields --> form-control-select
  additional-questions --> form-control-monetary-provisioning
  additional-questions --> form-control-select
  additional-questions --> form-control-text
  business-representative --> form-control-text
  business-representative --> form-control-number-masked
  business-representative --> form-control-date
  business-representative --> justifi-identity-address-form
  justifi-identity-address-form --> justifi-form-address-fields
  style justifi-business-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
