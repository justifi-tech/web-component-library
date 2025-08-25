# legal-address-form



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                 | Default     |
| --------------------- | ----------------------- | ----------- | ------------------------------------ | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean`                            | `undefined` |
| `country`             | `country`               |             | `CountryCode.CAN \| CountryCode.USA` | `undefined` |
| `getBusiness`         | --                      |             | `Function`                           | `undefined` |
| `patchBusiness`       | --                      |             | `Function`                           | `undefined` |


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

 - [justifi-legal-address-form-step](.)

### Depends on

- [form-control-tooltip](../../../../ui-components/form/form-helpers/form-control-tooltip)
- [justifi-form-address-fields](../form-address-fields)

### Graph
```mermaid
graph TD;
  justifi-legal-address-form-step-core --> form-control-tooltip
  justifi-legal-address-form-step-core --> justifi-form-address-fields
  form-control-tooltip --> custom-popper
  justifi-form-address-fields --> form-control-text
  justifi-form-address-fields --> form-control-select
  form-control-text --> form-control-tooltip
  form-control-select --> form-control-tooltip
  justifi-legal-address-form-step --> justifi-legal-address-form-step-core
  style justifi-legal-address-form-step-core fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
