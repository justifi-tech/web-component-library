# justifi-business-info



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `authToken`  | `auth-token`  |             | `string`  | `undefined` |
| `businessId` | `business-id` |             | `string`  | `undefined` |
| `hideErrors` | `hide-errors` |             | `boolean` | `false`     |
| `testMode`   | `test-mode`   |             | `boolean` | `false`     |


## Events

| Event        | Description | Type                                         |
| ------------ | ----------- | -------------------------------------------- |
| `clickEvent` |             | `CustomEvent<{ data?: any; name: string; }>` |


## Dependencies

### Depends on

- [justifi-business-core-info-form-step](business-core-info)
- [justifi-legal-address-form-step](legal-address-form)
- [justifi-additional-questions-form-step](additional-questions)
- [justifi-business-representative-form-step](business-representative)

### Graph
```mermaid
graph TD;
  justifi-business-form-stepped --> justifi-business-core-info-form-step
  justifi-business-form-stepped --> justifi-legal-address-form-step
  justifi-business-form-stepped --> justifi-additional-questions-form-step
  justifi-business-form-stepped --> justifi-business-representative-form-step
  justifi-business-core-info-form-step --> form-control-text
  justifi-business-core-info-form-step --> form-control-select
  justifi-business-core-info-form-step --> form-control-number-masked
  justifi-legal-address-form-step --> form-control-text
  justifi-legal-address-form-step --> form-control-number
  justifi-legal-address-form-step --> form-control-select
  justifi-additional-questions-form-step --> form-control-monetary
  justifi-business-representative-form-step --> form-control-text
  justifi-business-representative-form-step --> form-control-select
  justifi-business-representative-form-step --> form-control-number-masked
  justifi-business-representative-form-step --> form-control-datepart
  justifi-business-representative-form-step --> form-control-number
  justifi-business-representative-form-step --> justifi-business-address-form
  justifi-business-address-form --> form-control-text
  justifi-business-address-form --> form-control-select
  justifi-business-address-form --> form-control-number
  style justifi-business-form-stepped fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
