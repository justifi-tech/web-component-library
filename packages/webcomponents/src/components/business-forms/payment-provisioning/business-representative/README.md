# justifi-business-representative



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute               | Description | Type                                 | Default     |
| ------------------------- | ----------------------- | ----------- | ------------------------------------ | ----------- |
| `allowOptionalFields`     | `allow-optional-fields` |             | `boolean`                            | `undefined` |
| `authToken` _(required)_  | `auth-token`            |             | `string`                             | `undefined` |
| `businessId` _(required)_ | `business-id`           |             | `string`                             | `undefined` |
| `country`                 | `country`               |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |


## Events

| Event                      | Description | Type                                          |
| -------------------------- | ----------- | --------------------------------------------- |
| `complete-form-step-event` |             | `CustomEvent<ComponentFormStepCompleteEvent>` |
| `error-event`              |             | `CustomEvent<ComponentErrorEvent>`            |
| `formLoading`              |             | `CustomEvent<boolean>`                        |


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

 - [payment-provisioning-form-steps](..)

### Depends on

- [business-representative-form-inputs](.)

### Graph
```mermaid
graph TD;
  business-representative-form-step --> business-representative-form-inputs
  business-representative-form-inputs --> form-control-tooltip
  business-representative-form-inputs --> form-control-text
  business-representative-form-inputs --> form-control-number-masked
  business-representative-form-inputs --> form-control-date
  business-representative-form-inputs --> justifi-identity-address-form
  form-control-tooltip --> custom-popper
  form-control-text --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  form-control-date --> form-control-tooltip
  justifi-identity-address-form --> form-address-fields
  form-address-fields --> form-control-text
  form-address-fields --> form-control-select
  form-control-select --> form-control-tooltip
  payment-provisioning-form-steps --> business-representative-form-step
  style business-representative-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
