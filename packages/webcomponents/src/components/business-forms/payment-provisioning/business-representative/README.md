# justifi-business-representative



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type       | Default     |
| --------------------- | ----------------------- | ----------- | ---------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean`  | `undefined` |
| `getBusiness`         | --                      |             | `Function` | `undefined` |
| `patchBusiness`       | --                      |             | `Function` | `undefined` |


## Events

| Event                 | Description | Type                                          |
| --------------------- | ----------- | --------------------------------------------- |
| `error-event`         |             | `CustomEvent<ComponentError>`                 |
| `form-step-completed` |             | `CustomEvent<BusinessFormStepCompletedEvent>` |
| `formLoading`         |             | `CustomEvent<boolean>`                        |
| `submitted`           |             | `CustomEvent<BusinessFormSubmitEvent>`        |


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

 - [justifi-business-representative-form-step](.)

### Depends on

- [justifi-business-representative-form-inputs](.)

### Graph
```mermaid
graph TD;
  justifi-business-representative-form-step-core --> justifi-business-representative-form-inputs
  justifi-business-representative-form-inputs --> form-control-tooltip
  justifi-business-representative-form-inputs --> form-control-text
  justifi-business-representative-form-inputs --> form-control-number-masked
  justifi-business-representative-form-inputs --> form-control-date
  justifi-business-representative-form-inputs --> justifi-identity-address-form
  form-control-tooltip --> custom-popper
  form-control-text --> form-control-tooltip
  form-control-text --> form-control-error-text
  form-control-number-masked --> form-control-tooltip
  form-control-number-masked --> form-control-error-text
  form-control-date --> form-control-tooltip
  form-control-date --> form-control-error-text
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  form-control-select --> form-control-tooltip
  form-control-select --> form-control-error-text
  justifi-business-representative-form-step --> justifi-business-representative-form-step-core
  style justifi-business-representative-form-step-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
