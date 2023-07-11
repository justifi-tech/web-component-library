# text-field

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                                  | Default     |
| -------------- | --------------- | ----------- | ------------------------------------- | ----------- |
| `defaultValue` | `default-value` |             | `string`                              | `undefined` |
| `error`        | `error`         |             | `string`                              | `undefined` |
| `label`        | `label`         |             | `string`                              | `undefined` |
| `name`         | `name`          |             | `string`                              | `undefined` |
| `options`      | --              |             | `{ label: string; value: string; }[]` | `[]`        |


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

### Graph
```mermaid
graph TD;
  justifi-billing-form --> select-input
  style select-input fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
