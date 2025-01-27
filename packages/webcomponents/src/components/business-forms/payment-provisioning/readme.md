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


## Dependencies

### Used by

 - [justifi-payment-provisioning-core](.)

### Depends on

- [justifi-business-bank-account-form-step](bank-account)
- [justifi-business-terms-conditions-form-step](terms-and-conditions)

### Graph
```mermaid
graph TD;
  justifi-payment-provisioning-form-steps --> justifi-business-bank-account-form-step
  justifi-payment-provisioning-form-steps --> justifi-business-terms-conditions-form-step
  justifi-business-bank-account-form-step --> justifi-business-bank-account-form-step-core
  justifi-business-bank-account-form-step-core --> form-control-tooltip
  justifi-business-bank-account-form-step-core --> bank-account-form-inputs
  justifi-business-bank-account-form-step-core --> business-documents-on-file
  justifi-business-bank-account-form-step-core --> bank-account-document-form-inputs
  form-control-tooltip --> custom-popper
  bank-account-form-inputs --> form-control-text
  bank-account-form-inputs --> form-control-select
  form-control-text --> form-control-tooltip
  form-control-select --> form-control-tooltip
  bank-account-document-form-inputs --> form-control-file
  form-control-file --> form-control-tooltip
  justifi-business-terms-conditions-form-step --> justifi-business-terms-conditions-text
  justifi-business-terms-conditions-form-step --> form-control-checkbox
  justifi-payment-provisioning-core --> justifi-payment-provisioning-form-steps
  style justifi-payment-provisioning-form-steps fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
