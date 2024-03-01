# justifi-additional-questions



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `authToken`  | `auth-token`  |             | `string`  | `undefined` |
| `businessId` | `business-id` |             | `string`  | `undefined` |
| `isLoading`  | `is-loading`  |             | `boolean` | `false`     |


## Events

| Event       | Description | Type                           |
| ----------- | ----------- | ------------------------------ |
| `submitted` |             | `CustomEvent<{ data?: any; }>` |


## Methods

### `validateAndSubmit(onSuccess: () => Promise<void>) => Promise<void>`



#### Parameters

| Name        | Type                  | Description |
| ----------- | --------------------- | ----------- |
| `onSuccess` | `() => Promise<void>` |             |

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [justifi-business-form-stepped](..)

### Depends on

- [form-control-monetary](../../form)

### Graph
```mermaid
graph TD;
  justifi-additional-questions-form-step --> form-control-monetary
  justifi-business-form-stepped --> justifi-additional-questions-form-step
  style justifi-additional-questions-form-step fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
