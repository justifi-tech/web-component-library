# form-control-text

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `iframeOrigin` | `iframe-origin` |             | `string` | `undefined` |
| `inputId`      | `input-id`      |             | `string` | `undefined` |
| `label`        | `label`         |             | `string` | `undefined` |


## Events

| Event          | Description | Type                |
| -------------- | ----------- | ------------------- |
| `iframeLoaded` |             | `CustomEvent<void>` |


## Methods

### `tokenize(clientId: string, paymentMethodMetadata: any, account?: string) => Promise<any>`



#### Parameters

| Name                    | Type     | Description |
| ----------------------- | -------- | ----------- |
| `clientId`              | `string` |             |
| `paymentMethodMetadata` | `any`    |             |
| `account`               | `string` |             |

#### Returns

Type: `Promise<any>`



### `validate() => Promise<any>`



#### Returns

Type: `Promise<any>`




## Dependencies

### Used by

 - [bank-account-form](../../components/checkout/bank-account-form)
 - [card-form](../../components/checkout/card-form)
 - [justifi-bank-account-form](../../components/modular-checkout-parts)
 - [justifi-card-form](../../components/modular-checkout-parts)

### Graph
```mermaid
graph TD;
  bank-account-form --> iframe-input
  card-form --> iframe-input
  justifi-bank-account-form --> iframe-input
  justifi-card-form --> iframe-input
  style iframe-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
