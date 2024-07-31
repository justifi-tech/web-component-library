# justifi-business-info

<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                            | Default     |
| --------------------- | ----------------------- | ----------- | ------------------------------- | ----------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean`                       | `false`     |
| `authToken`           | `auth-token`            |             | `string`                        | `undefined` |
| `businessId`          | `business-id`           |             | `string`                        | `undefined` |
| `currentStep`         | `current-step`          |             | `number`                        | `undefined` |
| `handleFormLoading`   | --                      |             | `(e: CustomEvent<any>) => void` | `undefined` |
| `refs`                | --                      |             | `any[]`                         | `undefined` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `formCompleted` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [justifi-payment-provisioning-core](.)

### Depends on

- [justifi-business-owners-form-step](business-owners)

### Graph
```mermaid
graph TD;
  justifi-payment-provisioning-form-steps --> justifi-business-owners-form-step
  justifi-business-owners-form-step --> justifi-owner-form
  justifi-owner-form --> owner-form-core
  owner-form-core --> form-control-text
  owner-form-core --> form-control-number-masked
  owner-form-core --> form-control-date
  owner-form-core --> justifi-identity-address-form
  owner-form-core --> owner-form-buttons
  form-control-text --> form-control-help-text
  form-control-text --> form-control-error-text
  form-control-number-masked --> form-control-help-text
  form-control-number-masked --> form-control-error-text
  form-control-date --> form-control-help-text
  form-control-date --> form-control-error-text
  justifi-identity-address-form --> form-control-text
  justifi-identity-address-form --> form-control-select
  form-control-select --> form-control-help-text
  form-control-select --> form-control-error-text
  justifi-payment-provisioning-core --> justifi-payment-provisioning-form-steps
  style justifi-payment-provisioning-form-steps fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
