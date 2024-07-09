# justifi-business-owners



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type      | Default     |
| --------------------- | ----------------------- | ----------- | --------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean` | `undefined` |
| `authToken`           | `auth-token`            |             | `string`  | `undefined` |
| `businessId`          | `business-id`           |             | `string`  | `undefined` |


## Events

| Event         | Description | Type                                        |
| ------------- | ----------- | ------------------------------------------- |
| `click-event` |             | `CustomEvent<OwnerFormClickEvent>`          |
| `formLoading` |             | `CustomEvent<boolean>`                      |
| `serverError` |             | `CustomEvent<BusinessFormServerErrorEvent>` |
| `submitted`   |             | `CustomEvent<BusinessFormSubmitEvent>`      |


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

- [justifi-owner-form](../../owner-form)

### Graph
```mermaid
graph TD;
  justifi-business-owners-form-step --> justifi-owner-form
  justifi-owner-form --> form-control-text
  justifi-owner-form --> form-control-number-masked
  justifi-owner-form --> form-control-date
  justifi-owner-form --> justifi-identity-address-form
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  justifi-payment-provisioning --> justifi-business-owners-form-step
  style justifi-business-owners-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
