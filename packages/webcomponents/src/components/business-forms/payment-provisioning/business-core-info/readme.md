# justifi-business-generic-info-form



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

- [form-control-text](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)
- [form-control-date](../../../../ui-components/form)
- [form-control-number-masked](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  business-core-info-form-step --> form-control-text
  business-core-info-form-step --> form-control-select
  business-core-info-form-step --> form-control-date
  business-core-info-form-step --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  payment-provisioning-form-steps --> business-core-info-form-step
  style business-core-info-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
