# billing-form



<!-- Auto Generated Below -->


## Methods

### `getValues() => Promise<BillingFormFields>`



#### Returns

Type: `Promise<BillingFormFields>`



### `validate() => Promise<{ isValid: boolean; }>`



#### Returns

Type: `Promise<{ isValid: boolean; }>`




## Dependencies

### Used by

 - [justifi-payment-form](../payment-form)

### Depends on

- [text-input](../text-input)
- [select-input](../select-input)

### Graph
```mermaid
graph TD;
  justifi-billing-form --> text-input
  justifi-billing-form --> select-input
  justifi-payment-form --> justifi-billing-form
  style justifi-billing-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
