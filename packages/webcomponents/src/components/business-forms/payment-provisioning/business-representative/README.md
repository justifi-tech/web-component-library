# justifi-business-representative



<!-- Auto Generated Below -->


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

 - [justifi-payment-provisioning-form-steps](..)

### Depends on

- [form-control-text](../../../form)
- [form-control-number-masked](../../../form)
- [form-control-date](../../../form)
- [justifi-identity-address-form](../../owner-form/identity-address)

### Graph
```mermaid
graph TD;
  justifi-business-representative-form-step --> form-control-text
  justifi-business-representative-form-step --> form-control-number-masked
  justifi-business-representative-form-step --> form-control-date
  justifi-business-representative-form-step --> justifi-identity-address-form
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  justifi-payment-provisioning-form-steps --> justifi-business-representative-form-step
  style justifi-business-representative-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
