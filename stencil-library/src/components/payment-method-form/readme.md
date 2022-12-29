# justifi-payment-method-form



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `iframeOrigin` | `iframe-origin` |             | `string` | `undefined` |


## Events

| Event                       | Description | Type                          |
| --------------------------- | ----------- | ----------------------------- |
| `paymentMethodFormBlur`     |             | `CustomEvent<any>`            |
| `paymentMethodFormChange`   |             | `CustomEvent<any>`            |
| `paymentMethodFormReady`    |             | `CustomEvent<any>`            |
| `paymentMethodFormTokenize` |             | `CustomEvent<{ data: any; }>` |


## Methods

### `tokenize(clientKey: string, paymentMethodMetadata: any, account?: string) => Promise<any>`



#### Returns

Type: `Promise<any>`




## Dependencies

### Used by

 - [justifi-bank-account-form](../bank-account-form)
 - [justifi-card-form](../card-form)

### Graph
```mermaid
graph TD;
  justifi-bank-account-form --> justifi-payment-method-form
  justifi-card-form --> justifi-payment-method-form
  style justifi-payment-method-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
