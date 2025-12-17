# justifi-business-representative



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                 | Default     |
| --------------------- | ----------------------- | ----------- | ------------------------------------ | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean`                            | `undefined` |
| `authToken`           | `auth-token`            |             | `string`                             | `undefined` |
| `businessId`          | `business-id`           |             | `string`                             | `undefined` |
| `country`             | `country`               |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |


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

 - [justifi-payment-provisioning-form-steps](..)

### Depends on

- [justifi-business-representative-form-inputs](.)

### Graph
```mermaid
graph TD;
  justifi-business-representative-form-step --> justifi-business-representative-form-inputs
  justifi-business-representative-form-inputs --> form-control-tooltip
  justifi-business-representative-form-inputs --> form-control-text
  justifi-business-representative-form-inputs --> form-control-number-masked
  justifi-business-representative-form-inputs --> form-control-date
  justifi-business-representative-form-inputs --> justifi-identity-address-form
  form-control-tooltip --> custom-popper
  form-control-text --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  form-control-date --> form-control-tooltip
  justifi-identity-address-form --> justifi-form-address-fields
  justifi-form-address-fields --> form-control-text
  justifi-form-address-fields --> form-control-select
  form-control-select --> form-control-tooltip
  justifi-payment-provisioning-form-steps --> justifi-business-representative-form-step
  style justifi-business-representative-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
