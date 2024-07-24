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

 - [justifi-additional-questions](../business-forms/business-form/additional-questions)
 - [justifi-additional-questions-form-step](../business-forms/payment-provisioning/additional-questions)
 - [justifi-billing-form](../billing-form)
 - [justifi-business-bank-account-form-step](../business-forms/payment-provisioning/bank-account)
 - [justifi-business-core-info](../business-forms/business-form/business-core-info)
 - [justifi-business-core-info-form-step-core](../business-forms/payment-provisioning/business-core-info)
 - [justifi-business-representative](../business-forms/business-form/business-representative)
 - [justifi-business-representative-form-step](../business-forms/payment-provisioning/business-representative)
 - [justifi-identity-address-form](../business-forms/owner-form/identity-address)
 - [justifi-legal-address-form](../business-forms/business-form/legal-address-form)
 - [justifi-legal-address-form-step](../business-forms/payment-provisioning/legal-address-form)
 - [justifi-refund-form](../refund-form)
 - [owner-form-core](../business-forms/owner-form)

### Depends on

- [form-control-help-text](./form-helpers/form-control-help-text)
- [form-control-error-text](./form-helpers/form-control-error-text)

### Graph
```mermaid
graph TD;
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  justifi-additional-questions --> form-control-text
  justifi-additional-questions-form-step --> form-control-text
  justifi-billing-form --> form-control-text
  justifi-business-bank-account-form-step --> form-control-text
  justifi-business-core-info --> form-control-text
  justifi-business-core-info-form-step-core --> form-control-text
  justifi-business-representative --> form-control-text
  justifi-business-representative-form-step --> form-control-text
  justifi-identity-address-form --> form-control-text
  justifi-legal-address-form --> form-control-text
  justifi-legal-address-form-step --> form-control-text
  justifi-refund-form --> form-control-text
  owner-form-core --> form-control-text
  style form-control-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
