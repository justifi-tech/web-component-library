# justifi-business-representative



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute | Description | Type                      | Default     |
| ---------------- | --------- | ----------- | ------------------------- | ----------- |
| `representative` | --        |             | `IBusinessRepresentative` | `undefined` |


## Methods

### `getForm() => Promise<{ isValid: boolean; values: IBusinessRepresentative; }>`



#### Returns

Type: `Promise<{ isValid: boolean; values: IBusinessRepresentative; }>`




## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"label"` |             |


## Dependencies

### Depends on

- [text-input](../../text-input)
- [select-input](../../select-input)
- [justifi-business-address](../business-address)

### Graph
```mermaid
graph TD;
  justifi-business-representative --> text-input
  justifi-business-representative --> select-input
  justifi-business-representative --> justifi-business-address
  justifi-business-address --> text-input
  justifi-business-address --> select-input
  style justifi-business-representative fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
