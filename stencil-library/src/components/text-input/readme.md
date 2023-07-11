# text-input



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type     | Default     |
| -------------- | --------------- | ----------- | -------- | ----------- |
| `defaultValue` | `default-value` |             | `string` | `undefined` |
| `error`        | `error`         |             | `string` | `undefined` |
| `label`        | `label`         |             | `string` | `undefined` |
| `name`         | `name`          |             | `string` | `undefined` |


## Events

| Event                | Description | Type                                            |
| -------------------- | ----------- | ----------------------------------------------- |
| `fieldReceivedInput` |             | `CustomEvent<{ name: string; value: string; }>` |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"label"` |             |


## Dependencies

### Used by

 - [justifi-billing-form](../billing-form)
 - [justifi-business-address-form](../business-form/business-address)

### Graph
```mermaid
graph TD;
  justifi-billing-form --> text-input
  justifi-business-address-form --> text-input
  style text-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
