# legal-address-form



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type       | Default     |
| --------------------- | ----------------------- | ----------- | ---------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean`  | `undefined` |
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

 - [justifi-legal-address-form-step](.)

### Depends on

- [form-control-text](../../../form)
- [form-control-select](../../../form)

### Graph
```mermaid
graph TD;
  justifi-legal-address-form-step-core --> form-control-text
  justifi-legal-address-form-step-core --> form-control-select
  form-control-text --> custom-tool-tip
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  justifi-legal-address-form-step --> justifi-legal-address-form-step-core
  style justifi-legal-address-form-step-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
