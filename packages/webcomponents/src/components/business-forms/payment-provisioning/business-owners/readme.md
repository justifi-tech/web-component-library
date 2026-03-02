# justifi-business-owners



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute               | Description | Type                                 | Default     |
| ------------------------- | ----------------------- | ----------- | ------------------------------------ | ----------- |
| `allowOptionalFields`     | `allow-optional-fields` |             | `boolean`                            | `undefined` |
| `authToken` _(required)_  | `auth-token`            |             | `string`                             | `undefined` |
| `businessId` _(required)_ | `business-id`           |             | `string`                             | `undefined` |
| `country` _(required)_    | `country`               |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |


## Events

| Event                      | Description | Type                                          |
| -------------------------- | ----------- | --------------------------------------------- |
| `click-event`              |             | `CustomEvent<ComponentClickEvent>`            |
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

- [form-control-tooltip](../../../../ui-components/form/form-helpers/form-control-tooltip)
- [owner-form](../../owner-form)

### Graph
```mermaid
graph TD;
  business-owners-form-step --> form-control-tooltip
  business-owners-form-step --> owner-form
  form-control-tooltip --> custom-popper
  owner-form --> owner-form-core
  owner-form-core --> owner-form-inputs
  owner-form-inputs --> form-control-text
  owner-form-inputs --> form-control-number-masked
  owner-form-inputs --> form-control-date
  owner-form-inputs --> form-control-number
  owner-form-inputs --> identity-address-form
  form-control-text --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  form-control-date --> form-control-tooltip
  identity-address-form --> form-address-fields
  form-address-fields --> form-control-text
  form-address-fields --> form-control-select
  form-control-select --> form-control-tooltip
  payment-provisioning-form-steps --> business-owners-form-step
  style business-owners-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
