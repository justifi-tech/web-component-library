# iframe-input



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `iframeOrigin` | `iframe-origin` |             | `string` | `undefined` |
| `inputId`      | `input-id`      |             | `string` | `undefined` |
| `label`        | `label`         |             | `string` | `undefined` |


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




## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"form-control"` |             |
| `"input"`        |             |
| `"label"`        |             |


## Dependencies

### Used by

 - [bank-account-form](../../../components/checkout/bank-account-form)
 - [card-form](../../../components/checkout/card-form)

### Depends on

- [hidden-input](.)

### Graph
```mermaid
graph TD;
  iframe-input --> hidden-input
  bank-account-form --> iframe-input
  card-form --> iframe-input
  style iframe-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
