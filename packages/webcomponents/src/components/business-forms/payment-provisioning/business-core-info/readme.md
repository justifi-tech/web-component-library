# justifi-business-generic-info-form



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute               | Description | Type                                 | Default     |
| ---------------------- | ----------------------- | ----------- | ------------------------------------ | ----------- |
| `allowOptionalFields`  | `allow-optional-fields` |             | `boolean`                            | `undefined` |
| `authToken`            | `auth-token`            |             | `string`                             | `undefined` |
| `businessId`           | `business-id`           |             | `string`                             | `undefined` |
| `country` _(required)_ | `country`               |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |


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

- [form-control-text](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)
- [form-control-date](../../../../ui-components/form)
- [form-control-number-masked](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-business-core-info-form-step --> form-control-text
  justifi-business-core-info-form-step --> form-control-select
  justifi-business-core-info-form-step --> form-control-date
  justifi-business-core-info-form-step --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  justifi-payment-provisioning-form-steps --> justifi-business-core-info-form-step
  style justifi-business-core-info-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
