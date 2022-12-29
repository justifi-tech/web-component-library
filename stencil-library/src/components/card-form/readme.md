# justifi-card-form



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `iframeOrigin` | `iframe-origin` |             | `string` | `undefined` |


## Events

| Event              | Description | Type                          |
| ------------------ | ----------- | ----------------------------- |
| `cardFormBlur`     |             | `CustomEvent<any>`            |
| `cardFormChange`   |             | `CustomEvent<any>`            |
| `cardFormReady`    |             | `CustomEvent<any>`            |
| `cardFormTokenize` |             | `CustomEvent<{ data: any; }>` |


## Methods

### `tokenize(clientKey: string, paymentMethodMetadata: any, account?: string) => Promise<any>`



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
