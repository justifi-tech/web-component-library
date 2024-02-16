# justifi-business-info



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `authToken`  | `auth-token`  |             | `string`  | `undefined` |
| `businessId` | `business-id` |             | `string`  | `undefined` |
| `hideErrors` | `hide-errors` |             | `boolean` | `false`     |
| `testMode`   | `test-mode`   |             | `boolean` | `false`     |


## Dependencies

### Depends on

- [justifi-business-generic-info](business-generic-info)
- [justifi-legal-address-form](legal-address-form)
- [justifi-additional-questions](additional-questions)
- [justifi-business-representative](business-representative)

### Graph
```mermaid
graph TD;
  justifi-business-form-stepped --> justifi-business-generic-info
  justifi-business-form-stepped --> justifi-legal-address-form
  justifi-business-form-stepped --> justifi-additional-questions
  justifi-business-form-stepped --> justifi-business-representative
  justifi-business-generic-info --> form-control-text
  justifi-business-generic-info --> form-control-select
  justifi-business-generic-info --> form-control-number
  justifi-business-generic-info --> form-control-number-masked
  justifi-legal-address-form --> form-control-text
  justifi-legal-address-form --> form-control-number
  justifi-legal-address-form --> form-control-select
  justifi-additional-questions --> form-control-monetary
  justifi-business-representative --> form-control-text
  justifi-business-representative --> form-control-select
  justifi-business-representative --> form-control-number-masked
  justifi-business-representative --> form-control-datepart
  justifi-business-representative --> form-control-number
  justifi-business-representative --> justifi-business-address-form
  justifi-business-address-form --> form-control-text
  justifi-business-address-form --> form-control-select
  justifi-business-address-form --> form-control-number
  style justifi-business-form-stepped fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
