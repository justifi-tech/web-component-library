# justifi-card-form



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute             | Description | Type                                                           | Default     |
| -------------------- | --------------------- | ----------- | -------------------------------------------------------------- | ----------- |
| `validationStrategy` | `validation-strategy` |             | `"all" \| "onBlur" \| "onChange" \| "onSubmit" \| "onTouched"` | `undefined` |


## Events

| Event              | Description | Type                                            |
| ------------------ | ----------- | ----------------------------------------------- |
| `cardFormReady`    |             | `CustomEvent<any>`                              |
| `cardFormTokenize` |             | `CustomEvent<{ data: any; }>`                   |
| `cardFormValidate` |             | `CustomEvent<{ data: { isValid: boolean; }; }>` |


## Methods

### `tokenize(clientKey: string, paymentMethodMetadata: any, account?: string) => Promise<any>`



#### Returns

Type: `Promise<any>`



### `validate() => Promise<any>`



#### Returns

Type: `Promise<any>`




## Dependencies

### Depends on

- [justifi-payment-method-form](../payment-method-form)

### Graph
```mermaid
graph TD;
  justifi-card-form --> justifi-payment-method-form
  style justifi-card-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
