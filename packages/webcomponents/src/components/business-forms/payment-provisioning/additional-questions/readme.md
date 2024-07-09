# justifi-additional-questions



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

- [form-control-monetary](../../../form)
- [form-control-select](../../../form)
- [form-control-text](../../../form)

### Graph
```mermaid
graph TD;
  justifi-additional-questions-form-step --> form-control-monetary
  justifi-additional-questions-form-step --> form-control-select
  justifi-additional-questions-form-step --> form-control-text
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  justifi-payment-provisioning --> justifi-additional-questions-form-step
  style justifi-additional-questions-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
