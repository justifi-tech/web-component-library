# justifi-business-generic-info-form



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

 - [justifi-business-core-info-form-step](.)

### Depends on

- [form-control-text](../../../form)
- [form-control-select](../../../form)
- [form-control-date](../../../form)
- [form-control-number-masked](../../../form)

### Graph
```mermaid
graph TD;
  justifi-business-core-info-form-step-core --> form-control-text
  justifi-business-core-info-form-step-core --> form-control-select
  justifi-business-core-info-form-step-core --> form-control-date
  justifi-business-core-info-form-step-core --> form-control-number-masked
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  justifi-business-core-info-form-step --> justifi-business-core-info-form-step-core
  style justifi-business-core-info-form-step-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
