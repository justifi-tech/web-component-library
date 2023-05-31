# justifi-business-address



<!-- Auto Generated Below -->


## Methods

### `submit() => Promise<{ isValid: boolean; values: BusinessAddressFormFields; }>`



#### Returns

Type: `Promise<{ isValid: boolean; values: BusinessAddressFormFields; }>`




## Dependencies

### Used by

 - [justifi-business-representative](../business-representative)

### Depends on

- [text-input](../../text-input)
- [select-input](../../select-input)

### Graph
```mermaid
graph TD;
  justifi-business-address --> text-input
  justifi-business-address --> select-input
  justifi-business-representative --> justifi-business-address
  style justifi-business-address fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
