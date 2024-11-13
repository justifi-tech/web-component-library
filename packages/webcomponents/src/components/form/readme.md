# form-control-text



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute       | Description | Type                                    | Default     |
| ---------------- | --------------- | ----------- | --------------------------------------- | ----------- |
| `defaultValue`   | `default-value` |             | `string`                                | `undefined` |
| `disabled`       | `disabled`      |             | `boolean`                               | `undefined` |
| `errorText`      | `error-text`    |             | `string`                                | `undefined` |
| `helpText`       | `help-text`     |             | `string`                                | `undefined` |
| `inputHandler`   | --              |             | `(name: string, value: string) => void` | `undefined` |
| `keyDownHandler` | --              |             | `(event: any) => void`                  | `undefined` |
| `label`          | `label`         |             | `string`                                | `undefined` |
| `maxLength`      | `max-length`    |             | `number`                                | `undefined` |
| `name`           | `name`          |             | `any`                                   | `undefined` |


## Events

| Event              | Description | Type               |
| ------------------ | ----------- | ------------------ |
| `formControlBlur`  |             | `CustomEvent<any>` |
| `formControlInput` |             | `CustomEvent<any>` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"label"` |             |


## Dependencies

### Used by

 - [justifi-additional-statement](../dispute-management/counter-dispute)
 - [justifi-cancellation-policy](../dispute-management/counter-dispute)
 - [justifi-customer-details](../dispute-management/counter-dispute)
 - [justifi-duplicate-charge](../dispute-management/counter-dispute)
 - [justifi-electronic-evidence](../dispute-management/counter-dispute)
 - [justifi-refund-policy](../dispute-management/counter-dispute)
 - [justifi-shipping-details](../dispute-management/counter-dispute)

### Depends on

- [form-control-help-text](./form-helpers/form-control-help-text)
- [form-control-error-text](./form-helpers/form-control-error-text)

### Graph
```mermaid
graph TD;
  form-control-textarea --> form-control-help-text
  form-control-textarea --> form-control-error-text
  justifi-additional-statement --> form-control-textarea
  justifi-cancellation-policy --> form-control-textarea
  justifi-customer-details --> form-control-textarea
  justifi-duplicate-charge --> form-control-textarea
  justifi-electronic-evidence --> form-control-textarea
  justifi-refund-policy --> form-control-textarea
  justifi-shipping-details --> form-control-textarea
  style form-control-textarea fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
