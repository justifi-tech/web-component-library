# legal-address-form



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

- [form-control-tooltip](../../../../ui-components/form/form-helpers/form-control-tooltip)
- [form-address-fields](../form-address-fields)

### Graph
```mermaid
graph TD;
  legal-address-form-step --> form-control-tooltip
  legal-address-form-step --> form-address-fields
  form-control-tooltip --> custom-popper
  form-address-fields --> form-control-text
  form-address-fields --> form-control-select
  form-control-text --> form-control-tooltip
  form-control-select --> form-control-tooltip
  payment-provisioning-form-steps --> legal-address-form-step
  style legal-address-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
