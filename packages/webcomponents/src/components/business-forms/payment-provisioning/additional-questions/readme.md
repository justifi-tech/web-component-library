# justifi-additional-questions



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type      | Default     |
| --------------------- | ----------------------- | ----------- | --------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean` | `undefined` |
| `authToken`           | `auth-token`            |             | `string`  | `undefined` |
| `businessId`          | `business-id`           |             | `string`  | `undefined` |


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

- [form-control-tooltip](../../../../ui-components/form/form-helpers/form-control-tooltip)
- [form-control-monetary-provisioning](..)
- [form-control-text](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-additional-questions-form-step --> form-control-tooltip
  justifi-additional-questions-form-step --> form-control-monetary-provisioning
  justifi-additional-questions-form-step --> form-control-text
  justifi-additional-questions-form-step --> form-control-select
  form-control-tooltip --> custom-popper
  form-control-text --> form-control-tooltip
  form-control-select --> form-control-tooltip
  justifi-payment-provisioning-form-steps --> justifi-additional-questions-form-step
  style justifi-additional-questions-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
