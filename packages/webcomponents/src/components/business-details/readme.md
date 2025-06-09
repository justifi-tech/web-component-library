# justifi-business-details



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type     | Default     |
| ------------ | ------------- | ----------- | -------- | ----------- |
| `authToken`  | `auth-token`  |             | `string` | `undefined` |
| `businessId` | `business-id` |             | `string` | `undefined` |


## Events

| Event         | Description | Type                               |
| ------------- | ----------- | ---------------------------------- |
| `error-event` |             | `CustomEvent<ComponentErrorEvent>` |


## Dependencies

### Depends on

- [business-details-core](.)

### Graph
```mermaid
graph TD;
  justifi-business-details --> business-details-core
  business-details-core --> justifi-details
  business-details-core --> core-info-details
  business-details-core --> legal-address-details
  business-details-core --> representative-details
  business-details-core --> owner-details
  business-details-core --> additional-questions-details
  style justifi-business-details fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
