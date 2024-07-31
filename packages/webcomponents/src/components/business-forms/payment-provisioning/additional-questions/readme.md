# justifi-additional-questions



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type      | Default     |
| --------------------- | ----------------------- | ----------- | --------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean` | `undefined` |
| `authToken`           | `auth-token`            |             | `string`  | `undefined` |
| `businessId`          | `business-id`           |             | `string`  | `undefined` |


## Events

| Event         | Description | Type                                   |
| ------------- | ----------- | -------------------------------------- |
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
  form-control-monetary --> form-control-help-text
  form-control-monetary --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  style justifi-additional-questions-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
