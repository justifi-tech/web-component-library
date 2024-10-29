# justifi-business-owners



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type       | Default     |
| --------------------- | ----------------------- | ----------- | ---------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean`  | `undefined` |
| `authToken`           | `auth-token`            |             | `string`   | `undefined` |
| `businessId`          | `business-id`           |             | `string`   | `undefined` |
| `getBusiness`         | --                      |             | `Function` | `undefined` |
| `patchBusiness`       | --                      |             | `Function` | `undefined` |


## Events

| Event         | Description | Type                                   |
| ------------- | ----------- | -------------------------------------- |
| `click-event` |             | `CustomEvent<BusinessFormClickEvent>`  |
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

 - [justifi-business-owners-form-step](.)

### Depends on

- [justifi-owner-form](../../owner-form)

### Graph
```mermaid
graph TD;
  justifi-business-owners-form-step-core --> justifi-owner-form
  justifi-owner-form --> owner-form-core
  owner-form-core --> owner-form-inputs
  owner-form-inputs --> form-control-text
  owner-form-inputs --> form-control-number-masked
  owner-form-inputs --> form-control-date
  owner-form-inputs --> justifi-identity-address-form
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  justifi-business-owners-form-step --> justifi-business-owners-form-step-core
  style justifi-business-owners-form-step-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
