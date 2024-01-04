# justifi-payment-method-form



<!-- Auto Generated Below -->


## Properties

| Property                          | Attribute                             | Description | Type                                                           | Default     |
| --------------------------------- | ------------------------------------- | ----------- | -------------------------------------------------------------- | ----------- |
| `iframeOrigin`                    | `iframe-origin`                       |             | `string`                                                       | `undefined` |
| `paymentMethodFormType`           | `payment-method-form-type`            |             | `"bankAccount" \| "card"`                                      | `undefined` |
| `paymentMethodFormValidationMode` | `payment-method-form-validation-mode` |             | `"all" \| "onBlur" \| "onChange" \| "onSubmit" \| "onTouched"` | `undefined` |
| `singleLine`                      | `single-line`                         |             | `boolean`                                                      | `undefined` |


## Events

| Event                       | Description | Type                          |
| --------------------------- | ----------- | ----------------------------- |
| `paymentMethodFormReady`    |             | `CustomEvent<any>`            |
| `paymentMethodFormTokenize` |             | `CustomEvent<{ data: any; }>` |


## Methods

### `resize() => Promise<any>`



#### Returns

Type: `Promise<any>`



### `tokenize(clientId: string, paymentMethodMetadata: any, account?: string) => Promise<CreatePaymentMethodResponse>`



#### Parameters

| Name                    | Type     | Description |
| ----------------------- | -------- | ----------- |
| `clientId`              | `string` |             |
| `paymentMethodMetadata` | `any`    |             |
| `account`               | `string` |             |

#### Returns

Type: `Promise<CreatePaymentMethodResponse>`



### `validate() => Promise<any>`



#### Returns

Type: `Promise<any>`




## Dependencies

### Used by

 - [justifi-bank-account-form](../bank-account-form)
 - [justifi-card-form](../card-form)
 - [justifi-payment-form](../payment-form)

### Graph
```mermaid
graph TD;
  justifi-bank-account-form --> justifi-payment-method-form
  justifi-card-form --> justifi-payment-method-form
  justifi-payment-form --> justifi-payment-method-form
  style justifi-payment-method-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
