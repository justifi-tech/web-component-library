# form-control-text



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `defaultValue` | `default-value` |             | `string` | `undefined` |
| `error`        | `error`         |             | `string` | `undefined` |
| `label`        | `label`         |             | `string` | `undefined` |
| `name`         | `name`          |             | `any`    | `undefined` |


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
 - [justifi-business-form](../business-form)
 - [justifi-business-representative](../business-form/business-representative)

### Graph
```mermaid
graph TD;
  justifi-business-address-form --> form-control-text
  justifi-business-form --> form-control-text
  justifi-business-representative --> form-control-text
  style form-control-text fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
