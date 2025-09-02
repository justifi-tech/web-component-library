# justifi-business-info

<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description | Type                                 | Default           |
| --------------------- | ----------------------- | ----------- | ------------------------------------ | ----------------- |
| `allowOptionalFields` | `allow-optional-fields` |             | `boolean`                            | `false`           |
| `authToken`           | `auth-token`            |             | `string`                             | `undefined`       |
| `businessId`          | `business-id`           |             | `string`                             | `undefined`       |
| `country`             | `country`               |             | `CountryCode.CAN \| CountryCode.USA` | `CountryCode.USA` |
| `currentStep`         | `current-step`          |             | `number`                             | `undefined`       |
| `handleFormLoading`   | --                      |             | `(e: CustomEvent<any>) => void`      | `undefined`       |
| `refs`                | --                      |             | `any[]`                              | `undefined`       |


## Dependencies

### Used by

 - [justifi-payment-provisioning-core](.)

### Depends on

- [justifi-business-core-info-form-step](business-core-info)
- [justifi-legal-address-form-step](legal-address-form)
- [justifi-additional-questions-form-step](additional-questions)
- [justifi-business-representative-form-step](business-representative)
- [justifi-business-owners-form-step](business-owners)
- [justifi-business-bank-account-form-step](bank-account)
- [justifi-business-terms-conditions-form-step](terms-and-conditions)

### Graph
```mermaid
graph TD;
  justifi-payment-provisioning-form-steps --> justifi-business-core-info-form-step
  justifi-payment-provisioning-form-steps --> justifi-legal-address-form-step
  justifi-payment-provisioning-form-steps --> justifi-additional-questions-form-step
  justifi-payment-provisioning-form-steps --> justifi-business-representative-form-step
  justifi-payment-provisioning-form-steps --> justifi-business-owners-form-step
  justifi-payment-provisioning-form-steps --> justifi-business-bank-account-form-step
  justifi-payment-provisioning-form-steps --> justifi-business-terms-conditions-form-step
  justifi-business-core-info-form-step --> justifi-business-core-info-form-step-core
  justifi-business-core-info-form-step-core --> form-control-text
  justifi-business-core-info-form-step-core --> form-control-select
  justifi-business-core-info-form-step-core --> form-control-date
  justifi-business-core-info-form-step-core --> form-control-number-masked
  form-control-text --> form-control-tooltip
  form-control-tooltip --> custom-popper
  form-control-select --> form-control-tooltip
  form-control-date --> form-control-tooltip
  form-control-number-masked --> form-control-tooltip
  justifi-legal-address-form-step --> justifi-legal-address-form-step-core
  justifi-legal-address-form-step-core --> form-control-tooltip
  justifi-legal-address-form-step-core --> justifi-form-address-fields
  justifi-form-address-fields --> form-control-text
  justifi-form-address-fields --> form-control-select
  justifi-additional-questions-form-step --> justifi-additional-questions-form-step-core
  justifi-additional-questions-form-step-core --> form-control-tooltip
  justifi-additional-questions-form-step-core --> form-control-monetary-provisioning
  justifi-additional-questions-form-step-core --> form-control-select
  justifi-additional-questions-form-step-core --> form-control-text
  justifi-business-representative-form-step --> justifi-business-representative-form-step-core
  justifi-business-representative-form-step-core --> justifi-business-representative-form-inputs
  justifi-business-representative-form-inputs --> form-control-tooltip
  justifi-business-representative-form-inputs --> form-control-text
  justifi-business-representative-form-inputs --> form-control-number-masked
  justifi-business-representative-form-inputs --> form-control-date
  justifi-business-representative-form-inputs --> justifi-identity-address-form
  justifi-identity-address-form --> justifi-form-address-fields
  justifi-business-owners-form-step --> justifi-business-owners-form-step-core
  justifi-business-owners-form-step-core --> form-control-tooltip
  justifi-business-owners-form-step-core --> justifi-owner-form
  justifi-owner-form --> owner-form-core
  owner-form-core --> owner-form-inputs
  owner-form-inputs --> form-control-text
  owner-form-inputs --> form-control-number-masked
  owner-form-inputs --> form-control-date
  owner-form-inputs --> justifi-identity-address-form
  justifi-business-bank-account-form-step --> justifi-business-bank-account-form-step-core
  justifi-business-bank-account-form-step-core --> form-control-tooltip
  justifi-business-bank-account-form-step-core --> bank-account-form-inputs-canada
  justifi-business-bank-account-form-step-core --> bank-account-form-inputs
  justifi-business-bank-account-form-step-core --> business-documents-on-file
  justifi-business-bank-account-form-step-core --> bank-account-document-form-inputs
  bank-account-form-inputs-canada --> form-control-text
  bank-account-form-inputs-canada --> form-control-select
  bank-account-form-inputs --> form-control-text
  bank-account-form-inputs --> form-control-select
  bank-account-document-form-inputs --> form-control-file
  form-control-file --> form-control-tooltip
  justifi-business-terms-conditions-form-step --> form-control-checkbox
  justifi-payment-provisioning-core --> justifi-payment-provisioning-form-steps
  style justifi-payment-provisioning-form-steps fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
