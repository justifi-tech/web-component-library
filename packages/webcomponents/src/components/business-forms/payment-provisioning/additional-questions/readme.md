# justifi-additional-questions



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

 - [justifi-additional-questions-form-step](.)

### Depends on

- [form-control-tooltip](../../../../ui-components/form/form-helpers/form-control-tooltip)
- [form-control-monetary](../../../../ui-components/form)
- [form-control-select](../../../../ui-components/form)
- [form-control-text](../../../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-additional-questions-form-step-core --> form-control-tooltip
  justifi-additional-questions-form-step-core --> form-control-monetary
  justifi-additional-questions-form-step-core --> form-control-select
  justifi-additional-questions-form-step-core --> form-control-text
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-text --> form-control-tooltip
  justifi-additional-questions-form-step --> justifi-additional-questions-form-step-core
  style justifi-additional-questions-form-step-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
