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
 - [justifi-payment-form](../payment-form)

### Depends on

- [form-control-text](../../ui-components/form)
- [form-control-select](../../ui-components/form)

### Graph
```mermaid
graph TD;
  justifi-billing-form --> form-control-text
  justifi-billing-form --> form-control-select
  form-control-text --> form-control-tooltip
  form-control-text --> form-control-error-text
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-select --> form-control-error-text
  justifi-new-payment-method --> justifi-billing-form
  justifi-payment-form --> justifi-billing-form
  style justifi-billing-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
