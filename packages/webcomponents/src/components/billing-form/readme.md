# justifi-billing-form



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                      | Type     | Default     |
| -------- | --------- | -------------------------------- | -------- | ----------- |
| `legend` | `legend`  | (Optional) A label for the form. | `string` | `undefined` |


## Methods

### `fill(fields: BillingFormFields) => Promise<void>`



#### Parameters

| Name     | Type                | Description |
| -------- | ------------------- | ----------- |
| `fields` | `BillingFormFields` |             |

#### Returns

Type: `Promise<void>`



### `getValues() => Promise<BillingFormFields>`



#### Returns

Type: `Promise<BillingFormFields>`



### `validate() => Promise<{ isValid: boolean; }>`



#### Returns

Type: `Promise<{ isValid: boolean; }>`




## Dependencies

### Used by

 - [justifi-new-payment-method](../checkout)

### Depends on

- [form-control-text](../form)
- [form-control-select](../form)

### Graph
```mermaid
graph TD;
  justifi-billing-form --> form-control-text
  justifi-billing-form --> form-control-select
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  justifi-new-payment-method --> justifi-billing-form
  style justifi-billing-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
