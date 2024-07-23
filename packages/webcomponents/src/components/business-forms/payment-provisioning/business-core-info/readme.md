# justifi-business-generic-info-form



<!-- Auto Generated Below -->


## Overview

The difference between this component and business-generic-info-details
is that this component is meant to be a form and send data
and the other one  is meant to be just read only.

## Properties

| Property              | Attribute               | Description | Type      | Default     |
| --------------------- | ----------------------- | ----------- | --------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean` | `undefined` |
| `authToken`           | `auth-token`            |             | `string`  | `undefined` |
| `businessId`          | `business-id`           |             | `string`  | `undefined` |


## Events

| Event         | Description | Type                                   |
| ------------- | ----------- | -------------------------------------- |
| `error-event` |             | `CustomEvent<ComponentError>`          |
| `formLoading` |             | `CustomEvent<boolean>`                 |
| `submitted`   |             | `CustomEvent<BusinessFormSubmitEvent>` |


## Methods

### `validateAndSubmit({ onSuccess }: { onSuccess: any; }) => Promise<void>`



#### Parameters

| Name  | Type                  | Description |
| ----- | --------------------- | ----------- |
| `__0` | `{ onSuccess: any; }` |             |

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [justifi-payment-provisioning](..)

### Depends on

- [form-control-text](../../../form)
- [form-control-select](../../../form)
- [form-control-date](../../../form)
- [form-control-number-masked](../../../form)

### Graph
```mermaid
graph TD;
  justifi-business-core-info-form-step --> form-control-text
  justifi-business-core-info-form-step --> form-control-select
  justifi-business-core-info-form-step --> form-control-date
  justifi-business-core-info-form-step --> form-control-number-masked
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  justifi-payment-provisioning --> justifi-business-core-info-form-step
  style justifi-business-core-info-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
