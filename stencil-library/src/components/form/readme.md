# form-control-text



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                                    | Default     |
| -------------- | --------------- | ----------- | --------------------------------------- | ----------- |
| `defaultValue` | `default-value` |             | `string`                                | `undefined` |
| `disabled`     | `disabled`      |             | `boolean`                               | `undefined` |
| `error`        | `error`         |             | `string`                                | `undefined` |
| `inputHandler` | --              |             | `(name: string, value: string) => void` | `undefined` |
| `label`        | `label`         |             | `string`                                | `undefined` |
| `name`         | `name`          |             | `any`                                   | `undefined` |


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

 - [justifi-business-address-form](../business-form/business-address)
 - [justifi-business-generic-info](../business-form/business-generic-info)
 - [justifi-business-owners](../business-form/business-owners)
 - [justifi-business-representative](../business-form/business-representative)
 - [justifi-legal-address-form](../legal-address-form)

### Graph
```mermaid
graph TD;
  justifi-business-address-form --> form-control-text
  justifi-business-generic-info --> form-control-text
  justifi-business-owners --> form-control-text
  justifi-business-representative --> form-control-text
  justifi-legal-address-form --> form-control-text
  style form-control-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
